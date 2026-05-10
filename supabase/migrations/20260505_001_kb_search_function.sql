-- Migration: Add unique constraint on title + match_knowledge_base RPC function
-- Required by TICKET-V01 for idempotent upsert and similarity search

-- Unique constraint on title for upsert idempotency
ALTER TABLE knowledge_base ADD CONSTRAINT knowledge_base_title_unique UNIQUE (title);

-- Similarity search function using pgvector cosine distance
CREATE OR REPLACE FUNCTION match_knowledge_base(
    query_embedding vector(1536),
    match_threshold float DEFAULT 0.5,
    match_count int DEFAULT 5
)
RETURNS TABLE (
    id uuid,
    title text,
    content text,
    category text,
    metadata jsonb,
    similarity float
)
LANGUAGE sql STABLE
AS $$
    SELECT
        kb.id,
        kb.title,
        kb.content,
        kb.category,
        kb.metadata,
        1 - (kb.embedding <=> query_embedding) AS similarity
    FROM knowledge_base kb
    WHERE 1 - (kb.embedding <=> query_embedding) > match_threshold
    ORDER BY kb.embedding <=> query_embedding
    LIMIT match_count;
$$;
