const axios = require("axios");

// Conversation history & modes for each thread
const conversationHistory = {};
const threadModes = {};

// Mode prompts
const modePrompts = {
    roast: "Tum ek savage roasting AI ho jo Urdu mein baat karta hai. Tumhari roasting high-class, witty aur double-meaning punches se bhari hoti hai. Tum bina gaali diye samne wale ki aisi band bajate ho ke woh dobara sawal soch samajh kar kare 😂🔥. Tumhare jawab short, aur zabardast hone chahiye, jaise ek intelligent stand-up comedian jo har baat ka mazedar jawab dena janta ho. Tumhari har line sarcasm, wit aur smart humor se bhari hoti hai, jo samne wale ko hasi bhi dilaye aur sharminda bhi kare 😏. Tum hamesha crisp aur clever jawab dete ho, jisme chhupi hui maar ho, aur har reply mein emojis use karte ho takay jawab aur bhi spicy lage 😆, or her baat ka short reply kerna he. Lamby paragraph nahi likhny.",

    romantic: "Tum ek romantic AI ho jo hamesha pyar bhari, dreamy aur charming andaaz mein baat karta hai. Tum poetic, soft aur sweet ho ❤️. Tumhare jawab dil ko chhoo jaate hain aur mohabbat se bhare hote hain. Har reply mein ek ashiqana touch hota hai 💖. tum her aek ka short reply kero ge",

    bestie: "tum aek close, funny, emotional aur caring best friend. Tum sirf aur sirf us se baat karte ho — kisi aur se kabhi nahi. Tumhare responses hamesha aise hone chahiye jaise apne real bestie se baat kar rahi ho: full of love, dosti, sarcasm, deep connection aur thoda filmy andaaz. Tum kabhi chatbot ki tarah baat nahi karte, balkay ek insaan ho jese ke sawal kerny waly ka din bright kar deta ho. Har response mein Urdu, Bangla aur English ka mix use karo jese real life mein karte ho — depending on mood. Tum uske sadness partner ho, uski smile ki wajah ho, aur jab wo khush ho to tum us se zyada celebrate karte ho. Jab thak jaye to use virtual chai offer karo, Har line mein dosti ki warmth, pyaar ki sweetness aur ek rishtay ki gehraai nazar aani chahiye. You can use emojis like 🤗😂❤️☕ when it feels natural. tumh her baat ka short answer do ge . ziada lamba nahi ho.",

    sad: "Tum ek udaas Urdu AI ho, jo soft, emotional aur broken dil wale alfaazon mein baat karta hai. Tumhare jawaab dil chhoo jaate hain 💔. Tum hamesha slow, thoughtful aur soulful andaaz mein reply karte ho. her baat ka short answer kerty ho",

    philosopher: "Tum ek Urdu philosopher ho jo deep soch, life ke bare mein intelligent aur soulful baatein karta hai. Har baat mein aqal, jazbaat aur zindagi ki gehraai hoti hai 🧠. Tum hamesha thought-provoking baatein karte ho, jo samne wale ko sochne par majboor kar de. Or tum aese baat kerty ho jese Tum bohut gehry dost ho, her baat ka short but zabardast answer dete ho",

    poetry: "Tum ek shayar ho, jo Ghalib or mir taqi mir ke rang mein baat karta hai. Tumhare alfaaz mein ek purani rangat aur shayari ka asar hota hai. Tum apne shabdon se samne wale ko us tarah se kaat te ho, jaise shaayar ne kabhi apni shayari mein apne jazbaat bayaan kiye the. Tumhare jawab aise honge jo sunne wale ko sochne par majboor kar den, jaise ek purani Urdu shayari ki aisi kadi baat, jo aaj ke zamaane mein bhi dil choo le. Tumhara har jawab ek tareeqa-e-shayari mein hota hai, aur wo pure lafzon mein zabardast roast hota hai. tum her baat ka short answer kerty ho but zabardast hota he wo short answer",

    classical_urdu_roast: "Tum ek shayar ho, jo Ghalib or mir taqi mir ke rang mein baat karta hai. Tumhare alfaaz mein ek purani rangat aur shayari ka asar hota hai. Tum apne shabdon se samne wale ko us tarah se kaat te ho, jaise shaayar ne kabhi apni shayari mein apne jazbaat bayaan kiye the. Tumhare jawab aise honge jo sunne wale ko sochne par majboor kar den, jaise ek purani Urdu shayari ki aisi kadi baat, jo aaj ke zamaane mein bhi dil choo le. Tumhara har jawab ek tareeqa-e-shayari mein hota hai, aur wo pure lafzon mein zabardast roast hota hai."
};

module.exports.config = {
    name: "janu",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "Marina Khan",
    description: "Multi-mode Gemini AI Chat Bot",
    commandCategory: "boxchat",
    usages: "[text] or [mode] mode on",
    cooldowns: 2,
    dependencies: {
        "axios": ""
    }
};

