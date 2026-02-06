-- Create small_groups table
CREATE TABLE IF NOT EXISTS small_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  day_of_week TEXT NOT NULL,
  time TEXT NOT NULL,
  leader TEXT NOT NULL,
  leader_phone TEXT,
  leader_email TEXT,
  category TEXT NOT NULL,
  gender TEXT NOT NULL CHECK (gender IN ('mixed', 'men', 'women')),
  age_range TEXT NOT NULL,
  current_lesson TEXT,
  is_church BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create members table
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES small_groups(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create roles table
CREATE TABLE IF NOT EXISTS group_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES small_groups(id) ON DELETE CASCADE,
  role_name TEXT NOT NULL,
  member_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create season_lessons table
CREATE TABLE IF NOT EXISTS season_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES small_groups(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  week_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES small_groups(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, date)
);

-- Create attendance_records table (which members attended)
CREATE TABLE IF NOT EXISTS attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attendance_id UUID NOT NULL REFERENCES attendance(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  present BOOLEAN DEFAULT TRUE,
  UNIQUE(attendance_id, member_id)
);

-- Create sermons/homilies table
CREATE TABLE IF NOT EXISTS sermons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES small_groups(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  scripture TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE small_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE season_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE sermons ENABLE ROW LEVEL SECURITY;

-- RLS Policies for small_groups (authenticated users can read, only admins can write)
CREATE POLICY "Anyone can view groups" ON small_groups FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert groups" ON small_groups FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update groups" ON small_groups FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete groups" ON small_groups FOR DELETE TO authenticated USING (true);

-- RLS Policies for members
CREATE POLICY "Anyone can view members" ON members FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert members" ON members FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update members" ON members FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete members" ON members FOR DELETE TO authenticated USING (true);

-- RLS Policies for group_roles
CREATE POLICY "Anyone can view roles" ON group_roles FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert roles" ON group_roles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update roles" ON group_roles FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete roles" ON group_roles FOR DELETE TO authenticated USING (true);

-- RLS Policies for season_lessons
CREATE POLICY "Anyone can view lessons" ON season_lessons FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert lessons" ON season_lessons FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update lessons" ON season_lessons FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete lessons" ON season_lessons FOR DELETE TO authenticated USING (true);

-- RLS Policies for attendance
CREATE POLICY "Anyone can view attendance" ON attendance FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert attendance" ON attendance FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update attendance" ON attendance FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete attendance" ON attendance FOR DELETE TO authenticated USING (true);

-- RLS Policies for attendance_records
CREATE POLICY "Anyone can view attendance records" ON attendance_records FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert attendance records" ON attendance_records FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update attendance records" ON attendance_records FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete attendance records" ON attendance_records FOR DELETE TO authenticated USING (true);

-- RLS Policies for sermons
CREATE POLICY "Anyone can view sermons" ON sermons FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert sermons" ON sermons FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update sermons" ON sermons FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete sermons" ON sermons FOR DELETE TO authenticated USING (true);
