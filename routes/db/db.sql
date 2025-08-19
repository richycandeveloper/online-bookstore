-- Create database
CREATE DATABASE IF NOT EXISTS online_bookstore;
USE online_bookstore;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Books table
CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(150) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cart table
CREATE TABLE IF NOT EXISTS cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    quantity INT DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- Insert an admin account
INSERT INTO users (username, email, password, role)
VALUES ('admin', 'admin@example.com', '12345', 'admin');

-- Insert some sample books
INSERT INTO books (title, author, price, description, image_url) VALUES
('The Pragmatic Programmer', 'Andrew Hunt', 10000, 'Classic book for software developers.', 'book1.jpg'),
('Clean Code', 'Robert C. Martin', 23000, 'Guide to writing clean and maintainable code.', 'book2.jpg'),
('JavaScript: The Good Parts', 'Douglas Crockford', 1300, 'Deep dive into JavaScript.', 'book3.jpg');
