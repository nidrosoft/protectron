-- Add content column to documents table for storing rich text HTML content
ALTER TABLE documents ADD COLUMN IF NOT EXISTS content TEXT;

-- Add a comment explaining the column
COMMENT ON COLUMN documents.content IS 'HTML content from the rich text editor';
