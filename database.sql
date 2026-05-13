-- JBTB Casting Website Database Schema
-- Database untuk Talent Management dan Casting Agency

-- Create Database
CREATE DATABASE IF NOT EXISTS jbtb_casting;
USE jbtb_casting;

-- Table untuk Lowongan Pekerjaan
CREATE TABLE IF NOT EXISTS jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  rate VARCHAR(255) NOT NULL,
  requirements LONGTEXT NOT NULL,
  description LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  INDEX idx_created_at (created_at),
  INDEX idx_is_active (is_active)
);

-- Table untuk Data Pelamar
CREATE TABLE IF NOT EXISTS applicants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  wa VARCHAR(20) NOT NULL,
  job_applied VARCHAR(255) NOT NULL,
  photo_link LONGTEXT,
  portfolio_link LONGTEXT,
  status ENUM('Pending', 'Accepted', 'Rejected') DEFAULT 'Pending',
  applied_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_job_applied (job_applied),
  INDEX idx_status (status),
  INDEX idx_applied_date (applied_date),
  FULLTEXT INDEX idx_name (name)
);

-- Table untuk Admin
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- Table untuk Logs/History
CREATE TABLE IF NOT EXISTS activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  action_type VARCHAR(100) NOT NULL,
  description LONGTEXT,
  admin_id INT,
  affected_data_id INT,
  affected_table VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_created_at (created_at),
  INDEX idx_action_type (action_type),
  FOREIGN KEY (admin_id) REFERENCES admin_users(id)
);

-- Default data untuk Lowongan Pekerjaan
INSERT INTO jobs (title, rate, requirements, description) VALUES
(
  'Pemeran Utama Film',
  'Rp 5.000.000 - 15.000.000',
  'Pria/Wanita,Usia 20-30th,Bisa Akting Menangis',
  'Kami mencari pemeran utama untuk film drama terbaru. Kandidat harus memiliki pengalaman minimal 2 tahun dalam industri film dan mampu memahami karakter dengan mendalam. Proses pengambilan akan berlangsung selama 3 bulan dengan shooting di berbagai lokasi.'
);

-- Default data untuk Pelamar
INSERT INTO applicants (name, email, wa, job_applied, photo_link, portfolio_link, status) VALUES
(
  'Reza Rahadian',
  'reza.rahadian@talent.com',
  '081234567890',
  'Pemeran Utama Film',
  'https://google.com/search?q=photo',
  'https://youtube.com/watch?v=reza',
  'Pending'
),
(
  'Chelsea Islan',
  'chelsea.islan@talent.com',
  '089988776655',
  'Pemeran Utama Film',
  'https://google.com/search?q=photo',
  'https://youtube.com/watch?v=chelsea',
  'Pending'
);

-- Optional: Default Admin User (password: admin123 - gunakan bcrypt untuk hash)
-- INSERT INTO admin_users (username, password_hash, email) VALUES
-- ('admin', '$2y$10$xyz...', 'admin@jbtbcasting.com');
