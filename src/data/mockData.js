// Mock Data - Structured to mirror future backend REST API responses
// This file contains all static data and will be replaced with API calls later

export const warehouses = [
  {
    id: 'wh-001',
    name: 'Kathmandu Relief Warehouse',
    location: 'Kalanki, Kathmandu',
    contactPerson: 'Anita Tamang',
    contactNumber: '9841234567',
    description: 'Main central warehouse for Kathmandu valley relief operations.',
    createdAt: '2026-01-15',
  },
  {
    id: 'wh-002',
    name: 'Bhaktapur Relief Warehouse',
    location: 'Suryabinayak, Bhaktapur',
    contactPerson: 'Roshan Karki',
    contactNumber: '9852345678',
    description: 'Secondary warehouse serving Bhaktapur and surrounding areas.',
    createdAt: '2026-02-10',
  },
  {
    id: 'wh-003',
    name: 'Lalitpur Relief Warehouse',
    location: 'Jawalakhel, Lalitpur',
    contactPerson: 'Priya Maharjan',
    contactNumber: '9863456789',
    description: 'Lalitpur district warehouse for southern valley distribution.',
    createdAt: '2026-03-05',
  },
];

export const items = [
  { id: 'item-001', name: 'Rice', category: 'Food', unit: 'sacks' },
  { id: 'item-002', name: 'Water Bottles', category: 'Water', unit: 'bottles' },
  { id: 'item-003', name: 'Blankets', category: 'Clothing', unit: 'pieces' },
  { id: 'item-004', name: 'Clothes', category: 'Clothing', unit: 'bundles' },
  { id: 'item-005', name: 'Medicine Kits', category: 'Medical', unit: 'kits' },
  { id: 'item-006', name: 'Tents', category: 'Shelter', unit: 'units' },
  { id: 'item-007', name: 'Food Packages', category: 'Food', unit: 'packages' },
  { id: 'item-008', name: 'Cooking Oil', category: 'Food', unit: 'liters' },
  { id: 'item-009', name: 'Salt', category: 'Food', unit: 'kg' },
  { id: 'item-010', name: 'Sugar', category: 'Food', unit: 'kg' },
  { id: 'item-011', name: 'Sanitation Kits', category: 'Hygiene', unit: 'kits' },
  { id: 'item-012', name: 'Baby Food', category: 'Food', unit: 'packets' },
];

// Inventory: receivedQty and dispatchedQty per warehouse
// Available = receivedQty - dispatchedQty (calculated in UI)
export const inventory = [
  // Kathmandu
  { id: 'inv-001', warehouseId: 'wh-001', itemId: 'item-001', receivedQty: 500, dispatchedQty: 100 },
  { id: 'inv-002', warehouseId: 'wh-001', itemId: 'item-002', receivedQty: 1000, dispatchedQty: 300 },
  { id: 'inv-003', warehouseId: 'wh-001', itemId: 'item-003', receivedQty: 120, dispatchedQty: 102 },
  { id: 'inv-004', warehouseId: 'wh-001', itemId: 'item-005', receivedQty: 80, dispatchedQty: 40 },
  { id: 'inv-005', warehouseId: 'wh-001', itemId: 'item-006', receivedQty: 50, dispatchedQty: 20 },
  { id: 'inv-006', warehouseId: 'wh-001', itemId: 'item-007', receivedQty: 300, dispatchedQty: 150 },
  { id: 'inv-007', warehouseId: 'wh-001', itemId: 'item-011', receivedQty: 60, dispatchedQty: 25 },
  // Bhaktapur
  { id: 'inv-008', warehouseId: 'wh-002', itemId: 'item-001', receivedQty: 200, dispatchedQty: 175 },
  { id: 'inv-009', warehouseId: 'wh-002', itemId: 'item-002', receivedQty: 500, dispatchedQty: 460 },
  { id: 'inv-010', warehouseId: 'wh-002', itemId: 'item-003', receivedQty: 60, dispatchedQty: 42 },
  { id: 'inv-011', warehouseId: 'wh-002', itemId: 'item-004', receivedQty: 80, dispatchedQty: 50 },
  { id: 'inv-012', warehouseId: 'wh-002', itemId: 'item-007', receivedQty: 100, dispatchedQty: 60 },
  { id: 'inv-013', warehouseId: 'wh-002', itemId: 'item-012', receivedQty: 40, dispatchedQty: 20 },
  // Lalitpur
  { id: 'inv-014', warehouseId: 'wh-003', itemId: 'item-001', receivedQty: 150, dispatchedQty: 50 },
  { id: 'inv-015', warehouseId: 'wh-003', itemId: 'item-002', receivedQty: 400, dispatchedQty: 200 },
  { id: 'inv-016', warehouseId: 'wh-003', itemId: 'item-005', receivedQty: 40, dispatchedQty: 15 },
  { id: 'inv-017', warehouseId: 'wh-003', itemId: 'item-006', receivedQty: 30, dispatchedQty: 10 },
  { id: 'inv-018', warehouseId: 'wh-003', itemId: 'item-008', receivedQty: 100, dispatchedQty: 40 },
];

