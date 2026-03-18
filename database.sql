CREATE DATABASE slot_booking;
USE slot_booking;

-- Users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    role VARCHAR(20) DEFAULT 'user'
);

-- Slots
CREATE TABLE slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE,
    time VARCHAR(20),
    status VARCHAR(20) DEFAULT 'available'
);

-- Bookings
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    slot_id INT,
    payment_status VARCHAR(20) DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (slot_id) REFERENCES slots(id)
);