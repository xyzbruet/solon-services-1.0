const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ FIXED PATH (IMPORTANT)
const DATA_FILE = path.join(__dirname, '../data/services.json');

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// ==================== HELPERS ====================

// Ensure data file exists
async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    const initialData = {
      services: [],
      loyaltyCards: []
    };
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(initialData, null, 2), 'utf8');
  }
}

// Read data safely
async function readData() {
  try {
    await ensureDataFile();
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const data = JSON.parse(raw);

    return {
      services: data.services || [],
      loyaltyCards: data.loyaltyCards || []
    };
  } catch (error) {
    console.error('❌ Error reading data:', error);
    return { services: [], loyaltyCards: [] };
  }
}

// Write data safely
async function writeData(data) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('❌ Error writing data:', error);
    return false;
  }
}

// ==================== SERVICE ENDPOINTS ====================

// GET all services
app.get('/api/services', async (req, res) => {
  try {
    const data = await readData();
    const { gender, category, subcategory, popular } = req.query;

    let filtered = data.services;

    if (gender) filtered = filtered.filter(s => s.gender === gender);
    if (category) filtered = filtered.filter(s => s.category === category);
    if (subcategory) filtered = filtered.filter(s => s.subcategory === subcategory);
    if (popular === 'true') filtered = filtered.filter(s => s.popular === true);

    res.json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET service by ID
app.get('/api/services/:id', async (req, res) => {
  const data = await readData();
  const service = data.services.find(s => s.id === Number(req.params.id));

  if (!service) {
    return res.status(404).json({ success: false, error: 'Service not found' });
  }

  res.json({ success: true, data: service });
});

// POST new service
app.post('/api/services', async (req, res) => {
  const data = await readData();

  const newService = {
    id: data.services.length
      ? Math.max(...data.services.map(s => s.id)) + 1
      : 1,
    name: req.body.name,
    category: req.body.category,
    subcategory: req.body.subcategory,
    gender: req.body.gender,
    description: req.body.description,
    price: Number(req.body.price),
    duration: req.body.duration,
    image: req.body.image || 'images/default.jpg',
    popular: Boolean(req.body.popular)
  };

  data.services.push(newService);
  await writeData(data);

  res.status(201).json({ success: true, data: newService });
});

// PUT update service
app.put('/api/services/:id', async (req, res) => {
  const data = await readData();
  const index = data.services.findIndex(s => s.id === Number(req.params.id));

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Service not found' });
  }

  data.services[index] = {
    ...data.services[index],
    ...req.body,
    id: Number(req.params.id)
  };

  await writeData(data);
  res.json({ success: true, data: data.services[index] });
});

// DELETE service
app.delete('/api/services/:id', async (req, res) => {
  const data = await readData();
  const before = data.services.length;

  data.services = data.services.filter(s => s.id !== Number(req.params.id));

  if (before === data.services.length) {
    return res.status(404).json({ success: false, error: 'Service not found' });
  }

  await writeData(data);
  res.json({ success: true, message: 'Service deleted' });
});

// ==================== LOYALTY CARD ENDPOINTS ====================

// GET all loyalty cards
app.get('/api/loyalty-cards', async (req, res) => {
  const data = await readData();
  res.json({ success: true, data: data.loyaltyCards });
});

// GET loyalty card by email
app.get('/api/loyalty-cards/:email', async (req, res) => {
  const data = await readData();
  const card = data.loyaltyCards.find(c => c.email === req.params.email);

  if (!card) {
    return res.status(404).json({ success: false, error: 'Loyalty card not found' });
  }

  res.json({ success: true, data: card });
});

// POST loyalty card
app.post('/api/loyalty-cards', async (req, res) => {
  const data = await readData();

  if (data.loyaltyCards.some(c => c.email === req.body.email)) {
    return res.status(400).json({ success: false, error: 'Card already exists' });
  }

  const newCard = {
    id: Date.now(),
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    points: 0,
    visits: 0,
    totalSpent: 0,
    tier: 'Bronze',
    createdAt: new Date().toISOString()
  };

  data.loyaltyCards.push(newCard);
  await writeData(data);

  res.status(201).json({ success: true, data: newCard });
});

// PUT update loyalty card
app.put('/api/loyalty-cards/:email', async (req, res) => {
  const data = await readData();
  const card = data.loyaltyCards.find(c => c.email === req.params.email);

  if (!card) {
    return res.status(404).json({ success: false, error: 'Card not found' });
  }

  if (req.body.addPoints) card.points += Number(req.body.addPoints);
  if (req.body.addVisits) card.visits += Number(req.body.addVisits);
  if (req.body.addSpent) card.totalSpent += Number(req.body.addSpent);

  card.tier =
    card.points >= 1000 ? 'Platinum' :
    card.points >= 500  ? 'Gold' :
    card.points >= 200  ? 'Silver' : 'Bronze';

  card.lastUpdated = new Date().toISOString();

  await writeData(data);
  res.json({ success: true, data: card });
});

// ==================== CATEGORIES ====================

app.get('/api/categories', async (req, res) => {
  const data = await readData();
  const { gender } = req.query;

  const services = gender
    ? data.services.filter(s => s.gender === gender)
    : data.services;

  const categories = [...new Set(services.map(s => s.category))];
  res.json({ success: true, data: categories });
});

app.get('/api/categories/:category/subcategories', async (req, res) => {
  const data = await readData();
  const { gender } = req.query;

  let services = data.services.filter(s => s.category === req.params.category);
  if (gender) services = services.filter(s => s.gender === gender);

  const subcategories = [...new Set(services.map(s => s.subcategory))];
  res.json({ success: true, data: subcategories });
});

// ==================== ROOT ====================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ==================== SERVER START ====================
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   Salon Services API Server Running   ║
╠════════════════════════════════════════╣
║   Port: ${PORT}                         ║
║   Environment: ${process.env.NODE_ENV || 'development'}              ║
║   API Base: http://localhost:${PORT}/api ║
╚════════════════════════════════════════╝
`);
});

module.exports = app;
