import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const licensesPath = path.join(__dirname, "licenses.json");

// Load licenses from JSON file
let licensesData;
try {
    licensesData = JSON.parse(fs.readFileSync(licensesPath, "utf-8"));
} catch (error) {
    console.error("Error loading licenses.json:", error.message);
    process.exit(1);
}

const { licenses } = licensesData;

app.post("/api/verify", (req, res) => {
    try {
        const { key, botId } = req.body;

        // Validate request body
        if (!key || !botId) {
            return res.status(400).json({ 
                valid: false, 
                reason: "invalid_request",
                message: "Both 'key' and 'botId' are required" 
            });
        }

        const license = licenses[key];

        // Check if license exists
        if (!license) {
            return res.status(404).json({ 
                valid: false, 
                reason: "not_found",
                message: "License key not found"
            });
        }

        // Check if license is active
        if (!license.active) {
            return res.status(403).json({ 
                valid: false, 
                reason: "disabled",
                message: "License is disabled"
            });
        }

        // Check if license has expired
        const now = new Date();
        const expirationDate = new Date(license.expiresAt);
        if (expirationDate < now) {
            return res.status(403).json({ 
                valid: false, 
                reason: "expired",
                message: "License has expired"
            });
        }

        // Check if bot is authorized
        if (!license.bots.includes(botId)) {
            return res.status(403).json({ 
                valid: false, 
                reason: "unauthorized_bot",
                message: "Bot is not authorized for this license"
            });
        }

        // License is valid
        res.json({ 
            valid: true,
            expiresAt: license.expiresAt
        });

    } catch (error) {
        console.error("Error verifying license:", error);
        res.status(500).json({ 
            valid: false, 
            reason: "server_error",
            message: "Internal server error"
        });
    }
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Start server
const PORT = process.env.PORT || 55555;
app.listen(PORT, () => {
    console.log(`License server running on port ${PORT}`);
    console.log(`Health check available at http://localhost:${PORT}/health`);
});


