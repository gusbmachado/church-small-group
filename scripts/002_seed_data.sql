-- Insert church location
INSERT INTO small_groups (name, address, latitude, longitude, day_of_week, time, leader, leader_phone, leader_email, category, gender, age_range, is_church)
VALUES (
  'Grace Community Church',
  '123 Main Street, Downtown',
  40.7128,
  -74.006,
  'Sunday',
  '10:00 AM',
  'Pastor John Smith',
  '(555) 123-4567',
  'pastor@gracechurch.org',
  'Main Church',
  'mixed',
  'All Ages',
  true
);

-- Insert sample small groups
INSERT INTO small_groups (id, name, address, latitude, longitude, day_of_week, time, leader, leader_phone, leader_email, category, gender, age_range, current_lesson)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Young Adults Fellowship', '456 Oak Avenue, Apt 2B', 40.7148, -74.002, 'Tuesday', '7:00 PM', 'Michael Johnson', '(555) 234-5678', 'michael.j@email.com', 'Young Adults', 'mixed', '18-30', 'Week 3: Community Living'),
  ('22222222-2222-2222-2222-222222222222', 'Mens Bible Study', '789 Pine Street', 40.7108, -74.008, 'Thursday', '6:30 AM', 'Robert Williams', '(555) 345-6789', 'robert.w@email.com', 'Mens Ministry', 'men', '30-50', 'Week 2: Work & Faith'),
  ('33333333-3333-3333-3333-333333333333', 'Womens Prayer Group', '321 Maple Drive', 40.7168, -74.01, 'Wednesday', '10:00 AM', 'Patricia Moore', '(555) 456-7890', 'patricia.m@email.com', 'Womens Ministry', 'women', '40-60', 'Week 2: Intercessory Prayer'),
  ('44444444-4444-4444-4444-444444444444', 'Senior Saints', '567 Elm Court', 40.7098, -74.004, 'Friday', '2:00 PM', 'George Thompson', '(555) 567-8901', 'george.t@email.com', 'Senior Ministry', 'mixed', '65+', 'Week 1: Legacy of Faith'),
  ('55555555-5555-5555-5555-555555555555', 'Youth Group', '890 Cedar Lane', 40.7138, -74.012, 'Saturday', '5:00 PM', 'Kevin Martinez', '(555) 678-9012', 'kevin.m@email.com', 'Youth Ministry', 'mixed', '13-17', 'Week 2: Peer Pressure');

-- Insert members for Young Adults Fellowship
INSERT INTO members (group_id, name, phone, email) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Sarah Chen', '(555) 111-1111', 'sarah@email.com'),
  ('11111111-1111-1111-1111-111111111111', 'David Kim', '(555) 222-2222', 'david@email.com'),
  ('11111111-1111-1111-1111-111111111111', 'Emily Brown', '(555) 333-3333', 'emily@email.com'),
  ('11111111-1111-1111-1111-111111111111', 'James Wilson', '(555) 444-4444', 'james@email.com'),
  ('11111111-1111-1111-1111-111111111111', 'Lisa Anderson', '(555) 555-5555', 'lisa@email.com');

-- Insert members for Men's Bible Study
INSERT INTO members (group_id, name, phone, email) VALUES
  ('22222222-2222-2222-2222-222222222222', 'Tom Harris', '(555) 666-6666', 'tom@email.com'),
  ('22222222-2222-2222-2222-222222222222', 'Mark Davis', '(555) 777-7777', 'mark@email.com'),
  ('22222222-2222-2222-2222-222222222222', 'Chris Lee', '(555) 888-8888', 'chris@email.com');

-- Insert members for Women's Prayer Group
INSERT INTO members (group_id, name, phone, email) VALUES
  ('33333333-3333-3333-3333-333333333333', 'Nancy White', '(555) 999-9999', 'nancy@email.com'),
  ('33333333-3333-3333-3333-333333333333', 'Carol Green', '(555) 000-0000', 'carol@email.com'),
  ('33333333-3333-3333-3333-333333333333', 'Diana Ross', '(555) 121-2121', 'diana@email.com'),
  ('33333333-3333-3333-3333-333333333333', 'Betty Clark', '(555) 131-3131', 'betty@email.com');

-- Insert roles
INSERT INTO group_roles (group_id, role_name, member_name) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Worship Leader', 'Sarah Chen'),
  ('11111111-1111-1111-1111-111111111111', 'Host', 'David Kim'),
  ('11111111-1111-1111-1111-111111111111', 'Food Coordinator', 'Emily Brown'),
  ('22222222-2222-2222-2222-222222222222', 'Discussion Leader', 'Tom Harris'),
  ('22222222-2222-2222-2222-222222222222', 'Coffee Host', 'Mark Davis'),
  ('33333333-3333-3333-3333-333333333333', 'Prayer Coordinator', 'Nancy White'),
  ('33333333-3333-3333-3333-333333333333', 'Hospitality', 'Carol Green');

-- Insert season lessons for Young Adults Fellowship
INSERT INTO season_lessons (group_id, title, week_number) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Faith Foundations', 1),
  ('11111111-1111-1111-1111-111111111111', 'Prayer Life', 2),
  ('11111111-1111-1111-1111-111111111111', 'Community Living', 3),
  ('11111111-1111-1111-1111-111111111111', 'Serving Others', 4),
  ('11111111-1111-1111-1111-111111111111', 'Spiritual Growth', 5),
  ('11111111-1111-1111-1111-111111111111', 'Mission & Purpose', 6);

-- Insert sermons
INSERT INTO sermons (group_id, date, title, scripture, notes) VALUES
  ('11111111-1111-1111-1111-111111111111', '2024-01-02', 'Faith Foundations', 'Hebrews 11:1-6', 'Discussed the nature of faith and how it applies to daily life. Key takeaway: faith is active, not passive.'),
  ('11111111-1111-1111-1111-111111111111', '2024-01-09', 'Prayer Life', 'Matthew 6:5-15', 'Explored the Lords Prayer as a model. Practiced different prayer forms together.');
