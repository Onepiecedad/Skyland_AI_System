#!/usr/bin/env python3
"""
TICKET-V01: Populate Skyland knowledge_base with embedded chunks from Hemsida_3_0.txt

Usage:
  python scripts/populate_knowledge_base.py          # Insert/upsert all chunks
  python scripts/populate_knowledge_base.py --verify  # Run verification queries only
  python scripts/populate_knowledge_base.py --count   # Show current row count

Requires env vars: OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY
"""

import os
import sys
import json
import argparse
import re
from pathlib import Path

from dotenv import load_dotenv

# Load .env from project root
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
SOURCE_FILE = ROOT / "KUNSKAPSBAS.md"

# =============================================================================
# CHUNKING DECISIONS
#
# The source document uses H2 (##) headings as section boundaries.
# Each H2 section maps to exactly one chunk. This gives us ~38 chunks:
#
#   - 1 about/identity:   "Skyland AI Solutions — Vilka vi är" → tech
#   - 1 philosophy:       "Vår filosofi" → tech
#   - 1 service overview: "Vad vi gör — Översikt" → service
#   - 6 detailed services: CRM, AI-agenter, Voice, Hemsidor, Prompt, Automation → service
#   - 4 case studies:     Cold Experience, MarinMekaniker, Hasselblads, Bilskola → case_study
#   - 8 industry:         Bygg, Hotell, Restaurang, Frisör, Konsult, E-handel, Mäklare, Hälsovård → industry
#   - 4 pricing packages: Starter, Hemsidor, Custom, Drift → tech
#   - 7 FAQ pairs:        Priser, Tid, Fortsätta, Värt det, System, Säkert, Tekniska → faq
#   - 1 founder bio:      "Om Joakim Landqvist" → tech
#   - 1 ICP:              "Vilka vi jobbar bäst med" → tech
#   - 1 scope:            "Vad vi inte gör" → tech
#   - 1 process:          "Hur vi jobbar" → tech
#   - 1 onboarding:       "Onboarding" → tech
#   - 1 contact:          "Kontakt och boka samtal" → tech
#
# Total: ~38 chunks. Some "tech" chunks are small (~100 tokens) but they are
# semantically distinct and must not be merged with unrelated content.
#
# The "service overview" chunk duplicates information from the 6 detailed service
# chunks, but serves as a landing chunk for broad queries like "vad gör ni?".
# =============================================================================


def parse_chunks(filepath: Path) -> list[dict]:
    """Parse Hemsida_3_0.txt into semantic chunks based on H2 headings."""
    text = filepath.read_text(encoding="utf-8")
    # Normalize line endings
    text = text.replace("\r\n", "\n").replace("\r", "\n")

    # Split on H2 headings (## ...)
    # We use a regex that captures the heading text
    sections = re.split(r"\n## ", text)

    chunks = []
    for i, section in enumerate(sections):
        if i == 0:
            # First section is the preamble (metadata header), skip it
            continue

        # Re-add the ## prefix for parsing
        lines = section.strip().split("\n")
        heading = lines[0].strip()
        body = "\n".join(lines[1:]).strip()

        # Remove leading/trailing --- separators
        body = body.strip().strip("-").strip()

        if not body:
            continue

        # Classify by heading
        title, category = classify_chunk(heading, body)

        # Build self-contained content: include title context in body
        content = f"{heading}\n\n{body}"

        chunks.append({
            "title": title,
            "content": content,
            "category": category,
            "metadata": {
                "source": "KUNSKAPSBAS.md",
                "chunk_index": len(chunks),
                "language": "sv",
                "heading": heading,
            },
        })

    return chunks


