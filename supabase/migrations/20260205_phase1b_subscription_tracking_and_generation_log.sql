-- Phase 1B: Subscription Tracking & Document Generation Log
-- Adds subscription tier tracking to organizations and creates document_generation_log table

-- Add subscription tier tracking columns to organizations
ALTER TABLE organizations 
  ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS tokens_used_this_month INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS token_reset_date TIMESTAMPTZ DEFAULT (date_trunc('month', now()) + interval '1 month');

-- Create document generation log table for tracking AI usage
CREATE TABLE IF NOT EXISTS document_generation_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID,
  document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  ai_system_id UUID REFERENCES ai_systems(id) ON DELETE SET NULL,
  document_type TEXT NOT NULL,
  tokens_input INTEGER DEFAULT 0,
  tokens_output INTEGER DEFAULT 0,
  model_used TEXT,
  generation_time_ms INTEGER,
  status TEXT DEFAULT 'completed',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on document_generation_log
ALTER TABLE document_generation_log ENABLE ROW LEVEL SECURITY;

-- RLS policies for document_generation_log
CREATE POLICY "Users can view their org generation logs"
  ON document_generation_log FOR SELECT
  USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Users can insert generation logs for their org"
  ON document_generation_log FOR INSERT
  WITH CHECK (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_document_generation_log_org_id ON document_generation_log(organization_id);
CREATE INDEX IF NOT EXISTS idx_document_generation_log_created_at ON document_generation_log(created_at);
