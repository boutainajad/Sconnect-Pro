-- Familles
INSERT INTO families (family_code, quotient_familial, address, city, is_resident) VALUES
('FAM001', 550.00,  '12 Rue des Sports', 'Casablanca', TRUE),
('FAM002', 850.00,  '45 Av Hassan II',   'Casablanca', TRUE),
('FAM003', 1200.00, '78 Bd Zerktouni',   'Rabat',      FALSE);

-- Adhérents
INSERT INTO members (first_name, last_name, birth_date, email, medical_certificate_date, family_id) VALUES
('Youssef', 'Alami',   '2015-03-10', 'y.alami@mail.com',   '2024-09-01', 1),
('Salma',   'Alami',   '2017-07-22', 's.alami@mail.com',   '2024-09-01', 1),
('Omar',    'Benani',  '2010-01-15', 'o.benani@mail.com',  '2023-05-10', 2),
('Nadia',   'Chraibi', '1990-11-30', 'n.chraibi@mail.com', '2024-01-20', 2),
('Karim',   'Idrissi', '1985-04-05', 'k.idrissi@mail.com', '2022-06-15', 3);

-- Associations
INSERT INTO associations (name, contact_name, phone, email) VALUES
('Club Athlétisme Casa', 'Mohamed Tazi', '0600000001', 'contact@cac.ma'),
('Association Natation', 'Fatima Zahra', '0600000002', 'info@nat.ma'),
('Dojo Municipal',       'Hassan Rifi',  '0600000003', 'dojo@mail.ma');

-- Salles
INSERT INTO facilities (name, type, address, erp_capacity, is_divisible) VALUES
('Gymnase Al Amal',    'Gymnase', 'Rue Al Amal',    200, FALSE),
('Piscine Municipale', 'Piscine', 'Av des Sports',  120, TRUE),
('Dojo Central',       'Dojo',    'Bd Zerktouni',   80,  FALSE),
('Stade Annexe',       'Stade',   'Route de Rabat', 500, TRUE);

-- Activités
INSERT INTO activities (name, association_id, facility_id, base_price, max_capacity, day_of_week, start_time, end_time, age_category, is_all_public, is_risk_sport) VALUES
('Baby Gym',    1, 1, 120.00, 30, 'Samedi',   '09:00', '10:00', 'Baby',   FALSE, FALSE),
('Natation U11',2, 2, 200.00, 20, 'Mercredi', '14:00', '15:00', 'U11',    FALSE, FALSE),
('Judo Adulte', 3, 3, 180.00, 25, 'Lundi',    '19:00', '20:30', 'Senior', FALSE, TRUE),
('Yoga Tous',   3, 1, 150.00, 40, 'Vendredi', '18:00', '19:00', 'Tous',   TRUE,  FALSE);