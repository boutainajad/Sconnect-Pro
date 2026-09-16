

DROP TABLE IF EXISTS payments, waiting_list, registrations,
                     activities, facilities, associations,
                     members, families CASCADE;

CREATE TABLE families (
  id SERIAL PRIMARY KEY,
  family_code VARCHAR(20) UNIQUE NOT NULL,
  quotient_familial NUMERIC(10,2) NOT NULL DEFAULT 1000,
  address VARCHAR(255),
  city VARCHAR(100),
  is_resident BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE members (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  birth_date DATE NOT NULL,
  email VARCHAR(150),
  phone VARCHAR(20),
  medical_certificate_date DATE,
  medical_status VARCHAR(30) DEFAULT 'valid',
  family_id INT REFERENCES families(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE associations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  contact_name VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(150),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE facilities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  type VARCHAR(50),
  address VARCHAR(255),
  erp_capacity INT NOT NULL,
  is_divisible BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  association_id INT REFERENCES associations(id) ON DELETE CASCADE,
  facility_id INT REFERENCES facilities(id) ON DELETE RESTRICT,
  zone VARCHAR(20) DEFAULT 'full',
  base_price NUMERIC(10,2) NOT NULL,
  max_capacity INT NOT NULL,
  day_of_week VARCHAR(20) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  age_category VARCHAR(50),
  is_all_public BOOLEAN DEFAULT FALSE,
  is_risk_sport BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE registrations (
  id SERIAL PRIMARY KEY,
  member_id INT REFERENCES members(id) ON DELETE CASCADE,
  activity_id INT REFERENCES activities(id) ON DELETE CASCADE,
  final_price NUMERIC(10,2) NOT NULL,
  status VARCHAR(30) DEFAULT 'confirmed',
  payment_type VARCHAR(10) DEFAULT 'full',
  registration_date TIMESTAMP DEFAULT NOW()
);

CREATE TABLE waiting_list (
  id SERIAL PRIMARY KEY,
  activity_id INT REFERENCES activities(id) ON DELETE CASCADE,
  member_id INT REFERENCES members(id) ON DELETE CASCADE,
  priority_score INT DEFAULT 0,
  status VARCHAR(30) DEFAULT 'waiting',
  deadline_confirmation TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  registration_id INT REFERENCES registrations(id) ON DELETE CASCADE,
  installment_number INT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  due_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  paid_at TIMESTAMP
);

-- Index
CREATE INDEX idx_members_family ON members(family_id);
CREATE INDEX idx_activities_facility ON activities(facility_id);
CREATE INDEX idx_registrations_activity ON registrations(activity_id, status);
CREATE INDEX idx_waiting_activity ON waiting_list(activity_id, status);