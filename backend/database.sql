-- Alphagnito CRM Database Setup
CREATE DATABASE IF NOT EXISTS alphagnito_crm;
USE alphagnito_crm;

-- Users table (for admin/login)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  mobile VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Agents table
CREATE TABLE IF NOT EXISTS agents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  company_name VARCHAR(150),
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  properties INT DEFAULT 0,
  inspections INT DEFAULT 0,
  status ENUM('Active', 'Inactive', 'Suspended') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inspectors table
CREATE TABLE IF NOT EXISTS inspectors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20),
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  address TEXT,
  agent_id INT,
  status ENUM('Active', 'Inactive') DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE SET NULL
);

-- Inspections table
CREATE TABLE IF NOT EXISTS inspections (
  id INT AUTO_INCREMENT PRIMARY KEY,
  inspection_id VARCHAR(20) UNIQUE NOT NULL,
  property_id INT,
  agent_id INT,
  inspector_id INT,
  status ENUM('Pending', 'Assigned', 'Active', 'Completed', 'Closed', 'Cancelled') DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE SET NULL,
  FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE SET NULL,
  FOREIGN KEY (inspector_id) REFERENCES inspectors(id) ON DELETE SET NULL
);

-- Seed default admin user (password: Admin@123)
INSERT IGNORE INTO users (name, email, mobile, password, role) VALUES 
('Dinesh Karthick', 'admin@alphagnito.com', '+44 7911 234567', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Seed sample agents
INSERT IGNORE INTO agents (name, company_name, email, phone, properties, inspections, status) VALUES
('Michael', 'Bluenest reality', 'michael@bluenest.com', '+44 7911 234567', 18, 42, 'Active'),
('Olivia haris', 'Urbankey estates', 'olivia@urbankey.com', '+44 8811 234567', 3, 10, 'Active'),
('Daniel', 'Bluenest reality', 'daniel@primele.com', '+44 7822 456789', 18, 20, 'Inactive'),
('Wilson', 'City homes', 'wilson@cityhom.com', '+44 7822 456879', 10, 10, 'Active'),
('Sophie', 'City homes', 'sophie@cityhom.com', '+44 7700 112233', 12, 10, 'Suspended'),
('Turner bruno', 'Primelet agents', 'turner@horizon.com', '+44 7555 999877', 20, 20, 'Active'),
('Bucky', 'Buenrest reality', 'bucky@bluenest.com', '+44 7911 234567', 18, 42, 'Active'),
('William Butcher', 'Urbankey estates', 'william@urbankey.com', '+44 8811 234567', 3, 10, 'Inactive'),
('John', 'Buenrest reality', 'john@primele.com', '+44 7822 456789', 18, 20, 'Active'),
('Carter', 'Primelet agents', 'carter@cityhom.com', '+44 7822 456879', 10, 10, 'Suspended'),
('Willy', 'Urbankey estates', 'willy@cityhom.com', '+44 7700 112233', 12, 10, 'Inactive'),
('Mike', 'Primelet agents', 'mike@horizon.com', '+44 7555 999877', 20, 20, 'Active');

-- Seed inspectors
INSERT IGNORE INTO inspectors (name, email, phone, status) VALUES
('John Mathews', 'john.mathews@inspect.com', '+44 7911 111111', 'Active'),
('Sarah Collins', 'sarah.collins@inspect.com', '+44 7911 222222', 'Active'),
('Mark Robinson', 'mark.robinson@inspect.com', '+44 7911 333333', 'Active'),
('Emma Watson', 'emma.watson@inspect.com', '+44 7911 444444', 'Active'),
('David Lee', 'david.lee@inspect.com', '+44 7911 555555', 'Active');

-- Seed properties
INSERT IGNORE INTO properties (name, address, agent_id) VALUES
('Greenview apartments', '123 Green St, London', 1),
('Palm residency - Villa', '456 Palm Ave, London', 2),
('Lakeview towers', '789 Lake Rd, London', 1),
('Maple street house', '321 Maple St, London', 4),
('Sunrise commercial complex', '654 Sunrise Blvd, London', 2),
('Oakwood cottage', '987 Oak Lane, London', 4);

-- Seed inspections
INSERT IGNORE INTO inspections (inspection_id, property_id, agent_id, inspector_id, status) VALUES
('INSP - 10245', 1, 1, 1, 'Pending'),
('INSP - 10244', 2, 2, 2, 'Assigned'),
('INSP - 10243', 3, 1, 3, 'Active'),
('INSP - 10242', 4, 4, 4, 'Completed'),
('INSP - 10243b', 5, 2, 5, 'Closed'),
('INSP - 10242b', 6, 4, 4, 'Cancelled');
