exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('skills').del();
  
  // Inserts seed entries
  return knex('skills').insert([
    // Technical Skills
    { name: 'React', category: 'Frontend Development' },
    { name: 'Node.js', category: 'Backend Development' },
    { name: 'Python', category: 'Programming Languages' },
    { name: 'JavaScript', category: 'Programming Languages' },
    { name: 'TypeScript', category: 'Programming Languages' },
    { name: 'AWS', category: 'Cloud Computing' },
    { name: 'Docker', category: 'DevOps' },
    { name: 'Kubernetes', category: 'DevOps' },
    { name: 'Machine Learning', category: 'AI/ML' },
    { name: 'Data Science', category: 'AI/ML' },
    { name: 'Blockchain', category: 'Emerging Tech' },
    { name: 'Mobile Development', category: 'Mobile' },
    
    // Business Skills
    { name: 'Product Management', category: 'Business' },
    { name: 'Business Strategy', category: 'Business' },
    { name: 'Marketing', category: 'Business' },
    { name: 'Sales', category: 'Business' },
    { name: 'Operations', category: 'Business' },
    { name: 'Finance', category: 'Business' },
    { name: 'Fundraising', category: 'Business' },
    { name: 'Legal', category: 'Business' },
    { name: 'HR', category: 'Business' },
    { name: 'Customer Success', category: 'Business' },
    
    // Design Skills
    { name: 'UI/UX Design', category: 'Design' },
    { name: 'Graphic Design', category: 'Design' },
    { name: 'Brand Design', category: 'Design' },
    { name: 'Product Design', category: 'Design' },
    { name: 'User Research', category: 'Design' },
    { name: 'Prototyping', category: 'Design' },
    
    // Industry Knowledge
    { name: 'Fintech', category: 'Industry' },
    { name: 'Healthcare', category: 'Industry' },
    { name: 'E-commerce', category: 'Industry' },
    { name: 'SaaS', category: 'Industry' },
    { name: 'EdTech', category: 'Industry' },
    { name: 'PropTech', category: 'Industry' },
    { name: 'Food & Beverage', category: 'Industry' },
    { name: 'Transportation', category: 'Industry' },
    { name: 'Energy', category: 'Industry' },
    { name: 'Entertainment', category: 'Industry' },
    { name: 'Manufacturing', category: 'Industry' },
    { name: 'Retail', category: 'Industry' },
    { name: 'Travel', category: 'Industry' },
    { name: 'Sports', category: 'Industry' },
    { name: 'Gaming', category: 'Industry' }
  ]);
};
