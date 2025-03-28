-- Add approval status columns to properties table
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'PENDING',
ADD COLUMN IF NOT EXISTS admin_notes TEXT;

-- Add approval status columns to vendors table
ALTER TABLE vendors
ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'PENDING',
ADD COLUMN IF NOT EXISTS admin_notes TEXT;