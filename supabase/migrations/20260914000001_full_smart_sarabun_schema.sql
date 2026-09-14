-- ============================================================================
-- SmartSarabun (ระบบสารบรรณอิเล็กทรอนิกส์ อบต.ดอยงาม)
-- Migration: 20260914000001_full_smart_sarabun_schema.sql
-- Description: Complete Production Schema for Supabase Cloud (Option B)
-- ============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Organizations Table (หน่วยงาน)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Departments Table (สำนัก / กอง)
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Profiles Table (เจ้าหน้าที่และข้าราชการ)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    roles TEXT[] NOT NULL DEFAULT ARRAY['OFFICER'],
    signature_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Documents Table (ทะเบียนหนังสือราชการ รับ-ส่ง-เกษียน)
CREATE TABLE IF NOT EXISTS documents (
    id TEXT PRIMARY KEY,
    doc_no VARCHAR(255) NOT NULL,
    reg_no VARCHAR(100),
    reg_date VARCHAR(50),
    reg_time VARCHAR(50),
    doc_date VARCHAR(50) NOT NULL,
    from_org VARCHAR(255) NOT NULL,
    to_org VARCHAR(255) NOT NULL,
    title TEXT NOT NULL,
    content TEXT,
    doc_type VARCHAR(100) NOT NULL DEFAULT 'หนังสือภายนอก',
    speed VARCHAR(50) DEFAULT 'ปกติ',
    secret VARCHAR(50) DEFAULT 'ปกติ',
    direction VARCHAR(50) NOT NULL DEFAULT 'incoming',
    target_dept VARCHAR(100),
    sender_dept VARCHAR(100),
    sender_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'registered',
    book_register VARCHAR(255),
    attachment_count INTEGER DEFAULT 0,
    pdf_url TEXT,
    pdf_name VARCHAR(255),
    timeline JSONB DEFAULT '[]'::jsonb,
    endorsements JSONB DEFAULT '[]'::jsonb,
    tenant_id TEXT DEFAULT 'e4a2d8a0-4a8a-4c22-9f33-000000000001',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning-fast queries
CREATE INDEX IF NOT EXISTS idx_documents_tenant_id ON documents(tenant_id);
CREATE INDEX IF NOT EXISTS idx_documents_doc_no ON documents(doc_no);
CREATE INDEX IF NOT EXISTS idx_documents_reg_no ON documents(reg_no);
CREATE INDEX IF NOT EXISTS idx_documents_direction ON documents(direction);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_target_dept ON documents(target_dept);
CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at DESC);

-- 6. Storage Bucket for PDF Attachments
INSERT INTO storage.buckets (id, name, public) 
VALUES ('sarabun-documents', 'sarabun-documents', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage Policy: Allow public read and authenticated insert
CREATE POLICY "Public Read sarabun-documents" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'sarabun-documents');

CREATE POLICY "Allow All Insert sarabun-documents" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'sarabun-documents');

CREATE POLICY "Allow All Update sarabun-documents" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'sarabun-documents');

-- 7. Initial Seed Data: อบต.ดอยงาม
INSERT INTO organizations (id, name, code, address, phone, email)
VALUES (
    'e4a2d8a0-4a8a-4c22-9f33-000000000001',
    'องค์การบริหารส่วนตำบลดอยงาม',
    'DOIGAM-SAO',
    'ตำบลดอยงาม อำเภอพาน จังหวัดเชียงราย ๕๗๑๒๐',
    '053-958100',
    'saraban.doigam@gmail.com'
) ON CONFLICT (code) DO NOTHING;

-- Initial Departments
INSERT INTO departments (organization_id, name, code, sort_order) VALUES
('e4a2d8a0-4a8a-4c22-9f33-000000000001', 'สำนักปลัด', '01', 1),
('e4a2d8a0-4a8a-4c22-9f33-000000000001', 'กองคลัง', '02', 2),
('e4a2d8a0-4a8a-4c22-9f33-000000000001', 'กองช่าง', '03', 3),
('e4a2d8a0-4a8a-4c22-9f33-000000000001', 'กองการศึกษา ศาสนาและวัฒนธรรม', '04', 4),
('e4a2d8a0-4a8a-4c22-9f33-000000000001', 'กองสาธารณสุขและสิ่งแวดล้อม', '05', 5)
ON CONFLICT DO NOTHING;

-- Initial Profiles (5 Core Roles)
INSERT INTO profiles (username, email, full_name, position, department, roles) VALUES
('admin', 'admin.doigam@gmail.com', 'ผู้ดูแลระบบสารบรรณกลาง', 'นักวิชาการคอมพิวเตอร์ / ผู้ดูแลระบบ', 'สำนักปลัด', ARRAY['SUPER_ADMIN', 'ADMIN']),
('nayok', 'nayok.doigam@gmail.com', 'นายกองค์การบริหารส่วนตำบลดอยงาม', 'นายก อบต.ดอยงาม', 'สำนักนายก / ผู้บริหาร', ARRAY['EXECUTIVE']),
('palad', 'palad.doigam@gmail.com', 'ปลัดองค์การบริหารส่วนตำบลดอยงาม', 'ปลัด อบต.ดอยงาม', 'สำนักปลัด', ARRAY['PALAD', 'MANAGER', 'EXECUTIVE']),
('engineer', 'engineer.doigam@gmail.com', 'ผู้อำนวยการกองช่าง', 'ผู้อำนวยการกองช่าง', 'กองช่าง', ARRAY['MANAGER', 'OFFICER']),
('sarabun', 'sarabun.doigam@gmail.com', 'เจ้าหน้าที่สารบรรณกลาง', 'เจ้าพนักงานธุรการชำนาญงาน', 'สำนักปลัด', ARRAY['DOCUMENT_OFFICER', 'OFFICER'])
ON CONFLICT (username) DO NOTHING;
