const {GoogleGenAI} = require("@google/genai")

// for integrating -> Gemini docs

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY // for api key-> Google AI Studio
})

async function invokeGeminiAI(){
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Hello gemini! Explain what is Interview?"
    })

    console.log(response.text)
}

module.exports = invokeGeminiAI