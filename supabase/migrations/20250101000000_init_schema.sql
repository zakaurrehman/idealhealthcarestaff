-- ====================================================================
-- Ideal Healthcare Staffing - Production Database Schema
-- Supabase / PostgreSQL Schema & Row Level Security (RLS)
-- ====================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. JOINS / JOBS TABLE
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    department TEXT NOT NULL DEFAULT 'Nursing', -- 'Nursing', 'Allied Health', 'Therapy', 'Advanced Practice', 'Healthcare Administration'
    specialty TEXT NOT NULL, -- e.g. 'ICU RN', 'Emergency Room RN', 'Telemetry', 'OR RN', 'Physical Therapist', 'Cath Lab Tech'
    location_city TEXT NOT NULL,
    location_state TEXT NOT NULL, -- 2-letter state code, e.g. 'TX', 'CA', 'FL'
    employment_type TEXT NOT NULL DEFAULT 'Travel Contract', -- 'Travel Contract', 'Per Diem', 'Permanent / Direct Hire', 'Local Contract'
    shift TEXT NOT NULL, -- e.g. '12-Hour Nights (3x12)', '12-Hour Days (3x12)', '8-Hour Days (5x8)'
    duration_weeks INTEGER DEFAULT 13,
    pay_range TEXT, -- e.g. '$2,450 - $2,950 / week' or '$88,000 - $115,000 / year'
    description TEXT NOT NULL,
    responsibilities JSONB DEFAULT '[]'::jsonb,
    qualifications JSONB DEFAULT '[]'::jsonb,
    benefits JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'closed', 'archived')),
    is_urgent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexing for fast public filtering
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs (status);
CREATE INDEX IF NOT EXISTS idx_jobs_specialty ON public.jobs (specialty);
CREATE INDEX IF NOT EXISTS idx_jobs_location_state ON public.jobs (location_state);
CREATE INDEX IF NOT EXISTS idx_jobs_employment_type ON public.jobs (employment_type);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs (created_at DESC);

-- 3. APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL,
    job_title TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    specialty TEXT NOT NULL,
    years_of_experience TEXT NOT NULL,
    primary_license_state TEXT,
    resume_url TEXT, -- Path in private Supabase storage
    resume_filename TEXT,
    cover_note TEXT,
    consent_given BOOLEAN NOT NULL DEFAULT true,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'contacted', 'screening', 'placed', 'archived')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_applications_job_id ON public.applications (job_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications (status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON public.applications (created_at DESC);

-- 4. FACILITY INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.facility_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    facility_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    contact_title TEXT,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    facility_type TEXT NOT NULL DEFAULT 'Hospital', -- 'Acute Care Hospital', 'Trauma Center', 'Surgical Hospital', 'LTAC / Rehab', 'Outpatient Network'
    staffing_needs TEXT NOT NULL, -- e.g. 'Travel RNs', 'Allied Health', 'Crisis Coverage', 'Permanent Search'
    urgency TEXT DEFAULT 'Standard (2-4 Weeks)', -- 'Immediate / Crisis (24-48 hrs)', 'Standard (2-4 Weeks)', 'Upcoming Seasonal'
    details TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'in_discussion', 'agreement_sent', 'active_client', 'closed')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_facility_inquiries_status ON public.facility_inquiries (status);
CREATE INDEX IF NOT EXISTS idx_facility_inquiries_created_at ON public.facility_inquiries (created_at DESC);

-- 5. CANDIDATE JOB ALERTS TABLE
CREATE TABLE IF NOT EXISTS public.job_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    specialty TEXT,
    state TEXT,
    employment_type TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    unsubscribe_token TEXT UNIQUE NOT NULL DEFAULT md5(random()::text || clock_timestamp()::text),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_job_alerts_email ON public.job_alerts (email);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_alerts ENABLE ROW LEVEL SECURITY;

-- The admin portal does NOT use Supabase Auth. All admin reads/writes go
-- through server actions using the SERVICE ROLE key, which bypasses RLS.
-- Therefore no "authenticated" policies are granted: Supabase allows public
-- sign-up by default, so such policies would expose candidate data to anyone.
-- The public (anon) key may only read published jobs and submit forms.

-- JOBS: anyone can view published jobs (read-only)
DROP POLICY IF EXISTS "Public can view published jobs" ON public.jobs;
CREATE POLICY "Public can view published jobs"
ON public.jobs FOR SELECT
TO anon, authenticated
USING (status = 'published');

-- APPLICATIONS: public can submit (INSERT only, never read)
DROP POLICY IF EXISTS "Public can submit applications" ON public.applications;
CREATE POLICY "Public can submit applications"
ON public.applications FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- FACILITY INQUIRIES: public can submit (INSERT only, never read)
DROP POLICY IF EXISTS "Public can submit facility inquiries" ON public.facility_inquiries;
CREATE POLICY "Public can submit facility inquiries"
ON public.facility_inquiries FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- JOB ALERTS: public can subscribe (INSERT only, never read)
DROP POLICY IF EXISTS "Public can subscribe to job alerts" ON public.job_alerts;
CREATE POLICY "Public can subscribe to job alerts"
ON public.job_alerts FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Remove broad policies from earlier versions of this schema, if present
DROP POLICY IF EXISTS "Authenticated users can manage jobs" ON public.jobs;
DROP POLICY IF EXISTS "Admins can view and manage applications" ON public.applications;
DROP POLICY IF EXISTS "Admins can view and manage facility inquiries" ON public.facility_inquiries;
DROP POLICY IF EXISTS "Admins can manage job alerts" ON public.job_alerts;

-- ====================================================================
-- STORAGE BUCKET CONFIGURATION (Private Resumes)
-- ====================================================================
-- Resumes must be stored in a private bucket 'resumes'.
-- Uploads are performed through validated Server Actions using the service role,
-- or signed upload URLs. No public read access is granted.
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false)
ON CONFLICT (id) DO NOTHING;

-- Storage: no public or "authenticated" access to resumes. Uploads and
-- downloads happen server-side with the service role (bypasses RLS).
DROP POLICY IF EXISTS "Authenticated admins can view resumes" ON storage.objects;
