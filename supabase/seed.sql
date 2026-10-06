-- ARPAN Seed Data
-- Fictional Indian community opportunities and needs reflecting dignity, humility and care.

-- 1. INSTITUTIONS
insert into public.institutions (id, title, context, category, location, image_url, verified, status) values
  ('11111111-1111-1111-1111-111111111101', 'Sahaj Community Centre', 'A neighbourhood space for learning, sharing skills and finding company. Everyone has a place at the table.', 'Community', 'Bengaluru', '/src/assets/learning.jpg', true, 'verified'),
  ('11111111-1111-1111-1111-111111111102', 'Ananda Elder Care Collective', 'Creating space for older adults to feel connected, heard and at home.', 'Elder Care', 'Bengaluru', '/src/assets/digital.jpg', true, 'verified'),
  ('11111111-1111-1111-1111-111111111103', 'Sangam Community Kitchen', 'Neighbours coming together to cook, share and nourish a community.', 'Food', 'Pune', '/src/assets/kitchen.jpg', true, 'verified'),
  ('11111111-1111-1111-1111-111111111104', 'Open Book Learning Trust', 'Making reading and lifelong learning welcoming and accessible.', 'Education', 'Delhi', '/src/assets/learning.jpg', true, 'verified'),
  ('11111111-1111-1111-1111-111111111105', 'Green Together Foundation', 'Caring for shared green spaces through everyday community participation.', 'Environment', 'Mumbai', '/src/assets/community.jpg', true, 'verified')
on conflict (id) do nothing;

-- 2. INSTITUTION WISHLISTS
insert into public.institution_wishlists (institution_id, item_title, description) values
  ('11111111-1111-1111-1111-111111111101', 'Books for children reading corner', 'Bilingual English and Kannada story books in good condition.'),
  ('11111111-1111-1111-1111-111111111101', 'Art supplies & drawing sheets', 'For the Saturday children group.'),
  ('11111111-1111-1111-1111-111111111103', 'Stainless steel serving bowls', 'Durable cookware for the community kitchen.'),
  ('11111111-1111-1111-1111-111111111105', 'Garden tools and watering cans', 'For neighbourhood park restoration.')
on conflict do nothing;

-- 3. SEVAS
insert into public.sevas (id, kind, title, context, date, time, duration, location, is_remote, spaces, recurring, roles_description, safety_guidelines, accessibility_notes, image_url, verified, status) values
  ('22222222-2222-2222-2222-222222222201', 'Teaching', 'Saturday Learning Circle', 'A little time together can make learning feel less lonely. Share a patient ear and help young adults find their confidence.', '2026-10-10', '10:00 AM', '2 hours', 'Bengaluru', false, 12, true, 'Welcome & listening, Hands-on support, Set-up and care', 'Bring a water bottle. Guidance will be available.', 'Step-free access and seating available.', '/src/assets/learning.jpg', true, 'active'),
  ('22222222-2222-2222-2222-222222222202', 'Food', 'Community Kitchen Seva', 'A meal tastes different when it is made together. Join neighbours to prepare and share a fresh community lunch.', '2026-10-11', '9:00 AM', '3 hours', 'Bengaluru', false, 15, true, 'Vegetable chopping, Cooking support, Cleaning and care', 'Clean apron provided. Wash hands before entry.', 'Ground floor accessible space.', '/src/assets/kitchen.jpg', true, 'active'),
  ('22222222-2222-2222-2222-222222222203', 'Elder Care', 'Digital Literacy for Senior Citizens', 'Staying connected should feel simple. Sit alongside older neighbours and explore everyday technology at their pace.', '2026-10-10', '11:00 AM', '2 hours', 'Bengaluru', false, 8, false, 'One-on-one patient phone guidance', 'Patience first. Do not enter passwords or banking apps.', 'Quiet hall with comfortable seating.', '/src/assets/digital.jpg', true, 'active'),
  ('22222222-2222-2222-2222-222222222204', 'Environment', 'Park Restoration Morning', 'Make a little space for nature, and for each other. Spend a morning planting and caring for our shared green space.', '2026-10-17', '8:00 AM', '2 hours', 'Bengaluru', false, 20, false, 'Planting, mulching, watering and tidying', 'Gloves provided. Wear closed shoes.', 'Outdoor park pathways with gentle slope.', '/src/assets/community.jpg', true, 'active'),
  ('22222222-2222-2222-2222-222222222205', 'Skill Sharing', 'Resume & Digital Skills Circle', 'Starting a new chapter is easier with company. Share practical experience with people preparing for their first job.', '2026-10-17', '10:00 AM', '2 hours', 'Pune', false, 10, false, 'Reviewing draft resumes and practice interviews', 'Gentle, supportive feedback only.', 'Step-free access.', '/src/assets/learning.jpg', true, 'active'),
  ('22222222-2222-2222-2222-222222222206', 'Cloth Donation', 'Cloth Collection & Sorting', 'Thoughtfully sort clean clothing so community members can choose what works for them.', '2026-10-18', '9:30 AM', '2 hours', 'Mumbai', false, 12, true, 'Sorting by size, folding, and gentle packaging', 'Masks available for dust sensitivity.', 'Wheelchair accessible community hall.', null, true, 'active'),
  ('22222222-2222-2222-2222-222222222207', 'Elder Care', 'Elder Care Visit', 'Sometimes the most meaningful thing we offer is an unhurried conversation.', '2026-10-24', '10:30 AM', '2 hours', 'Delhi', false, 8, true, 'Conversations, indoor board games, and reading aloud', 'Two adults present during visits.', 'Elevator access available.', '/src/assets/digital.jpg', true, 'active'),
  ('22222222-2222-2222-2222-222222222208', 'Cleaning', 'Neighbourhood Clean-up', 'Care for the streets we share with a friendly morning of neighbourhood cleaning.', '2026-10-25', '7:30 AM', '2 hours', 'Pune', false, 25, true, 'Litter pick-up, sorting recyclables, curb sweeping', 'Bags and grabbers provided. Wear thick-soled shoes.', 'Street walking.', '/src/assets/community.jpg', true, 'active'),
  ('22222222-2222-2222-2222-222222222209', 'Health', 'Community Health Awareness Day', 'Support a welcoming health awareness circle with registration and accessible information.', '2026-10-31', '9:00 AM', '3 hours', 'Chennai', false, 14, false, 'Queue assistance, water distribution, registration desk', 'Standard hygiene protocols.', 'Ramp access available.', null, true, 'active'),
  ('22222222-2222-2222-2222-222222222210', 'Miscellaneous', 'Bicycle Repair Together', 'Bring your practical curiosity to a morning of repairing everyday bicycles with neighbours.', '2026-11-01', '10:00 AM', '2 hours', 'Bengaluru', false, 10, false, 'Puncture fixes, brake alignments, chain oiling', 'Basic tool kits provided.', 'Open paved courtyard.', null, true, 'active'),
  ('22222222-2222-2222-2222-222222222211', 'Skill Sharing', 'Weekend Language Exchange', 'Make space for different languages and stories. Practise Hindi, Kannada and English together.', '2026-11-07', '11:00 AM', '1.5 hours', 'Online', true, 18, true, 'Small breakout conversation circles', 'Respectful, unhurried space for mistakes and growth.', 'Online with automated captions.', '/src/assets/learning.jpg', true, 'active')
