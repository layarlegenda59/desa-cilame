-- Migration: Create village officials and UMKM tables
-- Created: 2024-01-01
-- Description: Create tables for village officials and UMKM management

-- Create village officials table
CREATE TABLE IF NOT EXISTS village_officials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    nip VARCHAR(50),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    photo VARCHAR(500),
    start_date DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create UMKM categories table
CREATE TABLE IF NOT EXISTS umkm_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create UMKM table
CREATE TABLE IF NOT EXISTS umkm (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    owner_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    category_id UUID REFERENCES umkm_categories(id) ON DELETE SET NULL,
    logo VARCHAR(500),
    images TEXT[], -- Array of image URLs
    website VARCHAR(500),
    social_media JSONB, -- Store social media links as JSON
    products TEXT[], -- Array of main products
    established_year INTEGER,
    employee_count INTEGER,
    monthly_revenue DECIMAL(15,2),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    is_featured BOOLEAN DEFAULT false,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create documents table for storing various documents
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    category VARCHAR(100) NOT NULL,
    is_public BOOLEAN DEFAULT true,
    download_count INTEGER DEFAULT 0,
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create village statistics table
CREATE TABLE IF NOT EXISTS village_statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,2) NOT NULL,
    metric_unit VARCHAR(50),
    category VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    month INTEGER,
    description TEXT,
    source VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(metric_name, year, month)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_village_officials_position ON village_officials(position);
CREATE INDEX IF NOT EXISTS idx_village_officials_is_active ON village_officials(is_active);
CREATE INDEX IF NOT EXISTS idx_village_officials_sort_order ON village_officials(sort_order);

CREATE INDEX IF NOT EXISTS idx_umkm_categories_slug ON umkm_categories(slug);
CREATE INDEX IF NOT EXISTS idx_umkm_categories_is_active ON umkm_categories(is_active);

CREATE INDEX IF NOT EXISTS idx_umkm_slug ON umkm(slug);
CREATE INDEX IF NOT EXISTS idx_umkm_category_id ON umkm(category_id);
CREATE INDEX IF NOT EXISTS idx_umkm_status ON umkm(status);
CREATE INDEX IF NOT EXISTS idx_umkm_is_featured ON umkm(is_featured);
CREATE INDEX IF NOT EXISTS idx_umkm_location ON umkm(latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_is_public ON documents(is_public);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_by ON documents(uploaded_by);

CREATE INDEX IF NOT EXISTS idx_village_statistics_category ON village_statistics(category);
CREATE INDEX IF NOT EXISTS idx_village_statistics_year ON village_statistics(year);
CREATE INDEX IF NOT EXISTS idx_village_statistics_metric_name ON village_statistics(metric_name);

-- Create triggers for updated_at
CREATE TRIGGER update_village_officials_updated_at
    BEFORE UPDATE ON village_officials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_umkm_categories_updated_at
    BEFORE UPDATE ON umkm_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_umkm_updated_at
    BEFORE UPDATE ON umkm
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
    BEFORE UPDATE ON documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_village_statistics_updated_at
    BEFORE UPDATE ON village_statistics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default UMKM categories
INSERT INTO umkm_categories (name, slug, description, icon) VALUES
('Kuliner', 'kuliner', 'Usaha makanan dan minuman', 'utensils'),
('Kerajinan', 'kerajinan', 'Kerajinan tangan dan seni', 'palette'),
('Pertanian', 'pertanian', 'Produk pertanian dan perkebunan', 'leaf'),
('Jasa', 'jasa', 'Layanan jasa', 'briefcase'),
('Perdagangan', 'perdagangan', 'Usaha perdagangan umum', 'shopping-cart')
ON CONFLICT (slug) DO NOTHING;