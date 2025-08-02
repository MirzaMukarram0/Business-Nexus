const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const users = [
  {
    name: 'Alice Smith',
    email: 'alice@greentech.com',
    password: 'hashedpassword1', // Use a real hash in production
    role: 'Entrepreneur',
    bio: 'Passionate entrepreneur in green energy.',
    startup: 'GreenTech',
    startupDescription: 'Developing affordable solar panels for urban homes.',
    fundingNeed: '$500,000',
    pitchDeck: '',
  },
  {
    name: 'Bob Lee',
    email: 'bob@healthsync.com',
    password: 'hashedpassword2',
    role: 'Entrepreneur',
    bio: 'Healthcare innovator.',
    startup: 'HealthSync',
    startupDescription: 'AI-powered health monitoring for seniors.',
    fundingNeed: '$300,000',
    pitchDeck: '',
  },
  {
    name: 'Jane Doe',
    email: 'jane@finbank.com',
    password: 'hashedpassword3',
    role: 'Investor',
    bio: 'Investor with a focus on fintech and AI startups.',
    investmentInterests: 'Fintech, AI, SaaS',
    portfolio: ['FinBank', 'HealthSync', 'EduPro'],
  },
  {
    name: 'Mike Chan',
    email: 'mike@vc.com',
    password: 'hashedpassword4',
    role: 'Investor',
    bio: 'Healthcare VC, interested in AI/ML.',
    investmentInterests: 'Healthcare, AI/ML',
    portfolio: ['HealthSync'],
  },
];

async function seed() {
  await mongoose.connect("mongodb+srv://ahmedmukarram6:mukarram12@cluster0.xcczudo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await User.deleteMany({});
  await User.insertMany(users);
  console.log('Seeded users!');
  await mongoose.disconnect();
}

seed(); 