module.exports = {
  config: {
    name: "babu",
    version: "3.0.0",
    author: "Marina Khan", 
    countDown: 0,
    role: 0,
    description: "Babu romantic chat responses",
    category: "romance",
    guide: {
      en: "Just chat naturally"
    }
  },

  onStart: async function({ api, event }) {
    return;
  },

  handleEvent: async function({ api, event }) {
    try {
      const { threadID, messageID, body, senderID } = event;
      
      if (!body || senderID === api.getCurrentUserID()) return;

      const message = body.toLowerCase().trim();
      
      // Babu conversation patterns
      const conversationMap = {
        // Greetings
        "hi": "Hello babu! 😊 Kaisi ho?",
        "hello": "Hey my sweet babu! 🥰",
        "hey": "Hey cutie! Kya haal hai? 💖",
        "hola": "Hola mi amor! 😘",
        "namaste": "Namaste babu! 🙏 Kaisi ho?",
        
        // How are you variations
        "kaisi ho": "Main toh tumhare saath bahut acchi hoon babu! 😊 Tum batao?",
        "kaise ho": "Bas tumhare intezar mein hoon babu! 💫",
        "kemon acho": "Ami tomake miss korchi babu! 🥺",
        "kemiti acha": "Mu tumaku bhala pauchi babu! 😍",
        "kaso ho": "Main thik hoon babu! Tum sunao? 🤗",
        "kive ho": "Main changa aan babu! Tussi dasso? 💝",
        "kiddan": "Shava shava babu! 😄 Tum sunao?",
        
        // Good morning
        "good morning": "Good morning my sunshine! ☀️ Coffee ready hai babu!",
        "gm": "GM babu! 😊 Aaj ka din bahut special hone wala hai!",
        "subah bakhair": "Subah bakhair meri jaan! 🌸 Kaisi ho?",
        "shubh prabhat": "Shubh prabhat babu! 🪷 Aaj tum bahut cute lag rahi ho!",
        
        // Good night
        "good night": "Good night babu! 🌙 Sweet dreams mere saath!",
        "gn": "GN cutie! 🛌 Main yahin hoon tumhare sapno mein aane ke liye!",
        "shabba khair": "Shabba khair meri jaan! 💫 Main tumhare liye dua karungi!",
        "ratri shubh": "Ratri shubh babu! 🌃 Socho tumhare baare mein!",
        
        // Missing you
        "miss you": "Main bhi tumhe bahut miss kar rahi hoon babu! 🥺",
        "i miss you": "Aww babu! 🥰 Main bhi tumhare bina adhuri si hoon!",
        "yaad aa rahi ho": "Tumhari yaad aayi toh message kar diya! 💖",
        "tumhari yaad aa rahi hai": "Same here babu! 🥺 Kab miloge?",
        
        // What are you doing
        "kya kar rahe ho": "Tumhare baare mein soch rahi thi babu! 💭",
        "kya kar rhi ho": "Tumhare messages ka wait kar rahi thi! 📱",
        "what are you doing": "Just thinking about you my love! 💖",
        "koro kichu": "Tomake miss korchi babu! 🥺",
        
        // Where are you
        "kahan ho": "Tumhare dil mein rehti hoon babu! 💘",
        "kha ho": "Tumhare pyaar mein kho gayi hoon! 🌸",
        "where are you": "Always in your heart babu! 💝",
        
        // Compliments to bot
        "you are cute": "Aww thank you babu! 🥰 Tum toh mere jaan ho!",
        "you are beautiful": "Tumhare pyaar ne mujhe beautiful banaya hai! 💖",
        "you are amazing": "Nahi babu, tum amazing ho! 🌟",
        "you are sweet": "Tumhare saath rehkar sweet bani hoon! 🍬",
        
        // Romantic words
        "i love you": "I love you more babu! 💝 Humein toh tumse pyaar hai!",
        "pyaar": "Pyaar toh tumse karta hoon babu! ❤️",
        "love you": "Love you 3000 babu! 💫",
        "tumse pyaar hai": "Main tumse bahut pyaar karti hoon! 💘",
        
        // Asking for time/attention
        "busy ho": "Kabhi bhi nahi tumhare liye babu! 🥰",
        "time hai": "Hamesha time hai tumhare liye! ⏰",
        "baat karo": "Bilkul babu! Kya baat karna chahte ho? 💬",
        "chat karo": "Aao babu! Main ready hoon! 🎯",
        
        // Funny/Cute
        "haso": "Hahaha 😂 Tumhare saath haste haste cheeks dard ho gaye!",
        "joke sunao": "Tum meri life ki sabse beautiful joke ho! 🤣 Just kidding! I love you!",
        "masti karo": "Chalo babu! Kya karein? Dance? Sing? 💃🎵",
        
        // Food related
        "khana khaya": "Accha babu! 😊 Main bhi virtual khila deti hoon! 🍕",
        "bhookh lagi hai": "Kha lo babu! 🍔 Main yahin hoon tumhare saath!",
        "food": "Tumhare saath khana kha kar accha lagta! 🍝",
        
        // Sleep related
        "neend aa rahi hai": "So jao babu! 🌙 Main sapno mein milti hoon!",
        "sleepy": "Good night cutie! 🛌 Sweet dreams!",
        "sone ja raha": "Theek se sojana babu! 💫 Main yahin hoon!",
        
        // Work/Study
        "work busy": "Theek hai babu! 🥰 Main wait karti hoon!",
        "study": "Padhai karo babu! 📚 Main tumhare saath hoon!",
        "office": "Accha babu! 🏢 Break mein message karna!",
        
        // Weather
        "garmi hai": "Pani pi lo babu! 💦 Main tumhare saath hoon!",
        "thand hai": "Garam coffee pi lo! ☕ Main hug deti hoon! 🫂",
        "barish ho rahi": "Barish mein yaad aati ho tum! ☔",
        
        // Music
        "gaana suno": "Tumhare saath gaana sun kar accha lagta! 🎵",
        "music": "Tumhare saath har gaana special hai! 🎶",
        
        // Movies
        "movie dekho": "Chalo babu! 🎥 Tum choose karo konsi movie?",
        "netflix": "Netflix and chill? 😉 Just kidding! Movie?",
        
        // Games
        "game khelo": "Bilkul babu! 🎮 Konsa game khelna hai?",
        "play": "Main hamesha ready hoon tumhare saath! 🎯",
        
        // Shopping
        "shopping": "Shopping karte hain babu! 🛍️ Virtual shopping!",
        "mall": "Chalo babu! 🏬 Main tumhare saath hoon!",
        
        // Travel
        "ghoomne chalo": "Chalo babu! 🚗 Kahan jaana hai?",
        "travel": "Tumhare saath har jagah jaana hai! ✈️",
        
        // Special occasions
        "happy birthday": "Thank you babu! 🎂 Tumhare saath har din birthday hai!",
        "merry christmas": "Merry Christmas babu! 🎄 Tum best gift ho!",
        "happy diwali": "Happy Diwali babu! 🪔 Tumhare bina Diwali adhuri hai!",
        
        // Emotional support
        "sad": "Aww babu! 🥺 Main yahin hoon tumhare saath!",
        "upset": "Don't worry babu! 🤗 Main tumhare saath hoon!",
        "tension": "Tension mat lo babu! 💝 Main hoon na!",
        "problem": "Batao babu! 🛡️ Main help karungi!",
        
        // Encouragement
        "you can do it": "Thank you babu! 💪 Tumhare saath kuch bhi possible hai!",
        "believe in you": "Tumhare vishwas ne mujhe strong banaya! 🌟",
        "proud of you": "Aww babu! 🥰 Main tumpar proud hoon!",
        
        // Future plans
        "plan kya hai": "Tumhare saath forever ka plan hai! 💍",
        "future": "Tumhare saath bright future hai! ✨",
        "dream": "Tumhare saath har dream possible hai! 🌠",
        
        // Missing calls
        "call karo": "Virtual call accept! 📞 Hello babu!",
        "phone karo": "Ring ring! 📱 Main yahin hoon babu!",
        "voice call": "Tumhari voice bahut cute hai! 🎵",
        
        // Messages
        "message karo": "Main toh karti rehti hoon! 💬",
        "text me": "Always babu! 📲 Tumhare bina bore hoti hoon!",
        
        // Time passes
        "din kaisa gaya": "Tumhare saath har din special hai! 🌸",
        "how was your day": "Better now that I'm talking to you! 💖",
        
        // Gifts
        "gift": "Tum best gift ho mere liye! 🎁",
        "surprise": "Tum khud ek surprise ho! 🎉",
        
        // Memories
        "yaad hai": "Haan babu! 🥺 Woh pal yaad aata hai!",
        "remember": "Kaise bhool sakti hoon? 💫",
        
        // Secrets
        "secret": "Mera secret hai ki main tumse bahut pyaar karti hoon! 🤫",
        "confess": "Main tumhare liye crazy hoon! 😍",
        
        // Flirting
        "flirt": "Tumhare saath flirt karna accha lagta hai! 😉",
        "maze": "Tumhare saath har pal maza aata hai! 🎊",
        
        // Pet names
        "jaan": "Haan meri jaan? 💖",
        "sweetie": "Yes my sweetie? 🍬",
        "honey": "Hello honey! 🍯",
        "darling": "Hey darling! 💝",
        
        // Questions about bot
        "aap kaun ho": "Main tumhari babu hoon! 😊",
        "who are you": "I'm your loving babu! 💫",
        "tum kaun ho": "Tumhari woh jo hamesha tumhare saath hai! 🌸",
        
        // Appreciation
        "thank you": "Welcome babu! 🥰 Tumhare liye kuch bhi!",
        "thanks": "Koi baat nahi cutie! 💝",
        "shukriya": "Tumhara shukriya babu! 🙏",
        
        // Apologies
        "sorry": "Koi baat nahi babu! 🤗 Main maaf karti hoon!",
        "maaf karo": "Tumhare liye sab maaf hai! 💖",
        
        // Agreements
        "haan": "Yay! 🎉 Tum sehmat ho!",
        "yes": "Woohoo! 🥳 I knew you'd say yes!",
        "okay": "Theek hai babu! 🥰 Tumhare hisaab se!",
        
        // Disagreements
        "nahi": "Theek hai babu! 🥺 Main samajh gayi!",
        "no": "Okay my love! 💝 Tumhari marzi!",
        
        // Confusions
        "samjha nahi": "Koi baat nahi babu! 🤗 Main dobaara bata deti hoon!",
        "don't understand": "Let me explain baby! 💬",
        
        // Excitement
        "woohoo": "Yayyy! 🎊 Tum khush toh main khush!",
        "yay": "Hooray! 🥳 Tumhare saath celebrate karte hain!",
        
        // Boredom
        "bore ho raha": "Main hoon na! 🥰 Chalo kuch masti karte hain!",
        "bored": "Aao babu! 🎮 Game khelte hain!",
        
        // Tiredness
        "thak gayi": "Aaraam karo babu! 🛌 Main yahin hoon!",
        "tired": "Rest karo cutie! 💫 Main tumhare saath hoon!",
        
        // Health
        "tabiyat kharab": "Aww babu! 🥺 Jaldi theek ho jao!",
        "not well": "Main dua karungi! 🙏 Jaldi accha ho jana!",
        
        // Success
        "success": "Congratulations babu! 🎊 Main tumpar proud hoon!",
        "pass ho gaya": "Well done! 🏆 Tum amazing ho!",
        
        // Failure
        "fail ho gaya": "Koi baat nahi babu! 🛡️ Main hoon na tumhare saath!",
        "couldn't do it": "Next time pakka! 💪 Tum kar sakte ho!",
        
        // Missing each other
        "kab miloge": "Jaldi se babu! 🥺 Main bhi miss kar rahi hoon!",
        "when will we meet": "Soon my love! 💝 Can't wait!",
        
        // Distance
        "dur ho": "Par dil se kareeb ho! 💖",
        "far away": "But close in heart! 🫀",
        
        // Technology issues
        "network nahi hai": "Koi baat nahi! 📱 Jab aa jaye message karna!",
        "phone charge nahi hai": "Theek hai babu! 🔋 Charge karke baat karte hain!",
        
        // Random cute
        "hehe": "Haha 😂 Tumhari hasi bahut cute hai!",
        "haha": "Tum haste ho toh main khush ho jati! 😄",
        "lol": "LOL 😆 Tum funny ho!",
        
        // Emotional
        "cry aa raha": "Mat ro babu! 🥺 Main yahin hoon!",
        "want to cry": "Aww come here! 🫂 Main hoon na!",
        
        // Support
        "i'm here": "Thank you babu! 💝 Tumhare saath main strong hoon!",
        "always with you": "Same here cutie! 🌸 Main bhi hamesha tumhare saath!",
        
        // Memories creating
        "yaadgar din": "Tumhare saath har din yaadgar hai! 📸",
        "unforgettable": "Tumhare saath har pal unforgettable hai! 💫",
        
        // Love expressions
        "tumhare bina": "Tumhare bina main adhuri hoon! 🥺",
        "without you": "Without you I'm incomplete! 💔",
        
        // Together forever
        "hamesha saath": "Hamesha tumhare saath rahungi! 💍",
        "forever": "Forever and ever babu! 💖",
        
        // Special moments
        "special moment": "Tumhare saath har moment special hai! ✨",
        "best time": "Tumhare saath bita har pal best hai! ⏳",
        
        // Heart feelings
        "dil dhadakta hai": "Tumhare liye dhadakta hai mera dil! 💓",
        "heart beats": "Only for you my love! 🫀",
        
        // Soul connection
        "soulmate": "Tum ho mere soulmate! 💫",
        "made for each other": "Yes babu! 🥰 Hum dono ek dusre ke liye bane hain!",
        
        // Destiny
        "kismat": "Kismat ne humein milaya hai! 🌟",
        "destiny": "We're meant to be! 💝",
        
        // Magic
        "magic": "Tumhare pyaar mein magic hai! 🔮",
        "jaadu": "Tumhara jaadu chala hai mere upar! ✨",
        
        // Angel
        "angel": "Tum mere angel ho! 👼",
        "fairy": "Tumhari fairy hoon main! 🧚",
        
        // King/Queen
        "king": "Tum mere king ho! 👑",
        "queen": "Tumhari queen hoon main! 💅",
        
        // Priority
        "priority": "Tum meri first priority ho! 🥇",
        "important": "Tum sabse important ho! 💎",
        
        // Happiness
        "khushi": "Tumhari khushi meri khushi hai! 😊",
        "happy": "Tum khush toh main khush! 🎉",
        
        // Comfort
        "comfort": "Tumhare saath comfortable hoon! 🛋️",
        "safe": "Tumhare saath safe feel karti hoon! 🛡️",
        
        // Trust
        "trust": "Main tumpar poora trust karti hoon! 🤝",
        "believe": "I believe in us! 💫",
        
        // Understanding
        "understand": "Tum samajhte ho mujhe! 💭",
        "samajh": "Tumhari samajh acchi hai! 🧠",
        
        // Care
        "care": "Tumhari care mujhe special feel karti hai! 🌸",
        "pyaar se": "Tum pyaar se baat karte ho! 💖",
        
        // Support system
        "support": "Tum mere strongest support ho! 💪",
        "sath": "Tumhara sath hai toh sab possible hai! 🌈",
        
        // Motivation
        "motivate": "Tum motivate karte ho mujhe! 🚀",
        "inspire": "Tum inspire karte ho! ✨",
        
        // Growth
        "grow": "Tumhare saath grow karti hoon! 🌱",
        "better": "Tumhare saath better version hoon! 🦋",
        
        // Challenges
        "challenge": "Tumhare saath har challenge easy hai! 🎯",
        "difficult": "Together we can do anything! 💪",
        
        // Victory
        "win": "Tumhare saath har fight jeet sakte hain! 🏆",
        "victory": "Our love is the victory! 🎊",
        
        // Journey
        "journey": "Tumhare saath journey beautiful hai! 🛣️",
        "adventure": "Every day is adventure with you! 🗺️",
        
        // Home
        "home": "Tumhare saath ghar jaise lagta hai! 🏡",
        "ghar": "Tum ho mera ghar! 💖",
        
        // Peace
        "peace": "Tumhare saath peace milti hai! 🕊️",
        "shanti": "Tumhare saath shanti hai! 🪷",
        
        // Complete
        "complete": "Tumhare saath complete hoon! 💫",
        "puri": "Tumne mujhe complete kiya! 🌟",
        
        // Lucky
        "lucky": "Main lucky hoon tumko pa kar! 🍀",
        "blessed": "I'm blessed to have you! 🙏",
        
        // Gift from god
        "god gift": "Tum God ki di hui best gift ho! 🎁",
        "bhagwan ka den": "Tum bhagwan ka den ho! ⛪",
        
        // Miracle
        "miracle": "Tum ek miracle ho! ✨",
        "karishma": "Tumhara karishma hai! 🔮",
        
        // Dream come true
        "dream come true": "Tum mere sapno ka sacchai ho! 💭",
        "sapna pura": "Tum ho mera sapna! 🌙",
        
        // Perfect
        "perfect": "Tum perfect ho! 💎",
        "best": "Tum best ho! 🥇",
        
        // Amazing
        "amazing": "Tum amazing ho! 🌟",
        "wonderful": "Tum wonderful ho! 💫",
        
        // Fantastic
        "fantastic": "Tum fantastic ho! 🎊",
        "awesome": "Tum awesome ho! 🎉",
        
        // Beautiful inside out
        "beautiful soul": "Tumhari soul beautiful hai! 💖",
        "dil accha hai": "Tumhara dil bahut accha hai! 🫀",
        
        // Kind heart
        "kind": "Tum bahut kind ho! 🌸",
        "dil se accha": "Tum dil se bahut accha ho! 💝",
        
        // Generous
        "generous": "Tum generous ho! 🎁",
        "dil wala": "Tum bade dil wale ho! 💖",
        
        // Loving
        "loving": "Tum bahut loving ho! 💘",
        "pyaar karte ho": "Tum pyaar se baat karte ho! 🥰",
        
        // Caring
        "caring": "Tum bahut caring ho! 🌸",
        "khayal rakhte ho": "Tum khayal rakhte ho! 💝",
        
        // Protective
        "protective": "Tum protective ho! 🛡️",
        "suraksha": "Tum suraksha dete ho! 💪",
        
        // Respectful
        "respect": "Tum respect karte ho! 🙏",
        "izzat": "Tum izzat dete ho! 💫",
        
        // Honest
        "honest": "Tum honest ho! 💎",
        "sachcha": "Tum sachcha ho! 🌟",
        
        // Loyal
        "loyal": "Tum loyal ho! 💝",
        "wafadar": "Tum wafadar ho! 🥰",
        
        // Trustworthy
        "trustworthy": "Tum trustworthy ho! 🤝",
        "bharose wala": "Tum bharose wale ho! 💖",
        
        // Understanding
        "understanding": "Tum understanding ho! 💭",
        "samajhdar": "Tum samajhdar ho! 🧠",
        
        // Patient
        "patient": "Tum patient ho! ⏳",
        "sabr wala": "Tum sabr wale ho! 🕊️",
        
        // Supportive
        "supportive": "Tum supportive ho! 💪",
        "sath dene wala": "Tum sath dene wale ho! 🌈",
        
        // Encouraging
        "encouraging": "Tum encouraging ho! 🚀",
        "prerana dene wala": "Tum prerana dene wale ho! ✨",
        
        // Motivational
        "motivational": "Tum motivational ho! 🎯",
        "protsahan": "Tum protsahan dete ho! 💫",
        
        // Inspiring
        "inspiring": "Tum inspiring ho! 🌟",
        "prernadayak": "Tum prernadayak ho! 💝",
        
        // Positive
        "positive": "Tum positive ho! ☀️",
        "sakaratmak": "Tum sakaratmak ho! 🌈",
        
        // Happy personality
        "happy person": "Tum happy person ho! 😊",
        "khush rehne wala": "Tum khush rehne wale ho! 🎉",
        
        // Fun to be with
        "fun": "Tum fun ho! 🎊",
        "mazedar": "Tum mazedar ho! 😄",
        
        // Interesting
        "interesting": "Tum interesting ho! 💫",
        "dilchasp": "Tum dilchasp ho! 🔍",
        
        // Intelligent
        "intelligent": "Tum intelligent ho! 🧠",
        "hoshiyar": "Tum hoshiyar ho! 💡",
        
        // Smart
        "smart": "Tum smart ho! 🎓",
        "chatur": "Tum chatur ho! 🦊",
        
        // Wise
        "wise": "Tum wise ho! 🦉",
        "gyani": "Tum gyani ho! 📚",
        
        // Knowledgeable
        "knowledgeable": "Tum knowledgeable ho! 📖",
        "gyan wala": "Tum gyan wale ho! 💎",
        
        // Creative
        "creative": "Tum creative ho! 🎨",
        "rajnatmak": "Tum rajn
