1. Database Schema
Create Database
CREATE DATABASE IF NOT EXISTS lucia_printing_db;
USE lucia_printing_db;

-- Users Table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    company_name VARCHAR(100),
    address TEXT,
    city VARCHAR(50),
    country VARCHAR(50),
    postal_code VARCHAR(20),
    role ENUM('customer', 'admin', 'staff') DEFAULT 'customer',
    avatar_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Services Table
CREATE TABLE services (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    short_description VARCHAR(255),
    icon_name VARCHAR(50),
    gradient_from VARCHAR(50),
    gradient_to VARCHAR(50),
    badge_text VARCHAR(50),
    price_range VARCHAR(50),
    min_price DECIMAL(10,2),
    max_price DECIMAL(10,2),
    is_featured BOOLEAN DEFAULT FALSE,
    is_popular BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_featured (is_featured),
    INDEX idx_popular (is_popular)
);

-- Service Features Table
CREATE TABLE service_features (
    id INT PRIMARY KEY AUTO_INCREMENT,
    service_id INT NOT NULL,
    feature_text VARCHAR(255) NOT NULL,
    sort_order INT DEFAULT 0,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    INDEX idx_service (service_id)
);

-- Why Choose Us Items
CREATE TABLE why_choose_us (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    icon_name VARCHAR(50),
    color_from VARCHAR(50),
    color_to VARCHAR(50),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Process Steps
CREATE TABLE process_steps (
    id INT PRIMARY KEY AUTO_INCREMENT,
    step_number INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    icon_name VARCHAR(50),
    color_from VARCHAR(50),
    color_to VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    UNIQUE KEY unique_step (step_number),
    INDEX idx_step (step_number)
);

-- Testimonials Table
CREATE TABLE testimonials (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(100) NOT NULL,
    customer_role VARCHAR(100),
    customer_company VARCHAR(100),
    customer_avatar VARCHAR(255),
    content TEXT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    is_featured BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_featured (is_featured),
    INDEX idx_rating (rating)
);

-- Portfolio Categories
CREATE TABLE portfolio_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0
);

-- Portfolio Items
CREATE TABLE portfolio_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    description TEXT,
    image_url VARCHAR(500) NOT NULL,
    category_id INT,
    client_name VARCHAR(100),
    completion_date DATE,
    is_featured BOOLEAN DEFAULT FALSE,
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES portfolio_categories(id) ON DELETE SET NULL,
    INDEX idx_category (category_id),
    INDEX idx_featured (is_featured),
    INDEX idx_date (completion_date)
);

-- Orders Table
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INT,
    service_id INT,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'quote_sent', 'approved', 'in_progress', 'completed', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
    payment_method VARCHAR(50),
    design_files TEXT,
    specifications TEXT,
    quantity INT,
    dimensions VARCHAR(100),
    deadline DATE,
    shipping_address TEXT,
    shipping_method VARCHAR(50),
    tracking_number VARCHAR(100),
    notes TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL,
    INDEX idx_order_number (order_number),
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_created (created_at)
);

-- Order Items
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    specifications JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Blog Categories
CREATE TABLE blog_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- Blog Posts
CREATE TABLE blog_posts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content LONGTEXT,
    featured_image VARCHAR(500),
    category_id INT,
    author_id INT,
    views INT DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE SET NULL,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_published (is_published, published_at),
    INDEX idx_category (category_id),
    INDEX idx_author (author_id),
    FULLTEXT INDEX idx_content (title, content)
);

-- FAQs
CREATE TABLE faqs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(50),
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Contacts/Inquiries
CREATE TABLE contacts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    service_interest VARCHAR(100),
    status ENUM('new', 'read', 'replied') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_email (email)
);

-- Newsletter Subscribers
CREATE TABLE newsletter_subscribers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_active (is_active)
);

