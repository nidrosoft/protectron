-- Phase 5B: Compliance Certifications & Badges
-- Creates certification records for verified compliance, linked to organizations and AI systems

CREATE TABLE IF NOT EXISTS public.compliance_certifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  ai_system_id uuid REFERENCES public.ai_systems(id) ON DELETE SET NULL,
  
  -- Certification details
  certificate_number text NOT NULL UNIQUE,
  certification_type text NOT NULL DEFAULT 'quick_comply', -- 'quick_comply', 'full_assessment', 'manual'
  risk_level text NOT NULL DEFAULT 'minimal', -- 'minimal', 'limited', 'high'
  compliance_score integer NOT NULL DEFAULT 0, -- 0-100
  
  -- AI system snapshot
  ai_system_name text NOT NULL,
  ai_system_description text,
  
  -- Badge configuration
  badge_style text NOT NULL DEFAULT 'standard', -- 'standard', 'compact', 'detailed'
  badge_color text NOT NULL DEFAULT '#7F56D9', -- brand primary
  
  -- Status
  status text NOT NULL DEFAULT 'active', -- 'active', 'expired', 'revoked', 'suspended'
  issued_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '1 year'),
  revoked_at timestamptz,
  revoked_reason text,
  
  -- Metadata
  documents_generated text[] DEFAULT '{}', -- list of document types generated
  assessment_data jsonb DEFAULT '{}'::jsonb, -- snapshot of assessment answers
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.compliance_certifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own org certifications"
  ON public.compliance_certifications
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create certifications for own org"
  ON public.compliance_certifications
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
    )
  );

-- Public read for verification (anyone can verify a certificate by number)
CREATE POLICY "Anyone can verify a certificate"
  ON public.compliance_certifications
  FOR SELECT
  USING (status = 'active');

-- Indexes
CREATE INDEX IF NOT EXISTS idx_certifications_org ON public.compliance_certifications(organization_id);
CREATE INDEX IF NOT EXISTS idx_certifications_number ON public.compliance_certifications(certificate_number);
CREATE INDEX IF NOT EXISTS idx_certifications_status ON public.compliance_certifications(status);

-- Function to generate unique certificate numbers
CREATE OR REPLACE FUNCTION public.generate_certificate_number()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  cert_num text;
  year_str text;
  seq_num integer;
BEGIN
  year_str := to_char(now(), 'YYYY');
  
  -- Get the next sequence number for this year
  SELECT COALESCE(MAX(
    CAST(
      NULLIF(regexp_replace(certificate_number, '^CAI-' || year_str || '-', ''), '')
      AS integer
    )
  ), 0) + 1
  INTO seq_num
  FROM public.compliance_certifications
  WHERE certificate_number LIKE 'CAI-' || year_str || '-%';
  
  cert_num := 'CAI-' || year_str || '-' || lpad(seq_num::text, 5, '0');
  
  RETURN cert_num;
END;
$$;

GRANT EXECUTE ON FUNCTION public.generate_certificate_number() TO authenticated;
