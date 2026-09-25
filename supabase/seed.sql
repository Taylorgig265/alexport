-- ============================================================================
-- Alexander Daudi — Portfolio seed data
--
-- Order of operations:
--   1. Run schema.sql
--   2. Create the auth user alexdaud17@gmail.com in Supabase → Authentication
--      (the trigger creates the profile row with the admin role)
--   3. Run this file
-- ============================================================================

-- --------------------------------------------------------------- profile ---
update public.profiles
set
  full_name    = 'Alexander Daudi',
  headline     = 'Marketing Graduate · Sales, Digital Marketing & Web Development',
  email        = 'alexdaud17@gmail.com',
  phone        = '088260322 · 0993655408',
  location     = 'Blantyre, Malawi',
  availability = 'Available for new opportunities',
  resume_url   = '/Alexander-Daudi-Resume.pdf',
  bio          = 'Results-driven Marketing Graduate with expertise in sales, digital marketing, and web development. Proven ability to develop data-driven strategies, create compelling content, and build strong business relationships. Combines technical proficiency in web development, graphic design, and audio/video production with creative execution to deliver high-impact marketing solutions.'
where lower(email) = 'alexdaud17@gmail.com';

-- ------------------------------------------------------------ experience ---
insert into public.experiences (company, role, period, summary, bullets, sort_order) values
  (
    'SFFRFM',
    'Sales Clerk',
    '3 years',
    'Managed end-to-end sales for fertilizer while keeping high-volume cash transactions accurate and inventory records at 100% accuracy.',
    array[
      'Managed end-to-end sales cycle for fertilizer, serving 50+ clients daily and ensuring accurate processing of high-volume cash transactions.',
      'Oversaw inventory management for receiving and storage, maintaining 100% accuracy in stock records.',
      'Streamlined weekly and monthly reporting processes, contributing to improved administrative efficiency.',
      'Supported administrative decision-making and coordinated team meetings to align on sales targets.'
    ],
    1
  ),
  (
    'Ufulu FM',
    'Marketing Intern',
    '2020',
    'Supported audience growth and brand presence through listener strategies, multimedia content and B2B relationship management.',
    array[
      'Developed strategies to attract and retain listeners, contributing to increased audience engagement.',
      'Created engaging multimedia content for promotional campaigns, strengthening brand presence.',
      'Managed sales documentation and supported B2B relationship management, identifying new opportunities for partnership and growth.'
    ],
    2
  )
on conflict (company, role) do nothing;

-- ---------------------------------------------------------------- skills ---
insert into public.skills (name, category, sort_order) values
  ('Customer Relationship Management (CRM)', 'Business & Admin', 1),
  ('Microsoft Office Suite', 'Business & Admin', 2),
  ('Project Management', 'Business & Admin', 3),
  ('Bookkeeping', 'Business & Admin', 4),
  ('Data Analysis', 'Business & Admin', 5),
  ('Customer Service', 'Business & Admin', 6),
  ('Strategy Development', 'Business & Admin', 7),
  ('Campaign Execution', 'Business & Admin', 8),
  ('Customer Acquisition', 'Business & Admin', 9),
  ('Retention', 'Business & Admin', 10),
  ('HTML', 'Web Development', 11),
  ('CSS', 'Web Development', 12),
  ('JavaScript', 'Web Development', 13),
  ('React', 'Web Development', 14),
  ('Next.js', 'Web Development', 15),
  ('SEO', 'Digital Marketing', 16),
  ('Content Creation', 'Digital Marketing', 17),
  ('Social Media Management', 'Digital Marketing', 18),
  ('B2B Marketing', 'Digital Marketing', 19),
  ('Graphic Design', 'Design & Production', 20),
  ('Audio/Video Editing', 'Design & Production', 21)
on conflict (name, category) do nothing;

-- -------------------------------------------------------------- projects ---
insert into public.projects (title, description, tech, featured, sort_order) values
  (
    'Portfolio Platform',
    'This portfolio — a modern, database-backed site with an admin panel so content can be updated without touching code.',
    array['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    true,
    1
  )
on conflict (title) do nothing;

-- ------------------------------------------------------------- education ---
insert into public.education (institution, qualification, period, details, sort_order) values
  (
    'Malawi Assemblies of God University',
    'Bachelor of Commerce in Marketing',
    '2017 – 2022',
    '',
    1
  ),
  (
    'Limbe East Academy',
    'Malawi School Certificate of Education (MSCE)',
    '2013 – 2015',
    '',
    2
  )
on conflict (institution, qualification) do nothing;
