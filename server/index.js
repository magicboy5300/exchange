const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Supabase Init
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
let supabase = null;

if (supabaseUrl && supabaseKey && supabaseUrl !== 'YOUR_SUPABASE_URL') {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log("Supabase client initialized");
} else {
    console.warn("Supabase credentials missing or invalid. Favorites feature will be limited.");
}

// Mock Rates (Should match frontend initially)
const EXCHANGE_RATES = {
    'USD': 1,
    'CNY': 7.25,
    'EUR': 0.92,
    'GBP': 0.79,
    'JPY': 148.50,
    'HKD': 7.82,
    'KRW': 1320.00,
    'SGD': 1.34,
    'AUD': 1.52,
    'CAD': 1.36,
};

// Routes
app.get('/api/rates', (req, res) => {
    res.json(EXCHANGE_RATES);
});

app.get('/api/favorites', async (req, res) => {
    if (!supabase) {
        // Fallback for demo/no-db mode
        return res.json([]);
    }

    const { data, error } = await supabase
        .from('favorites')
        .select('*')
        .order('timestamp', { ascending: false });

    if (error) {
        console.error("Error fetching favorites:", error);
        return res.status(500).json({ error: error.message });
    }
    res.json(data || []);
});

app.post('/api/favorites', async (req, res) => {
    if (!supabase) return res.status(503).json({ error: "Database not configured" });

    // Expecting the record structure from frontend
    // { id, fromCurrency, toCurrency, fromAmount, toAmount, rate, timestamp, isFavorite }
    const record = req.body;

    // Transform or validate if necessary
    // Assuming table columns match keys or we map them.
    // For supabase, we just need to match column names.

    const { data, error } = await supabase
        .from('favorites')
        .upsert(record)
        .select();

    if (error) {
        console.error("Error saving favorite:", error);
        return res.status(500).json({ error: error.message });
    }
    res.json(data[0]);
});

app.delete('/api/favorites/:id', async (req, res) => {
    if (!supabase) return res.status(503).json({ error: "Database not configured" });

    const { id } = req.params;
    const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', id);

    if (error) {
        console.error("Error deleting favorite:", error);
        return res.status(500).json({ error: error.message });
    }
    res.json({ success: true });
});

// Vercel Serverless environment checks
if (process.env.VERCEL) {
    module.exports = app;
} else {
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}