def classify_chunk(heading: str, body: str) -> tuple[str, str]:
    """Map H2 heading to (title, category)."""

    h = heading.lower()

    # Services
    if h.startswith("tjänst:"):
        name = heading.split(":", 1)[1].strip()
        return (f"Tjänst: {name}", "service")

    if "översikt av tjänster" in h or "vad vi gör" in h:
        return ("Översikt av tjänster", "service")

    # Case studies
    if h.startswith("case study:"):
        name = heading.split(":", 1)[1].strip()
        return (f"Case study: {name}", "case_study")

    # FAQ
    if h.startswith("faq:"):
        question = heading.split(":", 1)[1].strip()
        return (f"FAQ: {question}", "faq")

    # Pricing packages
    if h.startswith("paketet:"):
        name = heading.split(":", 1)[1].strip()
        return (f"Paket: {name}", "tech")

    # About / tech
    if "joakim" in h:
        return ("Om Joakim Landqvist", "tech")
    if "filosofi" in h:
        return ("Skylands filosofi", "tech")
    if "vilka vi är" in h:
        return ("Skyland AI Solutions — Vilka vi är", "tech")
    if "icp" in h or "vilka vi jobbar" in h:
        return ("ICP — Vilka vi jobbar bäst med", "tech")
    if "vad vi inte gör" in h:
        return ("Vad vi inte gör", "tech")
    if "hur vi jobbar" in h or "process" in h:
        return ("Hur vi jobbar — Process", "tech")
    if "onboarding" in h:
        return ("Onboarding — Hur det går till", "tech")
    if "kontakt" in h:
        return ("Kontakt och boka samtal", "tech")

    # Industry sections (branschspecifika)
    industry_keywords = {
        "bygg": "Bransch: Bygg och hantverk",
        "hotell": "Bransch: Hotell och B&B",
        "restaurang": "Bransch: Restaurang och café",
        "frisör": "Bransch: Frisör, skönhet och spa",
        "konsultbyrå": "Bransch: Konsultbyråer och tjänsteföretag",
        "e-handelsföretag": "Bransch: E-handel",
        "e-handel": "Bransch: E-handel",
        "mäklare": "Bransch: Mäklare och fastighet",
        "tandläkarmottagningar": "Bransch: Hälsovård",
        "naprapater": "Bransch: Hälsovård",
    }
    for keyword, title in industry_keywords.items():
        if keyword in h:
            return (title, "industry")

    # Fallback
    return (heading, "tech")


def embed_text(text: str) -> list[float]:
    """Generate embedding using text-embedding-3-small."""
    response = openai_client.embeddings.create(
        model=EMBEDDING_MODEL,
        input=text,
    )
    return response.data[0].embedding


def upsert_chunks(chunks: list[dict]):
    """Upsert all chunks into knowledge_base table."""
    total = len(chunks)
    print(f"\nUpserting {total} chunks into knowledge_base...\n")

    for i, chunk in enumerate(chunks):
        # Generate embedding from content (not just title)
        embedding = embed_text(chunk["content"])

        row = {
            "title": chunk["title"],
            "content": chunk["content"],
            "category": chunk["category"],
            "embedding": embedding,
            "metadata": chunk["metadata"],
        }

        # Upsert by title for idempotency
        supabase.table("knowledge_base").upsert(
            row, on_conflict="title"
        ).execute()

        print(f"  Inserted {i + 1}/{total}: {chunk['category'].upper()} — {chunk['title']}")

    # Verify count
    result = supabase.table("knowledge_base").select("id", count="exact").execute()
    print(f"\n✅ Done. Total rows in knowledge_base: {result.count}")


