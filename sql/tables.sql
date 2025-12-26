-- Create users table
CREATE TABLE users (
  id TEXT PRIMARY KEY DEFAULT encode(gen_random_bytes(4), 'hex'),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  phone TEXT,
  area TEXT,
  city TEXT,
  country TEXT,
  profile_pic TEXT, -- Cloudinary URL
  age INTEGER,
  preferred_crops TEXT[], -- Array of crops
  is_banned BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create notifications table
CREATE TABLE notifications (
  id TEXT PRIMARY KEY DEFAULT encode(gen_random_bytes(4), 'hex'),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- E.g., forum, rental_reminder, welcome, etc.
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better performance
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);



-- Create expenses_earnings table
CREATE TABLE expenses_earnings (
  id TEXT PRIMARY KEY DEFAULT encode(gen_random_bytes(4), 'hex'),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('expense', 'earning')) NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  year INTEGER GENERATED ALWAYS AS (EXTRACT(YEAR FROM date)) STORED,
  month INTEGER GENERATED ALWAYS AS (EXTRACT(MONTH FROM date)) STORED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_expenses_earnings_user_id ON expenses_earnings(user_id);
CREATE INDEX idx_expenses_earnings_date ON expenses_earnings(date);
CREATE INDEX idx_expenses_earnings_year_month ON expenses_earnings(year, month);
CREATE INDEX idx_expenses_earnings_type ON expenses_earnings(type);


-- Create lands table
CREATE TABLE lands (
  id TEXT PRIMARY KEY DEFAULT encode(gen_random_bytes(4), 'hex'),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  land_type TEXT NOT NULL,
  area NUMERIC(10,2) NOT NULL, -- E.g., in acres
  soil_quality TEXT,
  location_link TEXT,
  description TEXT, -- short description
  tags TEXT[],
  land_image TEXT, -- Single image URL
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_lands_user_id ON lands(user_id);
CREATE INDEX idx_lands_created_at ON lands(created_at);
CREATE INDEX idx_lands_land_type ON lands(land_type);



-- Create admin table
CREATE TABLE IF NOT EXISTS admin (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin (password: admin123)
INSERT INTO admin (username, password, email) VALUES 
('admin', '$2a$12$FmHwXEja.5cw8RisOzw4keox9SMDvEggNMRNVgCeUiH0D407W8PVu', 'admin@agriculture.com');

-- Note: The password hash above is for 'admin123'
-- In production, generate a proper bcrypt hash for your desired password



-- Create marketplace listings table for B2B crop sales
CREATE TABLE marketplace_listings (
  id TEXT PRIMARY KEY DEFAULT encode(gen_random_bytes(4), 'hex'),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  crop_name TEXT NOT NULL,
  description TEXT,
  price_per_unit NUMERIC(10, 2) NOT NULL,
  unit TEXT NOT NULL, -- e.g., 'kg', 'ton', 'quintal'
  quantity_available NUMERIC(10, 2) NOT NULL,
  location TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  images TEXT[], -- Array of image URLs
  status TEXT CHECK (status IN ('active', 'sold', 'inactive')) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for marketplace listings
CREATE INDEX idx_marketplace_user_id ON marketplace_listings(user_id);
CREATE INDEX idx_marketplace_crop_name ON marketplace_listings(crop_name);
CREATE INDEX idx_marketplace_status ON marketplace_listings(status);
CREATE INDEX idx_marketplace_created_at ON marketplace_listings(created_at);

-- Create seasonal crop planning table
CREATE TABLE seasonal_crop_plans (
  id TEXT PRIMARY KEY DEFAULT encode(gen_random_bytes(4), 'hex'),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  land_id TEXT REFERENCES lands(id) ON DELETE CASCADE,
  crop_name TEXT NOT NULL,
  season TEXT NOT NULL, -- e.g., 'Winter', 'Summer', 'Monsoon'
  planting_date DATE,
  expected_harvest_date DATE,
  estimated_yield NUMERIC(10, 2),
  yield_unit TEXT, -- e.g., 'kg', 'ton'
  notes TEXT,
  status TEXT CHECK (status IN ('planned', 'planted', 'harvested', 'cancelled')) DEFAULT 'planned',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for seasonal crop plans
CREATE INDEX idx_seasonal_crop_plans_user_id ON seasonal_crop_plans(user_id);
CREATE INDEX idx_seasonal_crop_plans_land_id ON seasonal_crop_plans(land_id);
CREATE INDEX idx_seasonal_crop_plans_season ON seasonal_crop_plans(season);
CREATE INDEX idx_seasonal_crop_plans_status ON seasonal_crop_plans(status);

---crop records table
CREATE TABLE crop_records (
  id TEXT PRIMARY KEY DEFAULT encode(gen_random_bytes(4), 'hex'),
  land_id TEXT NOT NULL REFERENCES lands(id) ON DELETE CASCADE,
  crop_name TEXT NOT NULL, 
  season TEXT NOT NULL, 
  year INTEGER NOT NULL,
  planting_date DATE NOT NULL,
  harvest_date DATE,
  total_yield NUMERIC(10,2),
  yield_unit TEXT,
  total_expenses NUMERIC(10,2), 
  total_revenue NUMERIC(10,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Add user connections table for friend requests
CREATE TABLE user_connections (
  id TEXT PRIMARY KEY DEFAULT encode(gen_random_bytes(4), 'hex'),
  requester_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(requester_id, receiver_id)
);

-- Create indexes for better performance
CREATE INDEX idx_user_connections_requester ON user_connections(requester_id);
CREATE INDEX idx_user_connections_receiver ON user_connections(receiver_id);
CREATE INDEX idx_user_connections_status ON user_connections(status);

-- Add latitude and longitude to users table for location-based queries
ALTER TABLE users ADD COLUMN latitude NUMERIC(10, 7);
ALTER TABLE users ADD COLUMN longitude NUMERIC(10, 7);

-- Create spatial index for location queries
CREATE INDEX idx_users_location ON users(latitude, longitude);

-- Create AIchats table
CREATE TABLE AIchats (
  id TEXT PRIMARY KEY DEFAULT encode(gen_random_bytes(4), 'hex'),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create AImessages table
CREATE TABLE AImessages (
  id TEXT PRIMARY KEY DEFAULT encode(gen_random_bytes(4), 'hex'),
  chat_id TEXT NOT NULL REFERENCES AIchats(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant')) NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT, -- Cloudinary URL for uploaded images
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_AIchats_user_id ON AIchats(user_id);
CREATE INDEX idx_AIchats_created_at ON AIchats(created_at);
CREATE INDEX idx_AImessages_chat_id ON AImessages(chat_id);
CREATE INDEX idx_AImessages_timestamp ON AImessages(timestamp);



-- First, drop the existing indexes
DROP INDEX IF EXISTS idx_chats_user_id;
DROP INDEX IF EXISTS idx_chats_created_at;
DROP INDEX IF EXISTS idx_messages_chat_id;
DROP INDEX IF EXISTS idx_messages_timestamp;

-- Rename the tables
ALTER TABLE chats RENAME TO AIchats;
ALTER TABLE messages RENAME TO AImessages;


-- Recreate indexes with new table names
CREATE INDEX idx_AIchats_user_id ON AIchats(user_id);
CREATE INDEX idx_AIchats_created_at ON AIchats(created_at);
CREATE INDEX idx_AImessages_chat_id ON AImessages(chat_id);
CREATE INDEX idx_AImessages_timestamp ON AImessages(timestamp);


-- Forum Tables Migration
-- Run this to add forum functionality

-- =========================
-- Forum Posts
-- =========================
CREATE TABLE forum_posts (
  id TEXT PRIMARY KEY DEFAULT encode(gen_random_bytes(4), 'hex'),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  flair TEXT,               -- e.g., 'Question', 'Discussion', 'Tips', 'News'
  area TEXT,
  city TEXT,
  images TEXT[],            -- Array of Cloudinary URLs for uploaded images
  views_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  votes_count INTEGER DEFAULT 0,
  last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for faster filtering and sorting
CREATE INDEX idx_posts_area_city ON forum_posts(area, city);
CREATE INDEX idx_posts_flair ON forum_posts(flair);
CREATE INDEX idx_posts_last_activity ON forum_posts(last_activity DESC);

-- =========================
-- Comments (flat, no replies)
-- =========================
CREATE TABLE forum_comments (
  id TEXT PRIMARY KEY DEFAULT encode(gen_random_bytes(4), 'hex'),
  post_id TEXT NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for fetching comments by post quickly
CREATE INDEX idx_comments_post_id ON forum_comments(post_id);

-- =========================
-- Votes (only for posts)
-- =========================
CREATE TABLE forum_votes (
  id TEXT PRIMARY KEY DEFAULT encode(gen_random_bytes(4), 'hex'),
  post_id TEXT NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  vote_type SMALLINT NOT NULL CHECK (vote_type IN (1, -1)), -- 1 = upvote, -1 = downvote
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, post_id) -- prevent duplicate votes
);

-- Index to quickly sum votes per post
CREATE INDEX idx_votes_post_id ON forum_votes(post_id);


-- Create messaging system tables

-- Create conversations table
CREATE TABLE conversations (
  conversation_id TEXT PRIMARY KEY DEFAULT encode(gen_random_bytes(4), 'hex'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create conversation participants table (many-to-many relationship)
CREATE TABLE conversation_participants (
  conversation_id TEXT NOT NULL REFERENCES conversations(conversation_id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (conversation_id, user_id)
);

-- Create messages table
CREATE TABLE messages (
  message_id TEXT PRIMARY KEY DEFAULT encode(gen_random_bytes(4), 'hex'),
  conversation_id TEXT NOT NULL REFERENCES conversations(conversation_id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_conversations_last_message_at ON conversations(last_message_at);
CREATE INDEX idx_conversation_participants_user_id ON conversation_participants(user_id);
CREATE INDEX idx_conversation_participants_conversation_id ON conversation_participants(conversation_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_messages_is_read ON messages(is_read);

-- Update user_connection_requests table name to match what we're using in the API
-- This assumes the existing table is called 'user_connections' but we need 'user_connection_requests'
-- If the table doesn't exist yet, create it
CREATE TABLE IF NOT EXISTS user_connection_requests (
  request_id TEXT PRIMARY KEY DEFAULT encode(gen_random_bytes(4), 'hex'),
  sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(sender_id, receiver_id)
);

-- Create indexes for user connection requests
CREATE INDEX IF NOT EXISTS idx_user_connection_requests_sender ON user_connection_requests(sender_id);
CREATE INDEX IF NOT EXISTS idx_user_connection_requests_receiver ON user_connection_requests(receiver_id);
CREATE INDEX IF NOT EXISTS idx_user_connection_requests_status ON user_connection_requests(status);


-- Create loans table
CREATE TABLE loans (
  id TEXT PRIMARY KEY DEFAULT encode(gen_random_bytes(4), 'hex'),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  loan_amount NUMERIC(12,2) NOT NULL,       -- Total loan taken
  paid_amount NUMERIC(12,2) DEFAULT 0,      -- How much has been repaid so far
  payment_due_date DATE NOT NULL,           -- Final due date
  status TEXT NOT NULL DEFAULT 'active',    -- active, completed, overdue
  notes TEXT,                               -- optional details/remarks
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for loans table
CREATE INDEX idx_loans_user_id ON loans(user_id);
CREATE INDEX idx_loans_status ON loans(status);
CREATE INDEX idx_loans_created_at ON loans(created_at);
CREATE INDEX idx_loans_due_date ON loans(payment_due_date);


-- Create loan payments table to track payment history
CREATE TABLE loan_payments (
  id TEXT PRIMARY KEY DEFAULT encode(gen_random_bytes(4), 'hex'),
  loan_id TEXT NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  payment_amount NUMERIC(12,2) NOT NULL,
  payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for loan payments table
CREATE INDEX idx_loan_payments_loan_id ON loan_payments(loan_id);
CREATE INDEX idx_loan_payments_user_id ON loan_payments(user_id);
CREATE INDEX idx_loan_payments_date ON loan_payments(payment_date);


-- Equipment posted by users for rent
CREATE TABLE equipment (
  id TEXT PRIMARY KEY DEFAULT encode(gen_random_bytes(4), 'hex'),
  owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  equipment_name TEXT NOT NULL,           -- equipment name/title
  description TEXT,
  price_per_day NUMERIC(10,2) NOT NULL,   -- rental price per day
  max_duration_days INTEGER NOT NULL,     -- maximum rental duration allowed
  owner_phone TEXT,                       -- redundant copy from users for quick access
  owner_email TEXT,
  status TEXT NOT NULL DEFAULT 'available', -- available, rented, removed
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Requests from other users to rent equipment
CREATE TABLE rental_requests (
  id TEXT PRIMARY KEY DEFAULT encode(gen_random_bytes(4), 'hex'),
  equipment_id TEXT NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
  requester_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  requester_phone TEXT,
  requester_email TEXT,
  price_per_day_requested NUMERIC(10,2) NOT NULL,   -- rental price per day
  requested_duration_days INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, rejected, cancelled
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for equipment table
CREATE INDEX idx_equipment_owner_id ON equipment(owner_id);
CREATE INDEX idx_equipment_status ON equipment(status);
CREATE INDEX idx_equipment_created_at ON equipment(created_at);

-- Create indexes for rental_requests table
CREATE INDEX idx_rental_requests_equipment_id ON rental_requests(equipment_id);
CREATE INDEX idx_rental_requests_requester_id ON rental_requests(requester_id);
CREATE INDEX idx_rental_requests_status ON rental_requests(status);
CREATE INDEX idx_rental_requests_created_at ON rental_requests(created_at);

CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    reporter_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reported_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    report_reason VARCHAR(255) NOT NULL,
    report_details TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reports_reporter ON reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_reports_reported_user ON reports(reported_user_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);