on conflict (id) do nothing;

-- 4. OFFERS
insert into public.offers (id, offer_type, title, story, help_details, availability, location, is_remote, privacy, status, verified) values
  ('33333333-3333-3333-3333-333333333301', 'Knowledge', 'I can teach Python', 'Happy to learn alongside beginners and explain the basics, one small step at a time.', 'Fundamentals of programming, logic, and simple scripts.', 'Saturday mornings', 'Online', true, 'Public', 'active', true),
  ('33333333-3333-3333-3333-333333333302', 'Skill', 'Smartphone help for older neighbours', 'I can offer a patient hour to practise video calls, maps and everyday phone settings.', 'Calm, patient walk-throughs of WhatsApp, Google Maps and UPI basics.', 'Weekends', 'Bengaluru', false, 'Community', 'active', true),
  ('33333333-3333-3333-3333-333333333303', 'Skill', 'A second pair of eyes for your resume', 'I can help you put your experience into words before your next application.', 'Formatting, clarity, and articulation of practical experience.', 'Evenings', 'Online', true, 'Public', 'active', true),
  ('33333333-3333-3333-3333-333333333304', 'Time', 'Transportation support', 'I have some time on weekends to accompany someone to a local appointment.', 'Safe, patient car ride to neighbourhood medical clinics.', 'Saturday afternoons', 'Pune', false, 'Community', 'active', true),
  ('33333333-3333-3333-3333-333333333305', 'Teaching', 'An hour of maths each Saturday', 'I enjoy making maths less intimidating through simple examples.', 'Class 8–10 geometry and algebra fundamentals.', 'Saturday 4 PM', 'Bengaluru', false, 'Public', 'active', true),
  ('33333333-3333-3333-3333-333333333306', 'Resources', 'Books ready for a new home', 'I have a small collection of English and Hindi books I would like to share.', 'General fiction, science, and history suitable for secondary students.', 'Anytime by pickup', 'Delhi', false, 'Community', 'active', true),
  ('33333333-3333-3333-3333-333333333307', 'Skill', 'Help with everyday documents', 'I can sit with you and work through forms and online applications.', 'Government portal navigation, scholarship forms, proofreading.', 'Sunday mornings', 'Chennai', false, 'Community', 'active', true),
  ('33333333-3333-3333-3333-333333333308', 'Resources', 'A spare laptop to share', 'A working laptop is available for someone’s learning journey.', 'Refurbished ThinkPad with Linux and LibreOffice.', 'Flexible', 'Mumbai', false, 'Community', 'active', true),
  ('33333333-3333-3333-3333-333333333309', 'Physical help', 'I can help in a community kitchen', 'I can offer my time chopping, preparing and cleaning alongside others.', 'Willing hands and kitchen hygiene.', 'Sunday early mornings', 'Bengaluru', false, 'Public', 'active', true),
  ('33333333-3333-3333-3333-333333333310', 'Knowledge', 'Conversation in Kannada', 'I would be glad to practise everyday Kannada with someone new to the city.', 'Practical vocabulary for market, auto, and neighbourhood interactions.', 'Sunday afternoons', 'Online', true, 'Public', 'active', true)