def verify_queries():
    """Run the three test queries from TICKET-V01 Definition of Done."""
    queries = [
        {
            "query": "vad kostar det",
            "expected_category": "faq",
            "expected_keyword": "kostar",
            "description": "Should return FAQ pricing chunk",
        },
        {
            "query": "har ni jobbat med bilskolor",
            "expected_category": "case_study",
            "expected_keyword": "Bilskola",
            "description": "Should return Norra Hamnens Bilskola case study",
        },
        {
            "query": "I'm worried about ROI",
            "expected_category": "faq",
            "expected_keyword": "värt",
            "description": "Should return FAQ about 'Hur vet jag om det är värt det?'",
        },
    ]

    results = []
    all_passed = True

    print("\n" + "=" * 60)
    print("VERIFICATION QUERIES")
    print("=" * 60)

    for q in queries:
        # Embed the query
        query_embedding = embed_text(q["query"])

        # Call Supabase RPC for similarity search
        # Using the match_knowledge_base function or raw query
        response = supabase.rpc("match_knowledge_base", {
            "query_embedding": query_embedding,
            "match_threshold": 0.0,
            "match_count": 3,
        }).execute()

        top_matches = response.data if response.data else []

        # Check results
        passed = False
        if top_matches:
            top = top_matches[0]
            if q["expected_keyword"].lower() in top.get("title", "").lower() or \
               q["expected_keyword"].lower() in top.get("content", "").lower():
                passed = True

        status = "✅ PASS" if passed else "❌ FAIL"
        if not passed:
            all_passed = False

        print(f"\n{'─' * 50}")
        print(f"Query: \"{q['query']}\"")
        print(f"Expected: {q['description']}")
        print(f"Status: {status}")
        if top_matches:
            for j, m in enumerate(top_matches[:3]):
                sim = m.get("similarity", "?")
                print(f"  #{j + 1}: [{m.get('category', '?')}] {m.get('title', '?')} (sim={sim:.4f})" if isinstance(sim, float) else f"  #{j + 1}: [{m.get('category', '?')}] {m.get('title', '?')} (sim={sim})")
        else:
            print("  No matches returned!")

        results.append({
            "query": q["query"],
            "expected": q["description"],
            "passed": passed,
            "top_matches": [
                {
                    "title": m.get("title", ""),
                    "category": m.get("category", ""),
                    "similarity": m.get("similarity", 0),
                }
                for m in top_matches[:3]
            ],
        })

    print(f"\n{'=' * 60}")
    print(f"RESULT: {'ALL PASSED ✅' if all_passed else 'SOME FAILED ❌'}")
    print(f"{'=' * 60}\n")

    # Save results to file
    results_path = ROOT / "scripts" / "test_kb_results.md"
    save_results(results, results_path, all_passed)

    return all_passed


def save_results(results: list[dict], path: Path, all_passed: bool):
    """Save verification results to markdown file."""
    lines = [
        "# Knowledge Base Verification Results",
        "",
        f"**Date:** {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M')}",
        f"**Status:** {'✅ ALL PASSED' if all_passed else '❌ SOME FAILED'}",
        f"**Model:** {EMBEDDING_MODEL}",
        "",
        "---",
        "",
    ]

    for r in results:
        status = "✅ PASS" if r["passed"] else "❌ FAIL"
        lines.append(f"## Query: \"{r['query']}\"")
        lines.append("")
        lines.append(f"**Expected:** {r['expected']}")
        lines.append(f"**Result:** {status}")
        lines.append("")
        lines.append("| Rank | Category | Title | Similarity |")
        lines.append("|------|----------|-------|------------|")
        for j, m in enumerate(r["top_matches"]):
            sim = f"{m['similarity']:.4f}" if isinstance(m['similarity'], float) else str(m['similarity'])
            lines.append(f"| #{j + 1} | {m['category']} | {m['title']} | {sim} |")
        lines.append("")
        lines.append("---")
        lines.append("")

    path.write_text("\n".join(lines), encoding="utf-8")
    print(f"Results saved to {path}")


def show_count():
    """Show current row count in knowledge_base."""
    result = supabase.table("knowledge_base").select("id", count="exact").execute()
    print(f"Current rows in knowledge_base: {result.count}")


def main():
    parser = argparse.ArgumentParser(description="Populate Skyland knowledge base")
    parser.add_argument("--verify", action="store_true", help="Run verification queries only")
    parser.add_argument("--count", action="store_true", help="Show row count only")
    args = parser.parse_args()

    if args.count:
        show_count()
        return

    if args.verify:
        verify_queries()
        return

    # Parse and insert
    if not SOURCE_FILE.exists():
        print(f"ERROR: Source file not found: {SOURCE_FILE}")
        sys.exit(1)

    chunks = parse_chunks(SOURCE_FILE)
    print(f"Parsed {len(chunks)} chunks from {SOURCE_FILE.name}:")
    for c in chunks:
        print(f"  [{c['category']:10}] {c['title']}")

    upsert_chunks(chunks)

    # Run verification after insert
    print("\n\nRunning verification queries...\n")
    verify_queries()


if __name__ == "__main__":
    main()
