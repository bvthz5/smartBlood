-- SmartBlood Database Initialization Script
-- This script runs when the PostgreSQL container starts for the first time

-- Create database if it doesn't exist (this is handled by POSTGRES_DB)
-- But we can create additional databases or schemas here

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- Create custom types
DO $$ 
BEGIN
    -- Blood group type
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'blood_group') THEN
        CREATE TYPE blood_group AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
    END IF;
    
    -- Request status type
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'request_status') THEN
        CREATE TYPE request_status AS ENUM ('pending', 'matched', 'confirmed', 'completed', 'cancelled');
    END IF;
    
    -- Donor status type
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'donor_status') THEN
        CREATE TYPE donor_status AS ENUM ('active', 'inactive', 'blocked');
    END IF;
    
    -- Urgency level type
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'urgency_level') THEN
        CREATE TYPE urgency_level AS ENUM ('low', 'medium', 'high', 'critical');
    END IF;
END $$;

-- Create admin user table
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create donors table
CREATE TABLE IF NOT EXISTS donors (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    blood_group blood_group NOT NULL,
    district VARCHAR(100),
    city VARCHAR(100),
    is_available BOOLEAN DEFAULT true,
    status donor_status DEFAULT 'active',
    last_donation_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create hospitals table
CREATE TABLE IF NOT EXISTS hospitals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    district VARCHAR(100),
    city VARCHAR(100),
    license_number VARCHAR(100) UNIQUE,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create blood requests table
CREATE TABLE IF NOT EXISTS blood_requests (
    id SERIAL PRIMARY KEY,
    hospital_id INTEGER REFERENCES hospitals(id),
    patient_name VARCHAR(255) NOT NULL,
    blood_group blood_group NOT NULL,
    units_required INTEGER NOT NULL CHECK (units_required > 0),
    urgency urgency_level DEFAULT 'medium',
    status request_status DEFAULT 'pending',
    description TEXT,
    contact_person VARCHAR(255),
    contact_phone VARCHAR(20),
    required_by TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create matches table
CREATE TABLE IF NOT EXISTS matches (
    id SERIAL PRIMARY KEY,
    request_id INTEGER REFERENCES blood_requests(id),
    donor_id INTEGER REFERENCES donors(id),
    status VARCHAR(50) DEFAULT 'pending',
    matched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP,
    completed_at TIMESTAMP,
    notes TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_donors_blood_group ON donors(blood_group);
CREATE INDEX IF NOT EXISTS idx_donors_district ON donors(district);
CREATE INDEX IF NOT EXISTS idx_donors_is_available ON donors(is_available);
CREATE INDEX IF NOT EXISTS idx_requests_blood_group ON blood_requests(blood_group);
CREATE INDEX IF NOT EXISTS idx_requests_status ON blood_requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_urgency ON blood_requests(urgency);
CREATE INDEX IF NOT EXISTS idx_matches_request_id ON matches(request_id);
CREATE INDEX IF NOT EXISTS idx_matches_donor_id ON matches(donor_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_donors_updated_at BEFORE UPDATE ON donors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hospitals_updated_at BEFORE UPDATE ON hospitals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blood_requests_updated_at BEFORE UPDATE ON blood_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user
INSERT INTO admins (email, password_hash, name, role) 
VALUES (
    'admin@smartblood.com', 
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4Vq5oJdF8m', -- Admin123
    'System Administrator',
    'super_admin'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample data for development
INSERT INTO hospitals (name, email, phone, address, district, city, license_number, is_verified)
VALUES 
    ('City General Hospital', 'contact@cityhospital.com', '+1-555-0101', '123 Medical Drive', 'Downtown', 'New York', 'HOSP001', true),
    ('Regional Medical Center', 'info@regionalmedical.com', '+1-555-0102', '456 Health Avenue', 'Midtown', 'New York', 'HOSP002', true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample donors
INSERT INTO donors (email, password_hash, name, phone, date_of_birth, blood_group, district, city, is_available)
VALUES 
    ('john.doe@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4Vq5oJdF8m', 'John Doe', '+1-555-0201', '1990-05-15', 'O+', 'Downtown', 'New York', true),
    ('jane.smith@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4Vq5oJdF8m', 'Jane Smith', '+1-555-0202', '1988-12-03', 'A+', 'Midtown', 'New York', true),
    ('mike.johnson@email.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4Vq5oJdF8m', 'Mike Johnson', '+1-555-0203', '1992-08-20', 'B+', 'Uptown', 'New York', true)
ON CONFLICT (email) DO NOTHING;

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Create a view for active requests with donor matches
CREATE OR REPLACE VIEW active_requests_with_matches AS
SELECT 
    br.id,
    br.patient_name,
    br.blood_group,
    br.units_required,
    br.urgency,
    br.status,
    h.name as hospital_name,
    h.district as hospital_district,
    COUNT(m.id) as match_count,
    br.created_at,
    br.required_by
FROM blood_requests br
LEFT JOIN hospitals h ON br.hospital_id = h.id
LEFT JOIN matches m ON br.id = m.request_id AND m.status = 'confirmed'
WHERE br.status IN ('pending', 'matched')
GROUP BY br.id, br.patient_name, br.blood_group, br.units_required, br.urgency, br.status, h.name, h.district, br.created_at, br.required_by
ORDER BY 
    CASE br.urgency 
        WHEN 'critical' THEN 1 
        WHEN 'high' THEN 2 
        WHEN 'medium' THEN 3 
        WHEN 'low' THEN 4 
    END,
    br.created_at;

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE 'SmartBlood database initialized successfully!';
    RAISE NOTICE 'Admin user created: admin@smartblood.com / Admin123';
    RAISE NOTICE 'Sample data inserted for development';
END $$;
