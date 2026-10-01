-- Initial seed data for Hami Nepal Relief Inventory Tracker

-- 1. Warehouses
INSERT INTO warehouses (name, location, contact_person, contact_number, description, created_at, updated_at)
VALUES 
('Kathmandu Central Hub', 'Balaju Industrial Area, Kathmandu', 'Ram Shrestha', '+977-9851012345', 'Main central distribution center for Kathmandu valley', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Pokhara Regional Warehouse', 'Nayabazar, Pokhara', 'Sita Gurung', '+977-9846054321', 'Western region relief supply hub', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Biratnagar Gateway Warehouse', 'Main Road, Biratnagar', 'Hari Karki', '+977-9801098765', 'Eastern region transit warehouse', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 2. Items
INSERT INTO items (name, category, unit, description, created_at, updated_at)
VALUES 
('Emergency Tents (4-person)', 'Shelter', 'pcs', 'Heavy duty waterproof emergency relief tents', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Blankets (Fleece)', 'Bedding', 'pcs', 'Warm winter relief blankets', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Rice (25kg Bag)', 'Food', 'bags', 'Long grain non-perishable rice', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Water Purification Tablets', 'Medical', 'boxes', 'Box of 100 water treatment tabs', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('First Aid Kit (Standard)', 'Medical', 'kits', 'Comprehensive emergency trauma first aid kit', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Tarpaulin Sheets (12x18 ft)', 'Shelter', 'pcs', 'Heavy duty blue plastic tarps', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Dry Food Packets', 'Food', 'packs', 'Ready to eat emergency ration packs', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Hygiene Kits', 'Sanitation', 'kits', 'Soap, toothbrush, sanitary pads, towel', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 3. Vehicles
INSERT INTO vehicles (vehicle_number, vehicle_type, capacity, description, active, created_at, updated_at)
VALUES 
('BA 2 KHA 4521', 'Heavy Truck', '10 Tons', '6-wheeler cargo truck for mountain routes', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('BA 1 JHA 8832', 'Pickup Van', '2.5 Tons', '4WD Toyota Hilux for remote terrain access', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('PRO 3-01-002 CHA 9911', 'Medium Truck', '5 Tons', 'Eicher closed box container truck', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 4. Drivers
INSERT INTO drivers (name, phone, license_number, description, active, created_at, updated_at)
VALUES 
('Bikram Thapa', '+977-9812345678', 'DL-KTM-89412', 'Experienced mountain terrain heavy vehicle driver', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Dawa Sherpa', '+977-9867890123', 'DL-PKR-55120', 'Emergency relief convoy driver', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Sunil Maharjan', '+977-9803456789', 'DL-KTM-10492', 'Urban and highway logisitics driver', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 5. Inventories (Initial Warehouse Stock)
INSERT INTO inventories (warehouse_id, item_id, quantity, minimum_stock_level, created_at, updated_at)
VALUES 
(1, 1, 450, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 2, 1200, 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 3, 800, 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 4, 300, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 5, 150, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 1, 200, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 2, 600, 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 3, 400, 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 6, 500, 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 7, 1000, 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
