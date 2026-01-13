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
    'TRY': 30.50, // 土耳其里拉
    'CHF': 0.88,  // 瑞士法郎
    'INR': 83.00, // 印度卢比
    'RUB': 91.50, // 俄罗斯卢布
    'NZD': 1.63,  // 新西兰元
    'THB': 35.80, // 泰铢
    'VND': 24600, // 越南盾
    'MYR': 4.78,  // 马来西亚林吉特
};

// Routes
// Helper to fetch rates
async function getRates() {
    // 1. Try to get from Supabase Cache
    if (supabase) {
        try {
            const { data, error } = await supabase
                .from('exchange_rates')
                .select('*')
                .order('updated_at', { ascending: false })
                .limit(1);

            if (data && data.length > 0) {
                const lastUpdate = new Date(data[0].updated_at);
                const now = new Date();
                const diffHours = (now - lastUpdate) / (1000 * 60 * 60);

                // If cache is fresh (less than 24 hours old)
                if (diffHours < 24) {
                    console.log("Serving rates from Supabase cache");
                    return data[0].rates;
                }
            }
        } catch (err) {
            console.error("Cache check failed:", err);
        }
    }

    // 2. Fetch from External API
    try {
        console.log("Fetching fresh rates from API...");
        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await response.json();

        if (data && data.rates) {
            // Update Cache if Supabase is available
            if (supabase) {
                // Insert new record (or we could update existing, but insert log is safer for now)
                const { error } = await supabase
                    .from('exchange_rates')
                    .insert({
                        base_currency: 'USD',
                        rates: data.rates,
                        updated_at: new Date().toISOString()
                    });

                if (error) console.error("Failed to update cache:", error);
                else console.log("Rates cached to Supabase");
            }
            return data.rates;
        }
    } catch (err) {
        console.error("External API fetch failed:", err);
    }

    // 3. Fallback to Mock Data if all else fails
    console.warn("Using fallback mock rates");
    return EXCHANGE_RATES;
}

app.get('/api/rates', async (req, res) => {
    const rates = await getRates();
    res.json(rates);
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
