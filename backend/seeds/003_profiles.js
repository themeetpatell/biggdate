exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('profiles').del();
  
  // Inserts seed entries
  return knex('profiles').insert([
    {
      user_id: '550e8400-e29b-41d4-a716-446655440001',
      title: 'CTO & Co-Founder',
      company: 'TechFlow AI',
      company_stage: 'series-a',
      industry: 'fintech',
      location: 'San Francisco, CA',
      bio: 'Full-stack developer with 8 years experience building scalable web applications. Passionate about AI and fintech.',
      vision: 'Democratizing AI-powered workflow automation for businesses of all sizes.',
      values: JSON.stringify(['Innovation', 'Transparency', 'Customer Success']),
      skills: JSON.stringify([
        { name: 'React', level: 'expert' },
        { name: 'Node.js', level: 'expert' },
        { name: 'Python', level: 'advanced' },
        { name: 'AWS', level: 'advanced' },
        { name: 'Machine Learning', level: 'intermediate' }
      ]),
      achievements: JSON.stringify([
        { title: 'Raised $15M Series A', description: 'Led successful Series A round', year: 2023, category: 'funding' }
      ]),
      funding: JSON.stringify({ totalRaised: 15000000, lastRound: 'Series A', investors: ['Sequoia'] }),
      team_size: 45,
      looking_for: JSON.stringify({
        roles: ['Business Co-founder', 'Marketing Expert'],
        industries: ['fintech', 'ai-ml'],
        stages: ['series-a', 'series-b'],
        locations: ['San Francisco', 'Remote']
      }),
      availability: 'actively-looking',
      website: 'https://techflow.com',
      linkedin_url: 'https://linkedin.com/in/alexchen'
    },
    {
      user_id: '550e8400-e29b-41d4-a716-446655440002',
      title: 'CEO & Co-Founder',
      company: 'HealthAI Solutions',
      company_stage: 'seed',
      industry: 'healthcare',
      location: 'San Francisco, CA',
      bio: 'Former McKinsey consultant with 6 years in strategy and operations. Led 3 successful product launches.',
      vision: 'Revolutionizing healthcare through AI-powered diagnostic tools.',
      values: JSON.stringify(['Impact', 'Innovation', 'Patient Care']),
      skills: JSON.stringify([
        { name: 'Business Strategy', level: 'expert' },
        { name: 'Operations', level: 'expert' },
        { name: 'Product Management', level: 'advanced' },
        { name: 'Fundraising', level: 'advanced' }
      ]),
      achievements: JSON.stringify([
        { title: 'Led Product Launch', description: 'Successfully launched 3 products', year: 2022, category: 'product' }
      ]),
      funding: JSON.stringify({ totalRaised: 5000000, lastRound: 'Seed', investors: ['Andreessen Horowitz'] }),
      team_size: 12,
      looking_for: JSON.stringify({
        roles: ['Technical Co-founder', 'CTO'],
        industries: ['healthcare', 'ai-ml'],
        stages: ['seed', 'series-a'],
        locations: ['San Francisco', 'Remote']
      }),
      availability: 'actively-looking',
      website: 'https://healthai.com',
      linkedin_url: 'https://linkedin.com/in/sarahmartinez'
    },
    {
      user_id: '550e8400-e29b-41d4-a716-446655440003',
      title: 'Head of Design & Co-Founder',
      company: 'CreativeFlow',
      company_stage: 'pre-seed',
      industry: 'saas',
      location: 'San Francisco, CA',
      bio: 'Award-winning designer with expertise in UX/UI and brand design. Worked at Apple and Google.',
      vision: 'Creating beautiful, intuitive design tools for creative professionals.',
      values: JSON.stringify(['Creativity', 'Quality', 'User Experience']),
      skills: JSON.stringify([
        { name: 'UI/UX Design', level: 'expert' },
        { name: 'Brand Design', level: 'expert' },
        { name: 'User Research', level: 'advanced' },
        { name: 'Prototyping', level: 'advanced' }
      ]),
      achievements: JSON.stringify([
        { title: 'Design Award', description: 'Won international design award', year: 2023, category: 'recognition' }
      ]),
      funding: JSON.stringify({ totalRaised: 1000000, lastRound: 'Pre-seed', investors: ['Y Combinator'] }),
      team_size: 5,
      looking_for: JSON.stringify({
        roles: ['Technical Co-founder', 'Business Co-founder'],
        industries: ['saas', 'design'],
        stages: ['pre-seed', 'seed'],
        locations: ['San Francisco', 'Remote']
      }),
      availability: 'actively-looking',
      website: 'https://creativeflow.com',
      linkedin_url: 'https://linkedin.com/in/davidkim'
    },
    {
      user_id: '550e8400-e29b-41d4-a716-446655440004',
      title: 'VP Product & Co-Founder',
      company: 'DataFlow Analytics',
      company_stage: 'series-b',
      industry: 'saas',
      location: 'New York, NY',
      bio: 'Product manager with 5 years experience in B2B SaaS. Led product strategy for 2 successful startups.',
      vision: 'Making data analytics accessible to every business.',
      values: JSON.stringify(['Data-Driven', 'Accessibility', 'Growth']),
      skills: JSON.stringify([
        { name: 'Product Management', level: 'expert' },
        { name: 'Data Analysis', level: 'advanced' },
        { name: 'User Research', level: 'advanced' },
        { name: 'Business Strategy', level: 'intermediate' }
      ]),
      achievements: JSON.stringify([
        { title: 'Product Growth', description: 'Grew product to 100K users', year: 2023, category: 'growth' }
      ]),
      funding: JSON.stringify({ totalRaised: 25000000, lastRound: 'Series B', investors: ['Sequoia', 'Andreessen Horowitz'] }),
      team_size: 85,
      looking_for: JSON.stringify({
        roles: ['Technical Co-founder', 'CTO'],
        industries: ['saas', 'data'],
        stages: ['series-b', 'series-c'],
        locations: ['New York', 'Remote']
      }),
      availability: 'open-to-opportunities',
      website: 'https://dataflow.com',
      linkedin_url: 'https://linkedin.com/in/emmawilson'
    },
    {
      user_id: '550e8400-e29b-41d4-a716-446655440005',
      title: 'CMO & Co-Founder',
      company: 'GrowthFlow Marketing',
      company_stage: 'seed',
      industry: 'marketing',
      location: 'Austin, TX',
      bio: 'Marketing expert with 7 years in growth marketing and brand building. Helped scale 3 startups to Series A.',
      vision: 'Empowering startups with data-driven marketing strategies.',
      values: JSON.stringify(['Growth', 'Innovation', 'Results']),
      skills: JSON.stringify([
        { name: 'Marketing', level: 'expert' },
        { name: 'Growth Marketing', level: 'expert' },
        { name: 'Brand Building', level: 'advanced' },
        { name: 'Sales', level: 'intermediate' }
      ]),
      achievements: JSON.stringify([
        { title: 'Marketing Scale', description: 'Scaled marketing for 3 startups', year: 2023, category: 'growth' }
      ]),
      funding: JSON.stringify({ totalRaised: 3000000, lastRound: 'Seed', investors: ['First Round'] }),
      team_size: 8,
      looking_for: JSON.stringify({
        roles: ['Technical Co-founder', 'Product Manager'],
        industries: ['marketing', 'saas'],
        stages: ['seed', 'series-a'],
        locations: ['Austin', 'Remote']
      }),
      availability: 'actively-looking',
      website: 'https://growthflow.com',
      linkedin_url: 'https://linkedin.com/in/michaelrodriguez'
    }
  ]);
};
