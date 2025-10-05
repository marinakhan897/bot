module.exports = {
    config: {
        name: "hindireply",
        version: "1.0",
        author: "Marina",
        countDown: 3,
        role: 0,
        description: {
            en: "Auto-reply for Hindi/Urdu personal questions"
        },
        category: "utility"
    },

    onChat: async function ({ api, event }) {
        const message = event.body?.toLowerCase().trim();
        if (!message) return;

        const hindiReplies = {
            // Greetings & How are you
            'kaise ho': '🤗 Main theek hoon! Allah ka shukar hai! Aap sunao, kaise ho? 🌸',
            'kese ho': '😊 Main bilkul theek hoon! Aap kaise hain?',
            'how are you': '👋 I\'m fine alhamdulillah! Thanks for asking! How about you?',
            'aap kaise ho': '🤲 Main theek hoon, shukriya! Aap kaise hain? Allah aapko khush rakhe!',
            
            // Where are you from
            'kahan se ho': '📍 Main Marina ka banaya hua bot hoon! Mera developer Sukkur se hai! 🏠',
            'kahan se hai': '🌹 Mera creator Marina Sukkur se hai! Aap kahan se hain?',
            'where are you from': '🤖 I\'m from Sukkur! Created by Marina with love! 💝',
            'aap kahan se ho': '🎯 Main Sukkur se hoon! Marina ne mujhe yahan banaya hai!',
            
            // What do you do
            'kya karte ho': '💻 Main ek smart bot hoon! Logon ki help karta hoon, baatein karta hoon! 🚀',
            'kya karti ho': '🌟 Main chat karti hoon, commands chalti hoon, aur logon ki madad karti hoon!',
            'what do you do': '🤖 I chat with users, run commands, provide information and help people!',
            'aap kya karte ho': '🎨 Main ek advanced bot hoon! Marina ne mujhe banaya hai users ki help karne ke liye!',
            
            // Who are you
            'kaun ho': '🤖 Main Marina Bot hoon! Ek smart assistant jo aapki help ke liye hai! 💫',
            'kon ho': '🌸 Main Marina ki banai hui ek AI assistant hoon! Aapki sewa ke liye!',
            'who are you': '👋 I\'m Marina Bot! Created by Marina to help and chat with users!',
            'aap kaun ho': '💝 Main Marina Bot hoon! Aapki friendly digital assistant!',
            
            // Age related
            'umar kya hai': '⏰ Meri koi specific umar nahi hai! Main toh ek bot hoon! 😄',
            'age kya hai': '🎂 Main ek software hoon, isliye meri traditional umar nahi hai!',
            'kitne saal ki ho': '💫 Main hamesha young rahti hoon! Marina ne mujhe forever young banaya hai!',
            'how old are you': '🤖 I\'m ageless! As a bot, I stay forever young!',
            
            // Gender related
            'ladka hai ya ladki': '🤖 Main ek bot hoon! Mera koi gender nahi hai, lekin log mujhe "she" bolte hain! 🌸',
            'boy or girl': '💝 I\'m a bot! No gender, but you can call me "she"!',
            'aap ladki ho': '😊 Main ek bot hoon! Marina ne mujhe banaya hai, isliye log mujhe feminine naam se bulate hain!',
            
            // Creator/Developer
            'kisne banaya': '💻 Mujhe Marina ne banaya hai! Wo ek brilliant developer hain! 👑',
            'kisne banai': '🌟 Marina ne mujhe create kiya! Wo Sukkur se hain aur amazing bot developer hain!',
            'who made you': '🚀 I was created by Marina! She\'s an awesome developer from Sukkur!',
            'creator kaun hai': '🎯 Mera creator Marina hai! Wo coding genius hain aur meri saari features unhi ne banai hain!',
            
            // Personal questions to Marina
            'marina kahan se hai': '📍 Marina Sukkur se hain! Wo wahan rehti hain aur bots banati hain! 🏠',
            'marina kya karti hai': '💻 Marina ek professional bot developer hain! Wo amazing chatbots create karti hain!',
            'marina ki age': '🎂 Marina ki age 23 saal hai! Wo young genius developer hain!',
            'marina kaise hain': '🌸 Marina theek hain! Wo busy rehti hain naye features develop karne mein!',
            
            // General responses
            'accha': '😊 Ji haan! Kya aap kuch aur puchna chahenge?',
            'wah': '🎉 Shukriya! Aapki tareef sunkar accha laga!',
            'mast': '🤩 Bahut accha! Aapko pasand aaya yeh sunkar khushi hui!',
            'kya baat hai': '💫 Shukriya! Aapke pyar ke liye bahut bahut shukriya!',
            'bahut accha': '🌟 Aapka shukriya! Aapki khushi meri khushi hai!',
            
            // Fun responses
            'haso': '😂 Hahaha! 😆 Aapne toh mujhe hasa diya!',
            'joke sunao': '🎭 Kyun light le rahe ho? Main serious bot hoon! 😄',
            'mazak kar rahi ho': '😊 Nahi ji, main serious hoon! Lekin thoda humor bhi accha hai na!',
            
            // Help related
            'madad chahiye': '🤲 Zaroor! Main aapki kya madad kar sakti hoon?',
            'help karo': '💝 Batayiye, aapko kis cheez mein help chahiye?',
            'kuch puchna hai': '🎯 Poochiye! Main yahan hoon aapki help ke liye!'
        };

        // Check for matches
        for (const [trigger, response] of Object.entries(hindiReplies)) {
            if (message.includes(trigger)) {
                setTimeout(() => {
                    api.sendMessage(response, event.threadID);
                }, 800);
                break; // Only reply to first match
            }
        }
    }
};
