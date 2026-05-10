#!/usr/bin/env python3
"""
TICKET-V02: Verify RAG retrieval pipeline end-to-end.

This script simulates the exact n8n rag-retrieval workflow:
  1. Embed query via OpenAI text-embedding-3-small
  2. Similarity search via Supabase match_knowledge_base RPC (threshold=0.35, top 3)
  3. Format results with similarity scores
  4. If top similarity < 0.35 → empty array

Usage:
  python scripts/test_rag_pipeline.py                # Run all test queries
  python scripts/test_rag_pipeline.py "custom query"  # Run single query
"""

import os
import sys
import json
from pathlib import Path
from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parent.parent
load_dotenv(ROOT / ".env")

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not all([OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY]):
    print("ERROR: Missing env vars. Need OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY")
    sys.exit(1)

from openai import OpenAI
from supabase import create_client

openai_client = OpenAI(api_key=OPENAI_API_KEY)
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

EMBEDDING_MODEL = "text-embedding-3-small"
SIMILARITY_THRESHOLD = 0.35
MATCH_COUNT = 3


def rag_retrieve(query: str) -> dict:
    """Simulate the n8n rag-retrieval workflow exactly."""

    # Step 1: Embed query
    emb_response = openai_client.embeddings.create(
        model=EMBEDDING_MODEL,
        input=query,
    )
    embedding = emb_response.data[0].embedding

    # Step 2: Similarity search (threshold=0.35, top 3)
    search_response = supabase.rpc("match_knowledge_base", {
        "query_embedding": embedding,
        "match_threshold": SIMILARITY_THRESHOLD,
        "match_count": MATCH_COUNT,
    }).execute()

    raw_chunks = search_response.data or []

    # Step 3: Design decision #3 — if top similarity < 0.35, return empty
    if not raw_chunks or raw_chunks[0].get("similarity", 0) < SIMILARITY_THRESHOLD:
        chunks = []
    else:
        chunks = raw_chunks[:MATCH_COUNT]

    # Step 4: Format with similarity scores visible (design decision #2)
    results = []
    for i, c in enumerate(chunks):
        results.append({
            "rank": i + 1,
            "title": c["title"],
            "content": c["content"],
            "category": c["category"],
            "similarity": round(c["similarity"], 4),
            "metadata": c.get("metadata", {}),
        })

    return {
        "query": query,
        "chunk_count": len(results),
        "chunks": results,
        "has_matches": len(results) > 0,
    }


def print_result(result: dict):
    """Pretty-print a RAG retrieval result."""
    print(f"\n{'─' * 60}")
    print(f"Query: \"{result['query']}\"")
    print(f"Matches: {result['chunk_count']}")
    print(f"Has matches: {result['has_matches']}")

    if result["chunks"]:
        for c in result["chunks"]:
            print(f"  #{c['rank']}: [{c['category']:10}] {c['title']} (sim={c['similarity']:.4f})")
        # Show content preview for top match
        top = result["chunks"][0]
        preview = top["content"][:200].replace("\n", " ")
        print(f"\n  Top match preview: {preview}...")
    else:
        print("  → Empty array. LLM should use fallback response.")


def run_tests():
    """Run standard test queries matching TICKET-V02 requirements."""

    test_queries = [
        # Swedish service query
        "Jag behöver hjälp med ett CRM-system",
        # Swedish pricing query
        "vad kostar det att bygga en hemsida",
        # English cross-language
        "I'm worried about ROI",
        # Case study retrieval
        "har ni jobbat med bilskolor",
        # Broad overview
        "vad gör ni för svenska företag",
        # Booking-specific
        "kan ni bygga en bokningssida åt mig",
        # Should return weak/no matches (gibberish)
        "xyzzy foobar quantum entanglement recipe",
        # Edge: voice-related
        "vi behöver en telefonist som svarar dygnet runt",
    ]

    print("=" * 60)
    print("TICKET-V02: RAG Retrieval Pipeline Test")
    print(f"Threshold: {SIMILARITY_THRESHOLD}")
    print(f"Max chunks: {MATCH_COUNT}")
    print(f"Model: {EMBEDDING_MODEL}")
    print("=" * 60)

    all_results = []
    for q in test_queries:
        result = rag_retrieve(q)
        print_result(result)
        all_results.append(result)

    # Save results
    results_path = ROOT / "scripts" / "test_rag_results.md"
    save_results(all_results, results_path)

    # Summary
    print(f"\n{'=' * 60}")
    matched = sum(1 for r in all_results if r["has_matches"])
    empty = sum(1 for r in all_results if not r["has_matches"])
    print(f"SUMMARY: {matched} queries returned chunks, {empty} returned empty array")
    print(f"Results saved to {results_path}")
    print(f"{'=' * 60}")


def save_results(results: list[dict], path: Path):
    """Save results to markdown."""
    from datetime import datetime

    lines = [
        "# RAG Retrieval Pipeline Test Results",
        "",
        f"**Date:** {datetime.now().strftime('%Y-%m-%d %H:%M')}",
        f"**Threshold:** {SIMILARITY_THRESHOLD}",
        f"**Max chunks:** {MATCH_COUNT}",
        f"**Model:** {EMBEDDING_MODEL}",
        "",
        "---",
        "",
    ]

    for r in results:
        lines.append(f"## Query: \"{r['query']}\"")
        lines.append("")
        lines.append(f"**Matches:** {r['chunk_count']} | **Has matches:** {r['has_matches']}")
        lines.append("")

        if r["chunks"]:
            lines.append("| Rank | Category | Title | Similarity |")
            lines.append("|------|----------|-------|------------|")
            for c in r["chunks"]:
                lines.append(f"| #{c['rank']} | {c['category']} | {c['title']} | {c['similarity']:.4f} |")
        else:
            lines.append("→ Empty array returned. LLM fallback triggered.")

        lines.append("")
        lines.append("---")
        lines.append("")

    path.write_text("\n".join(lines), encoding="utf-8")


def main():
    if len(sys.argv) > 1:
        # Single custom query
        query = " ".join(sys.argv[1:])
        result = rag_retrieve(query)
        print_result(result)
        # Also print raw JSON for debugging
        print(f"\n--- Raw JSON ---")
        output = {k: v for k, v in result.items()}
        for c in output.get("chunks", []):
            c["content"] = c["content"][:300] + "..."
        print(json.dumps(output, indent=2, ensure_ascii=False))
    else:
        run_tests()


if __name__ == "__main__":
    main()
