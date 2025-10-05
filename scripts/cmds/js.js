module.exports = {
  config: {
    name: "babu",
    version: "1.0.0",
    author: "Marina Khan", 
    countDown: 0,
    role: 0,
    description: "Romantic chat responses",
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
      
      // Enhanced trigger words detection
      const triggerWords = [
        'babu', 'baby', 'jaan', 'love', 'pyar', 'dear', 'sweet', 'cute', 
        'handsome', 'beautiful', 'good morning', 'good night', 'miss you',
        'kaisi ho', 'kaise ho', 'kemon acho', 'hello', 'hi', 'hey'
      ];

      const shouldRespond = triggerWords.some(word => message.includes(word));
      
      if (shouldRespond) {
        const responses = [
          "Haan babu? Kya hua mere cute friend? 😊",
          "Babu call karoge toh main aa jaungi! 📞❤️",
          "Babu itna cute kyun ho tum? 🥺",
          "Babu babu karke pagal mat banao! 😡💖",
          "Haan bol babu, kya kaam hai? 🤔",
          "Babu tumhare bina bore ho raha hai! 🥲",
          "Babu ek hug dedo please! 🫂",
          "Babu aaj tum bahut sweet lag rahe ho! 🍬",
          "Babu meri jaan! Kaisi ho? 💫",
          "Babu tumhare messages dekh kar mood fresh ho jata hai! 🌈",
          "Babu main hoon na, tension mat lo! 🤗",
          "Babu tumhare saath baat karke accha lagta hai! 💝",
          "Babu aaj kya plan hai? 🎯",
          "Babu tumhari voice bahut cute hai! 🎵",
          "Babu main tumhari favorite hoon na? 😉",
          "Babu tumhare liye chocolate laayi hoon! 🍫",
          "Babu good morning! Subah subah cute message! ☀️",
          "Babu good night! Sweet dreams! 🌙💤",
          "Babu tumhare liye ek surprise hai! 🎁",
          "Babu main tumhare bina so nahi paati! 🛌",
          "Babu tum meri priority ho! 💯",
          "Babu tumhare saath har pal special hai! ⏰",
          "Babu tumhare smile ki deewani hoon! 😄",
          "Babu tum best ho! 🏆",
          "Babu main hamesha tumhare saath hoon! 🤝",
          "Hello my sweet babu! 🥰 Kaisi ho?",
          "Hey cutie! Tumhare bina din boring lagta hai! 💖",
          "Good morning sunshine! ☀️ Coffee ready hai babu!",
          "Good night my love! 🌙 Main sapno mein milti hoon!",
          "Main bhi tumhe bahut miss kar rahi hoon babu! 🥺",
          "Tumhare baare mein soch rahi thi! 💭",
          "Tumhare pyaar mein kho gayi hoon! 🌸",
          "Aww thank you babu! 🥰 Tum toh mere jaan ho!",
          "I love you more babu! 💝",
          "Hahaha 😂 Tumhare saath haste haste cheeks dard ho gaye!",
          "Chalo babu! Kya karein? Dance? Sing? 💃🎵",
          "Kha lo babu! 🍔 Main yahin hoon tumhare saath!",
          "So jao babu! 🌙 Main sapno mein milti hoon!",
          "Padhai karo babu! 📚 Main tumhare saath hoon!",
          "Pani pi lo babu! 💦 Main tumhare saath hoon!",
          "Tumhare saath gaana sun kar accha lagta! 🎵",
          "Chalo babu! 🎥 Tum choose karo konsi movie?",
          "Bilkul babu! 🎮 Konsa game khelna hai?",
          "Shopping karte hain babu! 🛍️",
          "Chalo babu! 🚗 Kahan jaana hai?",
          "Thank you babu! 🎂 Tumhare saath har din special hai!",
          "Don't worry babu! 🤗 Main tumhare saath hoon!",
          "Thank you babu! 💪 Tumhare saath kuch bhi possible hai!",
          "Virtual call accept! 📞 Hello babu!",
          "Main toh karti rehti hoon! 💬",
          "Tumhare saath har din special hai! 🌸",
          "Tum best gift ho mere liye! 🎁",
          "Haan babu! 🥺 Woh pal yaad aata hai!",
          "Mera secret hai ki main tumse bahut pyaar karti hoon! 🤫",
          "Tumhare saath flirt karna accha lagta hai! 😉",
          "Haan meri jaan? 💖",
          "Main tumhari babu hoon! 😊",
          "Welcome babu! 🥰 Tumhare liye kuch bhi!",
          "Koi baat nahi babu! 🤗 Main maaf karti hoon!",
          "Yay! 🎉 Tum sehmat ho!",
          "Theek hai babu! 🥺 Main samajh gayi!",
          "Koi baat nahi babu! 🤗 Main dobaara bata deti hoon!",
          "Yayyy! 🎊 Tum khush toh main khush!",
          "Main hoon na! 🥰 Chalo kuch masti karte hain!",
          "Aaraam karo babu! 🛌 Main yahin hoon!",
          "Aww babu! 🥺 Jaldi theek ho jao!",
          "Congratulations babu! 🎊 Main tumpar proud hoon!",
          "Koi baat nahi babu! 🛡️ Main hoon na tumhare saath!",
          "Jaldi se babu! 🥺 Main bhi miss kar rahi hoon!",
          "Par dil se kareeb ho! 💖",
          "Koi baat nahi! 📱 Jab aa jaye message karna!",
          "Haha 😂 Tumhari hasi bahut cute hai!",
          "Mat ro babu! 🥺 Main yahin hoon!",
          "Thank you babu! 💝 Tumhare saath main strong hoon!",
          "Tumhare saath har din yaadgar hai! 📸",
          "Tumhare bina main adhuri hoon! 🥺",
          "Hamesha tumhare saath rahungi! 💍",
          "Tumhare saath har moment special hai! ✨",
          "Tumhare liye dhadakta hai mera dil! 💓",
          "Tum ho mere soulmate! 💫",
          "Kismat ne humein milaya hai! 🌟",
          "Tumhare pyaar mein magic hai! 🔮",
          "Tum mere angel ho! 👼",
          "Tum mere king ho! 👑",
          "Tum meri first priority ho! 🥇",
          "Tumhari khushi meri khushi hai! 😊",
          "Tumhare saath comfortable hoon! 🛋️",
          "Main tumpar poora trust karti hoon! 🤝",
          "Tum samajhte ho mujhe! 💭",
          "Tumhari care mujhe special feel karti hai! 🌸",
          "Tum mere strongest support ho! 💪",
          "Tum motivate karte ho mujhe! 🚀",
          "Tumhare saath grow karti hoon! 🌱",
          "Tumhare saath har challenge easy hai! 🎯",
          "Tumhare saath har fight jeet sakte hain! 🏆",
          "Tumhare saath journey beautiful hai! 🛣️",
          "Tumhare saath ghar jaise lagta hai! 🏡",
          "Tumhare saath peace milti hai! 🕊️",
          "Tumhare saath complete hoon! 💫",
          "Main lucky hoon tumko pa kar! 🍀",
          "Tum God ki di hui best gift ho! 🎁",
          "Tum ek miracle ho! ✨",
          "Tum mere sapno ka sacchai ho! 💭",
          "Tum perfect ho! 💎",
          "Tum amazing ho! 🌟",
          "Tum fantastic ho! 🎊",
          "Tumhari soul beautiful hai! 💖",
          "Tum bahut kind ho! 🌸",
          "Tum generous ho! 🎁",
          "Tum bahut loving ho! 💘",
          "Tum bahut caring ho! 🌸",
          "Tum protective ho! 🛡️",
          "Tum respect karte ho! 🙏",
          "Tum honest ho! 💎",
          "Tum loyal ho! 💝",
          "Tum trustworthy ho! 🤝",
          "Tum understanding ho! 💭",
          "Tum patient ho! ⏳",
          "Tum supportive ho! 💪",
          "Tum encouraging ho! 🚀",
          "Tum motivational ho! 🎯",
          "Tum inspiring ho! 🌟",
          "Tum positive ho! ☀️",
          "Tum happy person ho! 😊",
          "Tum fun ho! 🎊",
          "Tum interesting ho! 💫",
          "Tum intelligent ho! 🧠",
          "Tum smart ho! 🎓",
          "Tum wise ho! 🦉",
          "Tum knowledgeable ho! 📖",
          "Tum creative ho! 🎨"
        ];

        const randomReply = responses[Math.floor(Math.random() * responses.length)];
        
        setTimeout(() => {
          api.sendMessage(randomReply, threadID, messageID);
        }, 1000);

        api.setMessageReaction("❤️", messageID, () => {}, true);
      }
    } catch (error) {
      console.error("Babu command error:", error);
    }
  }
};
