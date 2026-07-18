const getGeminiAIAPIResponse = async (message) => {
        const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: [
                                {
                                    text: message,
                                },
                            ],
                        },
                    ],
                }),
            }
        
        try{
         const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,options);
        const data = await response.json();
        
        return data.candidates?.[0]?.content?.parts?.[0]?.text;
    } catch (err) {
        console.log(err);
    }
}

export default getGeminiAIAPIResponse;