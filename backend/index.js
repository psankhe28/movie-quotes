const express = require('express');
const axios = require('axios');
const fs = require('fs');
const csvParser = require('csv-parser');
const cors = require('cors')

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors())

const quotes = [];

// Read CSV file and populate quotes array
fs.createReadStream('quote.csv')
  .pipe(csvParser())
  .on('data', (row) => {
    quotes.push(row);
  })
  .on('end', () => {
    console.log('CSV file successfully processed.');
  });

// Endpoint to get all years with optional query parameter for search
app.get('/years', (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  const results = quotes.filter((quote) => {
    return quote['Movie Line'].toLowerCase().includes(query.toLowerCase());
  });

  const uniqueYears = new Set();
  results.forEach(quote => uniqueYears.add(quote.Year));

  // Convert the Set to an array if needed
  const uniqueYearsArray = [...uniqueYears];
  res.json(uniqueYearsArray)
});

// Endpoint to get all categories with optional query parameter for search
app.get('/categories', (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  const results = quotes.filter((quote) => {
    return quote['Movie Line'].toLowerCase().includes(query.toLowerCase());
  });

  const uniqueCategories = new Set();
  results.forEach(quote => uniqueCategories.add(quote.Category));

  // Convert the Set to an array if needed
  const uniqueCategoriesArray = [...uniqueCategories];
  res.json(uniqueCategoriesArray)
});

app.get('/search', (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  const results = quotes.filter((quote) => {
    return quote['Movie Line'].toLowerCase().includes(query.toLowerCase());
  });

  res.json(results);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