-- Site Statistics
CREATE TABLE site_stats (
    id INT PRIMARY KEY AUTO_INCREMENT,
    stat_key VARCHAR(50) UNIQUE NOT NULL,
    stat_value BIGINT NOT NULL,
    stat_label VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
2. Sample INSERT Queries
-- Insert Services
INSERT INTO services (name, slug, description, short_description, icon_name, gradient_from, gradient_to, badge_text, is_featured, is_popular) VALUES
('DTF Printing', 'dtf-printing', 'Vibrant and durable printing for all fabrics with premium quality.', 'Direct-to-film printing for all fabrics', 'Megaphone', 'purple-500', 'pink-500', 'Most Popular', TRUE, TRUE),
('Online Upload', 'online-upload', 'Upload your design and get instant measurement with AI analysis.', 'Instant AI-powered design analysis', 'Upload', 'blue-500', 'cyan-500', 'Smart Tool', TRUE, FALSE),
('Live Chat', 'live-chat', 'Talk instantly with our professional support team 24/7.', '24/7 instant support', 'MessageCircle', 'green-500', 'emerald-500', '24/7 Support', TRUE, FALSE),
('Custom Design', 'custom-design', 'Professional designers help bring your creative vision to life.', 'Professional design services', 'Palette', 'orange-500', 'red-500', 'Creative', TRUE, TRUE);

-- Insert Service Features
INSERT INTO service_features (service_id, feature_text, sort_order) VALUES
(1, 'High Resolution', 1),
(1, 'Vibrant Colors', 2),
(1, 'Durable', 3),
(2, 'AI Powered', 1),
(2, 'Instant Quote', 2),
(2, 'Size Check', 3);

-- Insert Why Choose Us Items
INSERT INTO why_choose_us (title, description, icon_name, color_from, color_to, sort_order) VALUES
('Lightning Fast', 'Same-day delivery available', 'Truck', 'blue-500', 'cyan-500', 1),
('Premium Quality', 'Top-grade materials & latest tech', 'Award', 'yellow-500', 'orange-500', 2),
('24/7 Support', 'Always here to help you', 'Headphones', 'green-500', 'emerald-500', 3),
('Best Price', 'Competitive rates, no hidden costs', 'DollarSign', 'purple-500', 'pink-500', 4),
('100% Satisfaction', 'Money-back guarantee', 'Shield', 'red-500', 'orange-500', 5),
('Eco-Friendly', 'Sustainable printing practices', 'Sparkles', 'green-500', 'teal-500', 6);

-- Insert Process Steps
INSERT INTO process_steps (step_number, title, description, icon_name, color_from, color_to, sort_order) VALUES
(1, 'Upload Design', 'Drag & drop your files', 'Upload', 'blue-500', 'cyan-500', 1),
(2, 'Get Quote', 'Instant price calculation', 'DollarSign', 'green-500', 'emerald-500', 2),
(3, 'Approve & Pay', 'Secure payment options', 'CheckCircle', 'yellow-500', 'orange-500', 3),
(4, 'Print & Ship', 'Track your order live', 'Truck', 'purple-500', 'pink-500', 4);

-- Insert Portfolio Categories
INSERT INTO portfolio_categories (name, slug, sort_order) VALUES
('All', 'all', 0),
('Branding', 'branding', 1),
('Banners', 'banners', 2),
('Apparel', 'apparel', 3),
('Labels', 'labels', 4),
('Wraps', 'wraps', 5),
('Print', 'print', 6),
('Outdoor', 'outdoor', 7),
('Packaging', 'packaging', 8);

-- Insert Testimonials
INSERT INTO testimonials (customer_name, customer_role, customer_company, content, rating, is_featured, is_approved) VALUES
('Sarah Johnson', 'Business Owner', 'Sarah\'s Boutique', 'Best printing service in town! Fast delivery and amazing quality. The team went above and beyond to ensure my order was perfect.', 5, TRUE, TRUE),
('Michael Chen', 'Event Planner', 'Elite Events', 'Their DTF printing is outstanding. Highly recommended for any event needs.', 5, TRUE, TRUE),
('Emma Williams', 'Creative Director', 'Creative Studio', 'Professional team and excellent customer service.', 5, TRUE, TRUE);

-- Insert FAQs
INSERT INTO faqs (question, answer, category, sort_order) VALUES
('What is DTF printing?', 'DTF (Direct to Film) printing is a method of printing designs onto a special film that is then transferred to fabric using heat and adhesive powder.', 'services', 1),
('How long does delivery take?', 'Standard delivery takes 3-5 business days. Express delivery is available for 24-48 hour turnaround.', 'shipping', 2),
('What file formats do you accept?', 'We accept AI, PSD, PDF, PNG, and JPEG files. For best results, vector files are recommended.', 'technical', 3),
('Do you offer design services?', 'Yes, our professional designers can help create or refine your designs for an additional fee.', 'services', 4);

-- Insert Site Statistics
INSERT INTO site_stats (stat_key, stat_value, stat_label) VALUES
('projects_completed', 5000, 'Projects Completed'),
('happy_clients', 1200, 'Happy Clients'),
('years_experience', 13, 'Years Experience'),
('support_hours', 24, 'Hour Support');

-- Insert a sample user (password: 'password123' hashed with bcrypt)
INSERT INTO users (first_name, last_name, email, password_hash, phone, role) VALUES
('Admin', 'User', 'admin@luciaprinting.com', '$2a$10$YourHashedPasswordHere', '+1234567890', 'admin');
3. Useful SELECT Queries
-- Get all featured services with their features
SELECT 
    s.*,
    GROUP_CONCAT(sf.feature_text) as features
FROM services s
LEFT JOIN service_features sf ON s.id = sf.service_id
WHERE s.is_featured = TRUE
GROUP BY s.id
ORDER BY s.sort_order;

-- Get dashboard statistics
SELECT
    (SELECT COUNT(*) FROM users WHERE role = 'customer') as total_customers,
    (SELECT COUNT(*) FROM orders) as total_orders,
    (SELECT SUM(total_amount) FROM orders WHERE status = 'completed') as total_revenue,
    (SELECT COUNT(*) FROM contacts WHERE status = 'new') as new_inquiries,
    (SELECT COUNT(*) FROM newsletter_subscribers WHERE is_active = TRUE) as active_subscribers;

-- Get recent orders with customer details
SELECT 
    o.order_number,
    o.total_amount,
    o.status,
    o.created_at,
    CONCAT(u.first_name, ' ', u.last_name) as customer_name,
    u.email,
    u.phone
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
ORDER BY o.created_at DESC
LIMIT 10;

-- Get popular services based on orders
SELECT 
    s.name,
    COUNT(o.id) as order_count,
    SUM(o.total_amount) as revenue
FROM services s
LEFT JOIN orders o ON s.id = o.service_id
WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
GROUP BY s.id
ORDER BY order_count DESC;

-- Get testimonial statistics
SELECT 
    rating,
    COUNT(*) as count,
    AVG(rating) as avg_rating
FROM testimonials
WHERE is_approved = TRUE
GROUP BY rating
ORDER BY rating DESC;

-- Get monthly order summary
SELECT 
    DATE_FORMAT(created_at, '%Y-%m') as month,
    COUNT(*) as total_orders,
    SUM(total_amount) as revenue,
    AVG(total_amount) as avg_order_value
FROM orders
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
GROUP BY DATE_FORMAT(created_at, '%Y-%m')
ORDER BY month DESC;

-- Get portfolio items by category
SELECT 
    pc.name as category_name,
    COUNT(pi.id) as item_count,
    GROUP_CONCAT(pi.title) as items
FROM portfolio_categories pc
LEFT JOIN portfolio_items pi ON pc.id = pi.category_id
GROUP BY pc.id
ORDER BY pc.sort_order;

-- Get unread contacts
SELECT 
    name,
    email,
    subject,
    message,
    created_at
FROM contacts
WHERE status = 'new'
ORDER BY created_at DESC;

-- Search blog posts
SELECT 
    title,
    excerpt,
    created_at,
    MATCH(title, content) AGAINST('printing services' IN NATURAL LANGUAGE MODE) as relevance
FROM blog_posts
WHERE MATCH(title, content) AGAINST('printing services' IN NATURAL LANGUAGE MODE)
AND is_published = TRUE
ORDER BY relevance DESC
LIMIT 10;

-- Get customer order history
SELECT 
    u.first_name,
    u.last_name,
    u.email,
    COUNT(o.id) as order_count,
    SUM(o.total_amount) as total_spent,
    MAX(o.created_at) as last_order_date
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.role = 'customer'
GROUP BY u.id
ORDER BY total_spent DESC;

-- Get active newsletter subscribers
SELECT 
    email,
    name,
    subscribed_at
FROM newsletter_subscribers
WHERE is_active = TRUE
AND subscribed_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
ORDER BY subscribed_at DESC;

-- Get process steps for frontend display
SELECT 
    step_number,
    title,
    description,
    icon_name,
    color_from,
    color_to
FROM process_steps
WHERE is_active = TRUE
ORDER BY step_number;