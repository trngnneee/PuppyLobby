create type gender_enum as ENUM('male', 'female');

-- Tạo bảng Role
create table Role (
  role_id uuid primary key default gen_random_uuid (),
  role_name text not null
);

-- Tạo bảng Account
create table Account (
  account_id uuid primary key default gen_random_uuid (),
  username text not null UNIQUE,
  password text not null,
  email text not null UNIQUE,
  created_at timestamp default CURRENT_TIMESTAMP,
  role_id uuid references Role (role_id)
);

-- Tạo bảng Employee
create table Employee (
  employee_id uuid primary key default gen_random_uuid (),
  employee_name text not null,
  date_of_birth date,
  gender gender_enum not null,
  manager_id uuid references Employee (employee_id),
  account_id uuid references Account (account_id) on delete cascade -- Xóa account thì xóa cả employee
);

-- Tạo bảng Veterinarian
create table Veterinarian (
  employee_id uuid primary key references Employee (employee_id) ON DELETE cascade, -- Xóa employee thì xóa cả veterinarian
  degree text not null,
  specialization text not null
);

-- Tạo bảng Customer
create table Customer (
  customer_id uuid primary key default gen_random_uuid (),
  customer_name text not null,
  phone_number text,
  CCCD text
);

-- Tạo bảng Pet
create table Pet (
  pet_id uuid primary key default gen_random_uuid (),
  pet_name text not null,
  species text not null,
  breed text not null,
  age numeric check (age > 0),
  gender gender_enum not null,
  health_state text,
  customer_id uuid references Customer (customer_id) on delete cascade -- Xóa customer thì xóa cả pet
);

-- Tạo bảng MembershipLevel
create table MembershipLevel (
  level_id uuid primary key default gen_random_uuid (),
  level_name text not null,
  target_threshold numeric,
  keep_rank_threshold numeric
);

-- Tạo bảng CustomerAccount
create table CustomerAccount (
  account_id uuid primary key references Account (account_id) on delete cascade, -- Xóa account thì xóa cả customeraccount
  loyalty_score numeric,
  reach_target numeric,
  customer_id uuid references Customer (customer_id),
  level_id uuid references MembershipLevel (level_id)
);

-- Tạo bảng Branch
create table Branch (
  branch_id uuid primary key default gen_random_uuid (),
  branch_name text not null,
  location text not null,
  phone_number text not null,
  open_time time,
  close_time time
);

-- Tạo bảng Service
create table Service (
  service_id uuid primary key default gen_random_uuid (),
  service_name text not null,
  service_base_price numeric not null check (service_base_price > 0)
);

-- Tạo bảng BranchService
create table BranchService (
  branch_id uuid references Branch (branch_id),
  service_id uuid references Service (service_id),
  primary key (branch_id, service_id)
);

-- Tạo bảng EmployeeHistory
create table EmployeeHistory (
  branch_id uuid references Branch (branch_id),
  employee_id uuid references Employee (employee_id) on delete cascade, -- Xóa employee thì xóa cả employeehistory
  start_date date not null,
  end_date date,
  position text not null,
  salary numeric check (salary > 0),
  primary key (branch_id, employee_id, start_date)
);

-- Tạo bảng Invoice
create table Invoice (
  invoice_id uuid primary key default gen_random_uuid (),
  created_at timestamp default current_timestamp,
  payment_method text,
  total_price numeric check (total_price >= 0),
  status text,
  employee_id uuid references Employee (employee_id),
  customer_id uuid references Customer (customer_id)
);

-- Tạo bảng Product
create table Product (
  product_id uuid primary key default gen_random_uuid (),
  product_name text not null,
  price numeric not null,
  manufacture_date date not null,
  entry_date date not null,
  expiry_date date not null,
  stock numeric check (stock > 0)
  type text not null
);

-- Tạo bảng ProductImage
create table ProductImage(
  id uuid primary key default gen_random_uuid ()
  product_id uuid references product(product_id) ON DELETE CASCADE, -- Xóa product thì xóa cả productimage
  image_url text not null
)

-- Tạo bảng Accessory
create table Accessory (
  product_id uuid primary key references Product (product_id) ON DELETE CASCADE, -- Xóa product thì xóa cả accessory
  size text not null,
  color text not null,
  material text not null
);

-- Tạo bảng Medicine
create table Medicine (
  product_id uuid primary key references Product (product_id) ON DELETE CASCADE, -- Xóa product thì xóa cả medicine
  dosage_use text not null,
  species text not null,
  side_effect text not null
);

-- Tạo bảng Food
create table Food (
  product_id uuid primary key references Product (product_id) ON DELETE CASCADE, -- Xóa product thì xóa cả food
  weight text not null,
  species text not null,
  nutrition_description text
);

