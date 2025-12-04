import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Lead from './models/Lead.js';
import Customer from './models/Customer.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Clear existing data
    await User.deleteMany({});
    await Lead.deleteMany({});
    await Customer.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@crm.com',
      password: 'admin123',
      role: 'admin',
      isActive: true,
    });
    console.log('👤 Admin user created');
    console.log('   Email: admin@crm.com');
    console.log('   Password: admin123');

    // Create sample agent user
    const user = await User.create({
      name: 'Demo Agent',
      email: 'demo@crm.com',
      password: 'password123',
      role: 'agent',
      isActive: true,
    });
    console.log('👤 Sample agent created');
    console.log('   Email: demo@crm.com');
    console.log('   Password: password123');

    // Create Siddhi user
    const siddhiUser = await User.create({
      name: 'Siddhi',
      email: 'siddhivinayaka300@gmail.com',
      password: 'siddhi@123',
      role: 'agent',
      isActive: true,
    });
    console.log('👤 Siddhi user created');
    console.log('   Email: siddhivinayaka300@gmail.com');
    console.log('   Password: siddhi@123');

    // Helper function to generate random leads
    const generateRandomLeads = (userId, count, namePrefix = '') => {
      const statuses = ['New', 'Contacted', 'In Progress', 'Converted', 'Lost'];
      const sources = ['Website', 'Referral', 'Social Media', 'Cold Call', 'Trade Show', 'LinkedIn', 'Email Campaign'];
      const generatedLeads = [];
      
      for (let i = 1; i <= count; i++) {
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const source = sources[Math.floor(Math.random() * sources.length)];
        generatedLeads.push({
          name: `${namePrefix}Lead Contact ${i}`,
          email: `${namePrefix.toLowerCase()}lead${i}@example.com`,
          phone: `+1-555-${String(i).padStart(4, '0')}`,
          source: source,
          status: status,
          notes: `Auto-generated lead ${i} for testing pagination`,
          leadNotes: [
            { text: `Initial contact via ${source}`, date: new Date(Date.now() - Math.random() * 30 * 86400000) },
          ],
          user: userId,
        });
      }
      return generatedLeads;
    };

    // Helper function to generate random customers
    const generateRandomCustomers = (userId, count, namePrefix = '') => {
      const generatedCustomers = [];
      
      for (let i = 1; i <= count; i++) {
        generatedCustomers.push({
          name: `${namePrefix}Company ${i} Inc`,
          email: `${namePrefix.toLowerCase()}company${i}@example.com`,
          phone: `+1-555-${String(2000 + i).padStart(4, '0')}`,
          company: `${namePrefix}Company ${i} Inc`,
          address: `${i} Business Park, Suite ${i}00, City ${i}, State ${String(i).padStart(5, '0')}`,
          notes: `Auto-generated customer ${i} for testing pagination`,
          user: userId,
        });
      }
      return generatedCustomers;
    };

    // Create sample leads for Demo Agent
    const leads = await Lead.insertMany([
      {
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1-555-0101',
        source: 'Website',
        status: 'New',
        notes: 'Interested in premium package',
        leadNotes: [
          { text: 'Initial contact made via website form', date: new Date() },
        ],
        user: user._id,
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        phone: '+1-555-0102',
        source: 'Referral',
        status: 'Contacted',
        notes: 'Referred by existing customer',
        leadNotes: [
          { text: 'Called and left voicemail', date: new Date(Date.now() - 86400000) },
          { text: 'Follow-up scheduled for tomorrow', date: new Date() },
        ],
        user: user._id,
      },
      {
        name: 'Michael Brown',
        email: 'mbrown@example.com',
        phone: '+1-555-0103',
        source: 'Social Media',
        status: 'In Progress',
        notes: 'Negotiating contract terms',
        leadNotes: [
          { text: 'Sent proposal via email', date: new Date(Date.now() - 172800000) },
          { text: 'Discussed pricing options', date: new Date(Date.now() - 86400000) },
        ],
        user: user._id,
      },
      {
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        phone: '+1-555-0104',
        source: 'Website',
        status: 'Converted',
        notes: 'Successfully closed deal',
        leadNotes: [
          { text: 'Demo completed successfully', date: new Date(Date.now() - 259200000) },
          { text: 'Contract signed', date: new Date(Date.now() - 86400000) },
        ],
        user: user._id,
      },
      {
        name: 'David Wilson',
        email: 'dwilson@example.com',
        phone: '+1-555-0105',
        source: 'Cold Call',
        status: 'Lost',
        notes: 'Not interested at this time',
        leadNotes: [
          { text: 'Initial contact - not a good fit', date: new Date(Date.now() - 432000000) },
        ],
        user: user._id,
      },
      {
        name: 'Lisa Anderson',
        email: 'lisa.a@example.com',
        phone: '+1-555-0106',
        source: 'Website',
        status: 'New',
        notes: 'Requesting product demo',
        leadNotes: [],
        user: user._id,
      },
      {
        name: 'Robert Taylor',
        email: 'rtaylor@example.com',
        phone: '+1-555-0107',
        source: 'Trade Show',
        status: 'Contacted',
        notes: 'Met at industry conference',
        leadNotes: [
          { text: 'Met at booth #24', date: new Date(Date.now() - 604800000) },
          { text: 'Sent follow-up email', date: new Date(Date.now() - 172800000) },
        ],
        user: user._id,
      },
      ...generateRandomLeads(user._id, 30, 'Demo'),
    ]);
    console.log(`📋 Created ${leads.length} sample leads for Demo Agent`);

    // Create leads for Siddhi
    const siddhiLeads = await Lead.insertMany([
      {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@techcorp.com',
        phone: '+91-98765-43210',
        source: 'LinkedIn',
        status: 'New',
        notes: 'Looking for CRM solution for 50+ team',
        leadNotes: [
          { text: 'Connected on LinkedIn', date: new Date() },
        ],
        user: siddhiUser._id,
      },
      {
        name: 'Priya Patel',
        email: 'priya.p@startupindia.com',
        phone: '+91-87654-32109',
        source: 'Referral',
        status: 'Contacted',
        notes: 'Referred by existing customer',
        leadNotes: [
          { text: 'Initial call completed', date: new Date(Date.now() - 172800000) },
          { text: 'Sent pricing details', date: new Date(Date.now() - 86400000) },
        ],
        user: siddhiUser._id,
      },
      {
        name: 'Amit Kumar',
        email: 'amit.k@digitalmart.in',
        phone: '+91-76543-21098',
        source: 'Website',
        status: 'In Progress',
        notes: 'E-commerce business owner, needs integration',
        leadNotes: [
          { text: 'Demo scheduled', date: new Date(Date.now() - 259200000) },
          { text: 'Demo completed - very interested', date: new Date(Date.now() - 86400000) },
        ],
        user: siddhiUser._id,
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha.reddy@consultify.com',
        phone: '+91-65432-10987',
        source: 'Cold Call',
        status: 'Converted',
        notes: 'Consulting firm - Signed annual contract',
        leadNotes: [
          { text: 'First contact', date: new Date(Date.now() - 432000000) },
          { text: 'Proposal sent', date: new Date(Date.now() - 259200000) },
          { text: 'Contract signed!', date: new Date(Date.now() - 86400000) },
        ],
        user: siddhiUser._id,
      },
      {
        name: 'Vikram Singh',
        email: 'vikram.s@realestate.co.in',
        phone: '+91-54321-09876',
        source: 'Trade Show',
        status: 'Lost',
        notes: 'Chose competitor - price concern',
        leadNotes: [
          { text: 'Met at PropTech Expo', date: new Date(Date.now() - 604800000) },
          { text: 'Follow-up call - went with competitor', date: new Date(Date.now() - 172800000) },
        ],
        user: siddhiUser._id,
      },
      {
        name: 'Anjali Verma',
        email: 'anjali.v@fashionhub.in',
        phone: '+91-43210-98765',
        source: 'Social Media',
        status: 'New',
        notes: 'Fashion retail chain - 10 stores',
        leadNotes: [],
        user: siddhiUser._id,
      },
      ...generateRandomLeads(siddhiUser._id, 25, 'Siddhi'),
    ]);
    console.log(`📋 Created ${siddhiLeads.length} sample leads for Siddhi`);

    // Create some leads for admin user too
    const adminLeads = await Lead.insertMany(generateRandomLeads(admin._id, 15, 'Admin'));
    console.log(`📋 Created ${adminLeads.length} sample leads for Admin`);

    // Create sample customers
    const customers = await Customer.insertMany([
      {
        name: 'Acme Corporation',
        email: 'contact@acme.com',
        phone: '+1-555-1001',
        company: 'Acme Corporation',
        address: '123 Business St, Suite 100, New York, NY 10001',
        notes: 'Enterprise client - Premium plan',
        user: user._id,
      },
      {
        name: 'Tech Solutions Inc',
        email: 'info@techsolutions.com',
        phone: '+1-555-1002',
        company: 'Tech Solutions Inc',
        address: '456 Tech Ave, San Francisco, CA 94102',
        notes: 'Mid-size business - Standard plan',
        user: user._id,
      },
      {
        name: 'Global Enterprises',
        email: 'hello@globalent.com',
        phone: '+1-555-1003',
        company: 'Global Enterprises',
        address: '789 Commerce Blvd, Chicago, IL 60601',
        notes: 'International client - Custom plan',
        user: user._id,
      },
      {
        name: 'Startup Hub',
        email: 'contact@startuphub.com',
        phone: '+1-555-1004',
        company: 'Startup Hub',
        address: '321 Innovation Dr, Austin, TX 78701',
        notes: 'New startup - Basic plan',
        user: user._id,
      },
      {
        name: 'Retail Pro',
        email: 'support@retailpro.com',
        phone: '+1-555-1005',
        company: 'Retail Pro',
        address: '654 Market St, Boston, MA 02101',
        notes: 'Retail industry - Standard plan with add-ons',
        user: user._id,
      },
      ...generateRandomCustomers(user._id, 20, 'Demo'),
    ]);
    console.log(`👥 Created ${customers.length} sample customers for Demo Agent`);

    // Create customers for Siddhi
    const siddhiCustomers = await Customer.insertMany([
      {
        name: 'TechVision Pvt Ltd',
        email: 'contact@techvision.in',
        phone: '+91-11-4567-8901',
        company: 'TechVision Pvt Ltd',
        address: 'Cyber City, Gurgaon, Haryana 122002',
        notes: 'IT consulting firm - Enterprise plan',
        user: siddhiUser._id,
      },
      {
        name: 'Green Earth Solutions',
        email: 'info@greenearth.co.in',
        phone: '+91-22-3456-7890',
        company: 'Green Earth Solutions',
        address: 'Bandra West, Mumbai, Maharashtra 400050',
        notes: 'Sustainability consulting - Standard plan',
        user: siddhiUser._id,
      },
      {
        name: 'Smart Education Hub',
        email: 'hello@smartedu.in',
        phone: '+91-80-2345-6789',
        company: 'Smart Education Hub',
        address: 'Whitefield, Bangalore, Karnataka 560066',
        notes: 'EdTech platform - Custom integration',
        user: siddhiUser._id,
      },
      {
        name: 'HealthPlus Clinics',
        email: 'care@healthplus.in',
        phone: '+91-44-1234-5678',
        company: 'HealthPlus Clinics',
        address: 'Anna Nagar, Chennai, Tamil Nadu 600040',
        notes: 'Healthcare chain - 15 clinics',
        user: siddhiUser._id,
      },
      ...generateRandomCustomers(siddhiUser._id, 18, 'Siddhi'),
    ]);
    console.log(`👥 Created ${siddhiCustomers.length} sample customers for Siddhi`);

    // Create customers for admin user too
    const adminCustomers = await Customer.insertMany(generateRandomCustomers(admin._id, 12, 'Admin'));
    console.log(`👥 Created ${adminCustomers.length} sample customers for Admin`);

    console.log('\n✨ Database seeded successfully!');
    console.log('\n🔐 Login credentials:');
    console.log('   Admin - Email: admin@crm.com, Password: admin123');
    console.log('   Agent - Email: demo@crm.com, Password: password123');
    console.log('   Agent - Email: siddhivinayaka300@gmail.com, Password: siddhi@123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