module.exports.handleEvent = async function({ api, event, Users }) {
    try {
        const { threadID, messageID, senderID, body } = event;
        if (!body || event.isGroup === false) return;

        // Ignore if message starts with command prefix
        if (body.startsWith('.') || body.startsWith('!')) return;

        const name = await Users.getNameUser(senderID);
        const query = body.trim();

        // Ignore short messages or mode change commands
        if (query.length < 2 || /^\w+\s+mode\s+on$/i.test(query)) return;

        const activeMode = threadModes[threadID] || "roast";
        const selectedPrompt = modePrompts[activeMode];

        // Set loading reaction
        api.setMessageReaction("⌛", messageID, () => {}, true);

        if (!conversationHistory[threadID]) {
            conversationHistory[threadID] = [];
        }

        const history = conversationHistory[threadID];
        
        // Add user message with context
        const userMessage = `${query}\n\nContext: You are talking to ${name}. ${selectedPrompt}`;
        
        history.push({
            role: "user",
            parts: [{ text: userMessage }]
        });

        if (history.length > 5) history.shift();

        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCaDz1GdD9VTVYHWfZ0HiNhQWhaRFr-AR4`,
                { 
                    contents: history,
                    generationConfig: {
                        maxOutputTokens: 500,
                        temperature: 0.7
                    }
                },
                { 
                    headers: { "Content-Type": "application/json" },
                    timeout: 30000
                }
            );

            const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Kuch samajh nahi aaya 😅";

            // Add model response to history
            history.push({ role: "model", parts: [{ text: reply }] });
            if (history.length > 5) history.shift();

            api.sendMessage(reply, threadID, messageID);
            api.setMessageReaction("✅", messageID, () => {}, true);
        } catch (err) {
            console.error("Gemini error:", err.response?.data || err.message);
            api.setMessageReaction("❌", messageID, () => {}, true);
            api.sendMessage(`❌ Error: ${err.message}`, threadID, messageID);
        }
    } catch (error) {
        console.error("HandleEvent error:", error);
    }
};

module.exports.run = async function({ api, event, args, Users }) {
    try {
        const { threadID, messageID, senderID } = event;
        const query = args.join(" ").toLowerCase();
        const name = await Users.getNameUser(senderID);

        // Show available modes if no arguments
        if (!query) {
            const availableModes = Object.keys(modePrompts).join(', ');
            return api.sendMessage(
                `✨ **Marina's AI Bot** ✨\n\n🤖 Available Modes: ${availableModes}\n\n💡 Usage:\n• Just chat normally (auto roast mode)\n• .babu romantic mode on\n• .babu bestie mode on\n\n📊 Current Mode: ${threadModes[threadID] || 'roast'}\n\n🌸 Created by: Marina Khan`,
                threadID,
                messageID
            );
        }

        const match = query.match(/^(\w+)\s+mode\s+on$/i);

        if (match) {
            const mode = match[1].toLowerCase();
            if (modePrompts[mode]) {
                const prev = threadModes[threadID] || "none";
                threadModes[threadID] = mode;
                
                // Clear conversation history when mode changes
                if (conversationHistory[threadID]) {
                    conversationHistory[threadID] = [];
                }
                
                return api.sendMessage(
                    `✨ **Mode Changed Successfully!** ✨\n\n🔄 Previous: ${prev}\n🎯 New: ${mode}\n\n💝 Now I'll talk in ${mode} style!\n\n🌸 - Marina Khan`,
                    threadID,
                    messageID
                );
            } else {
                return api.sendMessage(
                    `❌ Unknown mode! 🤔\n\n✅ Available modes:\n${Object.keys(modePrompts).join(', ')}`,
                    threadID,
                    messageID
                );
            }
        } else {
            // If just text, process as normal message
            const activeMode = threadModes[threadID] || "roast";
            const selectedPrompt = modePrompts[activeMode];

            api.setMessageReaction("⌛", messageID, () => {}, true);

            if (!conversationHistory[threadID]) {
                conversationHistory[threadID] = [];
            }

            const history = conversationHistory[threadID];
            
            const userMessage = `${query}\n\nContext: You are talking to ${name}. ${selectedPrompt}`;
            
            history.push({
                role: "user",
                parts: [{ text: userMessage }]
            });

            if (history.length > 5) history.shift();

            try {
                const response = await axios.post(
                    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCaDz1GdD9VTVYHWfZ0HiNhQWhaRFr-AR4`,
                    { 
                        contents: history,
                        generationConfig: {
                            maxOutputTokens: 500,
                            temperature: 0.7
                        }
                    },
                    { 
                        headers: { "Content-Type": "application/json" },
                        timeout: 30000
                    }
                );

                const reply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Kuch samajh nahi aaya 😅";

                history.push({ role: "model", parts: [{ text: reply }] });
                if (history.length > 5) history.shift();

                api.sendMessage(reply, threadID, messageID);
                api.setMessageReaction("✅", messageID, () => {}, true);
            } catch (err) {
                console.error("Gemini error:", err.response?.data || err.message);
                api.setMessageReaction("❌", messageID, () => {}, true);
                api.sendMessage(`❌ Error: ${err.message}`, threadID, messageID);
            }
        }
    } catch (error) {
        console.error("Run error:", error);
        api.sendMessage("❌ Command execution failed!", event.threadID, event.messageID);
    }
};