on conflict (id) do nothing;

-- 5. NEEDS
insert into public.needs (id, support_type, title, story, help_details, location, is_remote, privacy, status, verified) values
  ('44444444-4444-4444-4444-444444444401', 'Technology', 'Digital literacy support', 'I would like to feel more confident using online services. A patient person to practise with would help.', 'A patient hour to learn online booking and payment safely.', 'Bengaluru', false, 'Community-visible', 'verified', true),
  ('44444444-4444-4444-4444-444444444402', 'Education', 'Laptop for college studies', 'I am beginning my next semester and need a working laptop for assignments. A refurbished one would be welcome.', 'Any functional laptop capable of document editing and web browsing.', 'Pune', false, 'Community-visible', 'verified', true),
  ('44444444-4444-4444-4444-444444444403', 'Food', 'Community food support', 'Our neighbourhood kitchen is looking for ingredients for the coming weekend’s shared meal.', 'Lentils, rice, oil or fresh vegetables.', 'Bengaluru', false, 'Public', 'verified', true),
  ('44444444-4444-4444-4444-444444444404', 'Mobility', 'Mobility assistance', 'I need a companion for a hospital appointment and help navigating the building.', 'Patience and presence to guide wheelchair access at the clinic.', 'Delhi', false, 'Anonymous', 'verified', true),
  ('44444444-4444-4444-4444-444444444405', 'Education', 'Help with scholarship forms', 'A second pair of eyes would help me finish an application with confidence.', 'Proofreading statement of purpose and checking checklist.', 'Chennai', false, 'Community-visible', 'verified', true),
  ('44444444-4444-4444-4444-444444444406', 'Resources', 'Books for a reading corner', 'Our community reading circle would welcome books in Marathi and English.', 'Children storybooks, popular science, fiction.', 'Mumbai', false, 'Public', 'verified', true),
  ('44444444-4444-4444-4444-444444444407', 'Education', 'Learning spoken English', 'I would appreciate a weekly conversation partner as I prepare for interviews.', '30 minutes weekly conversation practice.', 'Online', true, 'Anonymous', 'verified', true),
  ('44444444-4444-4444-4444-444444444408', 'Mobility', 'Transport for a clinic visit', 'I am looking for accessible transport to a scheduled appointment.', 'Accompanying a senior to an eye checkup.', 'Pune', false, 'Matched-only', 'verified', true),
  ('44444444-4444-4444-4444-444444444409', 'Technology', 'Help setting up a website', 'Our small learning centre needs a simple, accessible website.', 'A static informational page with contact details and timings.', 'Bengaluru', false, 'Public', 'verified', true),
  ('44444444-4444-4444-4444-444444444410', 'Environment', 'Garden tools to share', 'We are caring for a neighbourhood garden and could use shared tools.', 'Spades, trowels, rakes and pruning shears.', 'Bengaluru', false, 'Community-visible', 'verified', true)
on conflict (id) do nothing;

-- 6. CONVERSATIONS
insert into public.conversations (id, title, context_type, context_id) values
  ('55555555-5555-5555-5555-555555555501', 'Saturday Learning Circle', 'seva', '22222222-2222-2222-2222-222222222201'),
  ('55555555-5555-5555-5555-555555555502', 'Community Kitchen', 'seva', '22222222-2222-2222-2222-222222222202'),
  ('55555555-5555-5555-5555-555555555503', 'Digital Literacy Circle', 'seva', '22222222-2222-2222-2222-222222222203')
on conflict (id) do nothing;

-- 7. MESSAGES
insert into public.messages (conversation_id, sender_name, content, is_system, created_at) values
  ('55555555-5555-5555-5555-555555555501', 'ARPAN', 'This is a community conversation. Keep personal details private and meet one another with care.', true, now() - interval '2 hours'),
  ('55555555-5555-5555-5555-555555555501', 'Meera', 'Welcome, everyone. We’ll begin with a small circle and get to know each other. No teaching experience needed.', false, now() - interval '100 minutes'),
  ('55555555-5555-5555-5555-555555555501', 'Arjun', 'Looking forward to being there. Is there anything we should bring?', false, now() - interval '90 minutes'),
  ('55555555-5555-5555-5555-555555555501', 'Meera', 'Just yourself, a water bottle, and a little patience. We’ll have everything else ready.', false, now() - interval '85 minutes')
on conflict do nothing;
