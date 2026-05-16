const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  // Create a demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@gigflow.com' },
    update: {},
    create: {
      full_name: 'Demo Recruiter',
      email: 'demo@gigflow.com',
      password: hashedPassword,
      role: 'recruiter',
    },
  });

  console.log({ user });

  // Create some leads
  const leadsData = [
    {
      full_name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
      company_name: 'Tech Corp',
      job_role: 'Software Engineer',
      source: 'LinkedIn',
      status: 'New',
      assigned_user_id: user.id,
    },
    {
      full_name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '0987654321',
      company_name: 'Innovate Ltd',
      job_role: 'Product Manager',
      source: 'Referral',
      status: 'Qualified',
      assigned_user_id: user.id,
    },
    {
      full_name: 'Mike Ross',
      email: 'mike@example.com',
      phone: '5551234567',
      company_name: 'Pearson Specter',
      job_role: 'Associate Lawyer',
      source: 'Cold Outreach',
      status: 'Contacted',
      assigned_user_id: user.id,
    },
  ];

  for (const leadData of leadsData) {
    const lead = await prisma.lead.upsert({
      where: { email: leadData.email },
      update: {},
      create: leadData,
    });
    console.log(`Created lead: ${lead.full_name}`);

    // Add some activities
    await prisma.activity.create({
      data: {
        lead_id: lead.id,
        activity_type: 'Call',
        note: 'Initial call to discuss the role.',
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
