-- Seed data for Loyola School Memories App
-- This script populates the database with sample albums and photos

-- Insert sample albums
INSERT INTO albums (id, title, description, cover_image_url, category, event_date, location, photographer, photo_count) VALUES
(
  '550e8400-e29b-41d4-a716-446655440001',
  'Graduation Ceremony 2024',
  'A memorable graduation ceremony celebrating our students achievements and bright futures ahead.',
  '/african-students-graduation-ceremony.jpg',
  'Academic',
  '2024-07-15',
  'Loyola Secondary School Main Hall',
  'Mr. James Akol',
  25
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Sports Day Athletics',
  'Annual sports day featuring track and field events, showcasing our students athletic talents.',
  '/african-school-sports-day-athletics.jpg',
  'Sports',
  '2024-05-20',
  'School Sports Ground',
  'Ms. Sarah Deng',
  32
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'Cultural Festival 2024',
  'Celebrating South Sudanese culture with traditional dances, music, and cultural displays.',
  '/south-sudan-cultural-festival-traditional-dance.jpg',
  'Cultural',
  '2024-03-10',
  'School Auditorium',
  'Mr. Peter Mayen',
  18
),
(
  '550e8400-e29b-41d4-a716-446655440004',
  'Science Fair Projects',
  'Students showcase their innovative science projects and experiments.',
  '/african-students-science-fair-projects.jpg',
  'Academic',
  '2024-04-08',
  'Science Laboratory',
  'Dr. Mary Achol',
  22
),
(
  '550e8400-e29b-41d4-a716-446655440005',
  'Music Concert Evening',
  'An evening of beautiful music performances by our talented students.',
  '/placeholder.svg?height=400&width=600',
  'Arts',
  '2024-06-12',
  'School Hall',
  'Mr. John Garang',
  15
),
(
  '550e8400-e29b-41d4-a716-446655440006',
  'Community Service Day',
  'Students participating in community service activities around Wau.',
  '/placeholder.svg?height=400&width=600',
  'Community',
  '2024-02-28',
  'Wau Community Center',
  'Ms. Grace Nyandeng',
  28
);

-- Insert sample photos for each album
INSERT INTO photos (album_id, filename, original_filename, url, thumbnail_url, alt_text, caption, file_size, width, height) VALUES
-- Graduation Ceremony photos
('550e8400-e29b-41d4-a716-446655440001', 'grad_001.jpg', 'graduation_ceremony_main.jpg', '/african-students-graduation-ceremony.jpg', '/african-students-graduation-ceremony.jpg', 'Students in graduation caps and gowns', 'The graduating class of 2024', 850000, 1200, 800),
('550e8400-e29b-41d4-a716-446655440001', 'grad_002.jpg', 'valedictorian_speech.jpg', '/placeholder.svg?height=400&width=600', '/placeholder.svg?height=200&width=300', 'Student giving valedictorian speech', 'Valedictorian delivering inspiring speech', 720000, 1200, 800),

-- Sports Day photos
('550e8400-e29b-41d4-a716-446655440002', 'sports_001.jpg', 'athletics_track_race.jpg', '/african-school-sports-day-athletics.jpg', '/african-school-sports-day-athletics.jpg', 'Students running track race', 'Exciting 100m sprint race', 920000, 1200, 800),
('550e8400-e29b-41d4-a716-446655440002', 'sports_002.jpg', 'long_jump_competition.jpg', '/placeholder.svg?height=400&width=600', '/placeholder.svg?height=200&width=300', 'Student performing long jump', 'Record-breaking long jump attempt', 680000, 1200, 800),

-- Cultural Festival photos
('550e8400-e29b-41d4-a716-446655440003', 'culture_001.jpg', 'traditional_dance.jpg', '/south-sudan-cultural-festival-traditional-dance.jpg', '/south-sudan-cultural-festival-traditional-dance.jpg', 'Students performing traditional dance', 'Beautiful traditional South Sudanese dance', 780000, 1200, 800),
('550e8400-e29b-41d4-a716-446655440003', 'culture_002.jpg', 'cultural_costumes.jpg', '/placeholder.svg?height=400&width=600', '/placeholder.svg?height=200&width=300', 'Students in traditional costumes', 'Colorful traditional South Sudanese attire', 650000, 1200, 800),

-- Science Fair photos
('550e8400-e29b-41d4-a716-446655440004', 'science_001.jpg', 'science_projects.jpg', '/african-students-science-fair-projects.jpg', '/african-students-science-fair-projects.jpg', 'Students with science projects', 'Innovative science fair projects', 890000, 1200, 800),
('550e8400-e29b-41d4-a716-446655440004', 'science_002.jpg', 'chemistry_experiment.jpg', '/placeholder.svg?height=400&width=600', '/placeholder.svg?height=200&width=300', 'Students conducting chemistry experiment', 'Exciting chemistry demonstration', 710000, 1200, 800);
