#!/usr/bin/env python3
"""Debug retrieval quality — one-off diagnostic script."""

import os, sys, json
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not all([OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY]):
    print("ERROR: Missing env vars"); sys.exit(1)

from openai import OpenAI
from supabase import create_client

openai_client = OpenAI(api_key=OPENAI_API_KEY)
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

def embed(text):
    r = openai_client.embeddings.create(model="text-embedding-3-small", input=text)
    return r.data[0].embedding

def search(query, count=3):
    emb = embed(query)
    res = supabase.rpc("match_knowledge_base", {
        "query_embedding": emb,
        "match_threshold": 0.0,  # show everything
        "match_count": count,
    }).execute()
    return res.data or []

# --- Query 1 ---
print("=" * 70)
print('QUERY 1: "bygger ni mobilappar"')
print("=" * 70)
for i, m in enumerate(search("bygger ni mobilappar")):
    print(f"\n  #{i+1}  similarity={m['similarity']:.4f}")
    print(f"      title: {m['title']}")
    print(f"      category: {m['category']}")

# --- Query 2 ---
print("\n" + "=" * 70)
print('QUERY 2: "hur snabbt får jag svar om något går sönder"')
print("=" * 70)
for i, m in enumerate(search("hur snabbt får jag svar om något går sönder")):
    print(f"\n  #{i+1}  similarity={m['similarity']:.4f}")
    print(f"      title: {m['title']}")
    print(f"      category: {m['category']}")

# --- Chunk inspection ---
print("\n" + "=" * 70)
print("CHUNK INSPECTION")
print("=" * 70)

for title in ["Vad vi inte gör", "Paket: Drift- och säkerhetsavtal"]:
    res = supabase.table("knowledge_base").select("title, content").eq("title", title).execute()
    if res.data:
        row = res.data[0]
        print(f"\n{'─' * 60}")
        print(f"TITLE: {row['title']}")
        print(f"{'─' * 60}")
        print(row['content'])
    else:
        print(f"\n⚠️  No chunk found with title: '{title}'")

# --- Total count ---
res = supabase.table("knowledge_base").select("id", count="exact").execute()
print(f"\n{'=' * 70}")
print(f"TOTAL CHUNKS IN knowledge_base: {res.count}")
print("=" * 70)