export const vehicles = [
  { id: 'veh-001', plateNumber: 'BA 2 CHA 1234', type: 'Truck' },
  { id: 'veh-002', plateNumber: 'BA 3 KHA 4567', type: 'Van' },
  { id: 'veh-003', plateNumber: 'BA 1 JA 7788', type: 'Truck' },
];

export const drivers = [
  { id: 'drv-001', name: 'Ram Thapa', phone: '9841000001' },
  { id: 'drv-002', name: 'Suman Gurung', phone: '9852000002' },
  { id: 'drv-003', name: 'Bikash Shrestha', phone: '9863000003' },
];

export const dispatches = [
  {
    id: 'DISP-001',
    date: '2026-09-22',
    time: '14:30',
    warehouseId: 'wh-001',
    destination: 'Bhaktapur Relief Camp',
    recipient: 'Red Cross Nepal – Bhaktapur',
    items: [
      { itemId: 'item-001', qty: 100 },
      { itemId: 'item-002', qty: 300 },
    ],
    vehicleId: 'veh-001',
    driverId: 'drv-001',
    notes: 'Urgent delivery for flood victims.',
    status: 'Delivered',
  },
  {
    id: 'DISP-002',
    date: '2026-09-21',
    time: '09:00',
    warehouseId: 'wh-001',
    destination: 'Sindhupalchok Shelter',
    recipient: 'Shelter Nepal NGO',
    items: [
      { itemId: 'item-006', qty: 20 },
      { itemId: 'item-003', qty: 50 },
    ],
    vehicleId: 'veh-003',
    driverId: 'drv-002',
    notes: '',
    status: 'Delivered',
  },
  {
    id: 'DISP-003',
    date: '2026-09-20',
    time: '11:15',
    warehouseId: 'wh-002',
    destination: 'Nagarkot Camp',
    recipient: 'Community Relief Group',
    items: [
      { itemId: 'item-001', qty: 75 },
      { itemId: 'item-007', qty: 60 },
    ],
    vehicleId: 'veh-002',
    driverId: 'drv-003',
    notes: 'Morning distribution for 200 families.',
    status: 'Delivered',
  },
  {
    id: 'DISP-004',
    date: '2026-09-19',
    time: '16:00',
    warehouseId: 'wh-003',
    destination: 'Kirtipur Relief Point',
    recipient: 'Kirtipur Municipality',
    items: [
      { itemId: 'item-002', qty: 200 },
      { itemId: 'item-005', qty: 15 },
    ],
    vehicleId: 'veh-001',
    driverId: 'drv-001',
    notes: '',
    status: 'Delivered',
  },
  {
    id: 'DISP-005',
    date: '2026-09-22',
    time: '08:45',
    warehouseId: 'wh-001',
    destination: 'Lalitpur Distribution Center',
    recipient: 'NRCS Lalitpur Chapter',
    items: [
      { itemId: 'item-011', qty: 25 },
      { itemId: 'item-004', qty: 0 },
    ],
    vehicleId: 'veh-002',
    driverId: 'drv-002',
    notes: 'Hygiene kit distribution.',
    status: 'In Transit',
  },
];

// LOW STOCK THRESHOLD: items with < 20% of received remaining
export const LOW_STOCK_THRESHOLD = 0.2;
