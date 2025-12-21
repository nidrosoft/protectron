-- Add trust_center_enabled and logo_url columns to organizations table
ALTER TABLE organizations 
ADD COLUMN IF NOT EXISTS trust_center_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Comment for documentation
COMMENT ON COLUMN organizations.trust_center_enabled IS 'Whether the public trust center page is enabled for this organization';
COMMENT ON COLUMN organizations.logo_url IS 'URL to the organization logo stored in Supabase storage';