-- Tạo bảng InvoiceProduct
create table InvoiceProduct (
  invoice_id uuid references Invoice (invoice_id),
  product_id uuid references Product (product_id),
  quantity numeric check (quantity > 0),
  primary key (invoice_id, product_id)
);

-- Tạo bảng Vaccine
create table Vaccine (
  vaccine_id uuid primary key default gen_random_uuid (),
  vaccine_name text not null,
  quantity numeric check (quantity > 0),
  entry_date date not null,
  expiry_date date not null,
  manufacture_date date not null
);

-- Tạo bảng VaccinationPackage
create table VaccinationPackage (
  package_id uuid primary key default gen_random_uuid (),
  package_name text not null,
  duration numeric not null check (duration > 0),
  description text,
  discount_rate numeric check (discount_rate > 0),
  total_original_price numeric not null check (total_original_price > 0)
);

-- Tạo bảng VaccinationSchedule
create table VaccinationSchedule (
  schedule_id uuid primary key default gen_random_uuid (),
  scheduled_week numeric not null check (scheduled_week > 0),
  dosage text not null,
  vaccine_id uuid references Vaccine (vaccine_id),
  package_id uuid references VaccinationPackage (package_id) ON DELETE CASCADE, -- Xóa package thì xóa cả schedule
);

-- Tạo bảng ServiceBooking
create table ServiceBooking (
  booking_id uuid primary key default gen_random_uuid (),
  date date not null,
  status text,
  price numeric not null check (price >= 0),
  service_id uuid references Service (service_id),
  branch_id uuid references Branch (branch_id),
  employee_id uuid references Employee (employee_id),
  pet_id uuid references Pet (pet_id),
  invoice_id uuid references Invoice (invoice_id)
);

-- Tạo bảng MedicalExamination
create table MedicalExamination (
  booking_id uuid primary key references ServiceBooking (booking_id),
  symptom text,
  diagnosis text,
  precription text,
  next_appointment date
);

-- Tạo bảng VaccinationSingleService
create table VaccinationSingleService (
  booking_id uuid primary key references ServiceBooking (booking_id),
  dosage text,
  vaccine_id uuid references Vaccine (vaccine_id)
);

-- Tạo bảng VaccinationPackageService
create table VaccinationPackageService (
  booking_id uuid primary key references ServiceBooking (booking_id),
  start_date date,
  end_date date,
  package_id uuid references VaccinationPackage (package_id)
);

-- Tạo bảng Evaluation
create table Evaluation (
  evaluation_id uuid primary key default gen_random_uuid (),
  comment text,
  overall_satisfaction text,
  evaluation_type text not null,
  booking_id uuid references ServiceBooking (booking_id),
  employee_id uuid references Employee (employee_id),
  customer_id uuid references Customer (customer_id)
);

-- Insert data cho Branch
INSERT INTO Branch (branch_name, location, phone_number, open_time, close_time) VALUES
('Branch District 1', 'Quận 1, TP.HCM', '028-1111-0001', '08:00', '21:00'),
('Branch District 3', 'Quận 3, TP.HCM', '028-1111-0003', '08:00', '21:00'),
('Branch District 5', 'Quận 5, TP.HCM', '028-1111-0005', '08:00', '21:30'),
('Branch District 7', 'Quận 7, TP.HCM', '028-1111-0007', '07:30', '22:00'),
('Branch Binh Thanh', 'Bình Thạnh, TP.HCM', '028-1111-0010', '08:00', '22:00'),
('Branch Thu Duc', 'TP. Thủ Đức, TP.HCM', '028-1111-0020', '08:00', '22:00'),
('Branch Tan Binh', 'Tân Bình, TP.HCM', '028-1111-0030', '07:00', '21:00'),
('Branch Go Vap', 'Gò Vấp, TP.HCM', '028-1111-0040', '07:30', '21:30'),
('Branch Da Nang Center', 'Đà Nẵng', '0236-222-1111', '08:00', '21:00'),
('Branch Ha Noi Center', 'Hà Nội', '024-3333-2222', '08:00', '22:00');

-- Insert data cho Service
INSERT INTO Service (service_name, service_base_price) VALUES
('Medical Examination', '2500000'),
('Vaccine Single Service', '7500000'),
('Vaccine Package Service', '15499000');

-- Insert data cho MembershipLevel
INSERT INTO membershiplevel (
  level_id,
  level_name,
  target_threshold,
  keep_rank_threshold
)
VALUES
(
  gen_random_uuid(),
  'Bronze',
  0,
  0
),
(
  gen_random_uuid(),
  'Silver',
  1000,
  700
),
(
  gen_random_uuid(),
  'Gold',
  5000,
  4000
),
(
  gen_random_uuid(),
  'Platinum',
  15000,
  12000
);