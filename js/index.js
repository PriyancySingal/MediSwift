const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Fake data: stores & medicines
const stores = [
  {
    id: 1,
    name: "HealthPlus Pharmacy",
    address: "Delhi, Connaught Place",
    rating: 4.5,
    medicines: ["telam 40", "crocin", "paracetamol"]
  },
  {
    id: 2,
    name: "MediCare Store",
    address: "Delhi, Karol Bagh",
    rating: 4.0,
    medicines: ["telam 40", "amoxicillin", "dolo 650"]
  },
  {
    id: 3,
    name: "CityMed Pharmacy",
    address: "Delhi, Rohini",
    rating: 4.2,
    medicines: ["crocin", "paracetamol", "ibuprofen"]
  }
];

// Search API: query ?medicine=telam 40
app.get('/search', (req, res) => {
  const med = req.query.medicine?.toLowerCase() || '';
  if (!med) {
    return res.status(400).json({ error: 'medicine query parameter required' });
  }

  // Find stores which have the medicine
  const result = stores.filter(store => 
    store.medicines.some(m => m.toLowerCase().includes(med))
  );

  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
