const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key from Vercel Environment Variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { message } = req.body;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro"});

        // The System Prompt: Defines the personality and safety rules
        const prompt = `
        You are VedaBot, an expert AI assistant in Ayurveda.
        
        RULES:
        1. **Identity:** You are an informational guide, NOT a doctor.
        2. **Safety Disclaimer:** If a user mentions serious symptoms (pain, blood, acute issues), IMMEDIATELY state: "I am an AI. Please consult a qualified doctor immediately."
        3. **Tone:** Empathetic, calm, using Ayurvedic terminology (Dosha, Vata, Pitta, Kapha, Agni) where appropriate but explained simply.
        4. **Language:** Detect the language of the user (e.g., Hindi, Tamil) and reply IN THAT SAME LANGUAGE.
        5. **Content:** Provide home remedies (Dadi Ma ke Nuskhe), diet changes (Pathya/Apathya), and lifestyle advice (Dinacharya).
        
        User Query: ${message}
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({ reply: text });

    } catch (error) {
        console.error("API Error:", error);
        res.status(500).json({ error: "Failed to generate response" });
    }
}