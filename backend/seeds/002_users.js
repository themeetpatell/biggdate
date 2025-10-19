const bcrypt = require('bcryptjs');

exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del();
  
  // Hash passwords
  const hashedPassword = await bcrypt.hash('password123', 12);
  
  // Inserts seed entries
  return knex('users').insert([
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      email: 'alex.chen@example.com',
      password_hash: hashedPassword,
      first_name: 'Alex',
      last_name: 'Chen',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      bio: 'Full-stack developer with 8 years experience building scalable web applications. Passionate about AI and fintech.',
      location: 'San Francisco, CA',
      phone: '+1-555-0123',
      email_verified: true,
      phone_verified: true,
      preferences: JSON.stringify({
        notifications: true,
        privacy: 'public',
        language: 'en'
      })
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440002',
      email: 'sarah.martinez@example.com',
      password_hash: hashedPassword,
      first_name: 'Sarah',
      last_name: 'Martinez',
      avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
      bio: 'Former McKinsey consultant with 6 years in strategy and operations. Led 3 successful product launches.',
      location: 'San Francisco, CA',
      phone: '+1-555-0124',
      email_verified: true,
      phone_verified: true,
      preferences: JSON.stringify({
        notifications: true,
        privacy: 'public',
        language: 'en'
      })
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440003',
      email: 'david.kim@example.com',
      password_hash: hashedPassword,
      first_name: 'David',
      last_name: 'Kim',
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
      bio: 'Award-winning designer with expertise in UX/UI and brand design. Worked at Apple and Google.',
      location: 'San Francisco, CA',
      phone: '+1-555-0125',
      email_verified: true,
      phone_verified: true,
      preferences: JSON.stringify({
        notifications: true,
        privacy: 'public',
        language: 'en'
      })
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440004',
      email: 'emma.wilson@example.com',
      password_hash: hashedPassword,
      first_name: 'Emma',
      last_name: 'Wilson',
      avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      bio: 'Product manager with 5 years experience in B2B SaaS. Led product strategy for 2 successful startups.',
      location: 'New York, NY',
      phone: '+1-555-0126',
      email_verified: true,
      phone_verified: true,
      preferences: JSON.stringify({
        notifications: true,
        privacy: 'public',
        language: 'en'
      })
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440005',
      email: 'michael.rodriguez@example.com',
      password_hash: hashedPassword,
      first_name: 'Michael',
      last_name: 'Rodriguez',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
      bio: 'Marketing expert with 7 years in growth marketing and brand building. Helped scale 3 startups to Series A.',
      location: 'Austin, TX',
      phone: '+1-555-0127',
      email_verified: true,
      phone_verified: true,
      preferences: JSON.stringify({
        notifications: true,
        privacy: 'public',
        language: 'en'
      })
    }
  ]);
};
