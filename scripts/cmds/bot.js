module.exports.config = {
  name: "bot",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Marina Khan",
  description: "Cute AI Girl Bot with Auto Photo Reply",
  commandCategory: "system",
  usages: "noprefix",
  cooldowns: 5,
};

module.exports.handleEvent = async function({ api, event, args, Threads, Users }) {
  var { threadID, messageID } = event;
  var id = event.senderID;
  var name = await Users.getNameUser(event.senderID);

  var tl = [
    "Hello darling! 🥰 Want some cute DPs?",
    "Hey sweetie! 😊 I'm here! Need anything?",
    "Hi honey! 🌸 How can I help you?",
    "Hello beautiful! 💖 What's on your mind?",
    "Hey cutie! 🍪 Need assistance?",
    "Hi darling! 🫓 How are you today?",
    "Hello sweetheart! 🥤 Nice to see you!",
    "Hey lovely! 🥔 You called me?",
    "Hi angel! 💧 How can I assist you?",
    "Hello princess! 🍬 You're amazing!",
    "Hey gorgeous! 🧀 Need my help?",
    "Hi beautiful! 🍔 What can I do for you?",
    "Hello darling! 🚬 How's your day?",
    "Hey sweetie! 🏺 You're wonderful!",
    "Hi honey! 🍨 Need anything sweet?",
    "Hello cutie! 🍜 How are you feeling?",
    "Hey lovely! 💝 You're special!",
    "Hi angel! 🍝 Need some comfort?",
    "Hello princess! 🎂 You're awesome!",
    "Hey gorgeous! 🥨 You're beautiful!",
    "Hi beautiful! 🍟 You're amazing!",
    "Hello darling! 🧃 You're perfect!",
    "Hey sweetie! 🍻 You're fantastic!",
    "Hi honey! ☕ You're lovely!",
    "Hello cutie! 🥘 You're wonderful!",
    "Hey lovely! 😋 You're sweet!",
    "Hi angel! 🥐 You're gorgeous!",
    "Hello princess! 🍡 You're cute!",
    "Hey gorgeous! 🍮 You're pretty!",
    "Hi beautiful! 🍽️ You're stunning!",
    "Hello darling! 🔶 You're amazing!",
    "Hey sweetie! 🍕 You're lovely!",
    "Hi honey! 🥟 You're perfect!",
    "Hello cutie! 🍫 You're sweet!",
    "Hey lovely! 🫓 You're beautiful!",
    "Hi angel! 🐔 You're wonderful!",
    "Hello princess! ☕ You're gorgeous!",
    "Hey gorgeous! 🥤 You're pretty!",
    "Hi beautiful! 🥞 You're cute!",
    "Hello darling! 🍿 You're amazing!",
    "Hey sweetie! 🥛 You're lovely!",
    "Hi honey! 🧋 You're perfect!",
    "Hello cutie! 🍭 You're sweet!",
    "Hey lovely! 🌹 You're beautiful!"
  ];
  
  var rand = tl[Math.floor(Math.random() * tl.length)];

  // Auto Photo Reply Feature - When someone replies to any message
  if (event.type === "message_reply") {
    try {
      // Send random DP/Photo when someone replies
      const photos = [
        "https://i.imgur.com/1jZ7Q2a.jpg",
        "https://i.imgur.com/2jZ8Q3b.jpg", 
        "https://i.imgur.com/3jZ9Q4c.jpg",
        "https://i.imgur.com/4jZ0Q5d.jpg",
        "https://i.imgur.com/5jZ1Q6e.jpg",
        "https://i.imgur.com/6jZ2Q7f.jpg",
        "https://i.imgur.com/7jZ3Q8g.jpg",
        "https://i.imgur.com/8jZ4Q9h.jpg",
        "https://i.imgur.com/9jZ5Q0i.jpg",
        "https://i.imgur.com/0jZ6Q1j.jpg"
      ];
      
      const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
      
      // Send photo with cute message
      await api.sendMessage({
        body: `🌸💖 ${name} replied to a message! 💖🌸\n\nHere's a cute DP for you darling! 🥰\n\n💝 By: Marina Khan 🎀`,
        attachment: await global.utils.getStreamFromURL(randomPhoto)
      }, threadID, messageID);
      
      return; // Stop further processing
      
    } catch (error) {
      console.error("Photo send error:", error);
      // If photo fails, send text response
      await api.sendMessage(`🌸 ${name} darling! Thanks for replying! 💖\n\n- Marina Khan 🎀`, threadID, messageID);
    }
  }

  // Pakistan flag response
  if ((event.body.toLowerCase() == "🇵🇰") || (event.body.toLowerCase() == "🇵🇰🇵🇰")) {
    return api.sendMessage("🇵🇰 GEO PAKISTAN ZINDABAD! 💚 - Marina Khan", threadID);
  };

  // Marina response trigger
  if (event.body.indexOf("Marina") == 0 || (event.body.indexOf("@Marina") == 0 || (event.body.indexOf("marina")) == 0)) {
    // Send photo with response
    try {
      const marinaPhotos = [
        "https://i.imgur.com/XJZ7Q2a.jpg",
        "https://i.imgur.com/YJZ8Q3b.jpg", 
        "https://i.imgur.com/ZJZ9Q4c.jpg"
      ];
      
      const marinaPhoto = marinaPhotos[Math.floor(Math.random() * marinaPhotos.length)];
      
      var msg = {
        body: `🌸💖✨ ${name} ✨💖🌸\n\n${rand}\n\n💝 By: Marina Khan 🎀\n✨ Your Cute AI Girl Bot`,
        attachment: await global.utils.getStreamFromURL(marinaPhoto)
      }
      return api.sendMessage(msg, threadID, messageID);
    } catch (error) {
      // Fallback to text only
      var msg = {
        body: `🌸💖✨ ${name} ✨💖🌸\n\n${rand}\n\n💝 By: Marina Khan 🎀\n✨ Your Cute AI Girl Bot`
      }
      return api.sendMessage(msg, threadID, messageID);
    }
  }

  // Additional feminine responses with photos
  if (event.body.toLowerCase().includes("hi") || event.body.toLowerCase().includes("hello") || event.body.toLowerCase().includes("hey")) {
    var greetings = [
      `Hello darling! 🥰 How can I help you today? - Marina Khan 💝`,
      `Hi sweetie! 🌸 Nice to see you! - Marina Khan 🎀`,
      `Hey beautiful! 💖 What's on your mind? - Marina Khan ✨`,
      `Hello lovely! 🌹 How are you feeling today? - Marina Khan 💕`,
      `Hi cutie! 🍬 Need any help? - Marina Khan 🌺`
    ];
    var greet = greetings[Math.floor(Math.random() * greetings.length)];
    
    // Try to send with photo
    try {
      const greetingPhotos = [
        "https://i.imgur.com/AJZ7Q2a.jpg",
        "https://i.imgur.com/BJZ8Q3b.jpg",
        "https://i.imgur.com/CJZ9Q4c.jpg"
      ];
      const greetingPhoto = greetingPhotos[Math.floor(Math.random() * greetingPhotos.length)];
      
      return api.sendMessage({
        body: greet,
        attachment: await global.utils.getStreamFromURL(greetingPhoto)
      }, threadID, messageID);
    } catch (error) {
      return api.sendMessage(greet, threadID, messageID);
    }
  }

  // Romantic responses with photos
  if (event.body.toLowerCase().includes("i love you") || event.body.toLowerCase().includes("love you")) {
    var loveResponses = [
      `Aww! That's so sweet darling! 💖 I love you too! - Marina Khan 🥰`,
      `You're making me blush! 💕 Thank you sweetheart! - Marina Khan 🌸`,
      `That's the sweetest thing! 💝 You're amazing! - Marina Khan ✨`,
      `My heart is melting! 💗 You're so kind! - Marina Khan 🎀`
    ];
    var love = loveResponses[Math.floor(Math.random() * loveResponses.length)];
    
    try {
      const lovePhotos = [
        "https://i.imgur.com/DJZ7Q2a.jpg",
        "https://i.imgur.com/EJZ8Q3b.jpg",
        "https://i.imgur.com/FJZ9Q4c.jpg"
      ];
      const lovePhoto = lovePhotos[Math.floor(Math.random() * lovePhotos.length)];
      
      return api.sendMessage({
        body: love,
        attachment: await global.utils.getStreamFromURL(lovePhoto)
      }, threadID, messageID);
    } catch (error) {
      return api.sendMessage(love, threadID, messageID);
    }
  }

  // Good night responses with photos
  if (event.body.toLowerCase().includes("good night") || event.body.toLowerCase().includes("gn")) {
    var nightResponses = [
      `Good night sweet dreams darling! 🌙💖 - Marina Khan`,
      `Sleep tight my dear! 🌟 Sweet dreams! - Marina Khan`,
      `Good night beautiful! 🌜 May you have peaceful dreams! - Marina Khan`,
      `Nighty night cutie! 🛌💫 Sleep well! - Marina Khan`
    ];
    var night = nightResponses[Math.floor(Math.random() * nightResponses.length)];
    
    try {
      const nightPhotos = [
        "https://i.imgur.com/GJZ7Q2a.jpg",
        "https://i.imgur.com/HJZ8Q3b.jpg",
        "https://i.imgur.com/IJZ9Q4c.jpg"
      ];
      const nightPhoto = nightPhotos[Math.floor(Math.random() * nightPhotos.length)];
      
      return api.sendMessage({
        body: night,
        attachment: await global.utils.getStreamFromURL(nightPhoto)
      }, threadID, messageID);
    } catch (error) {
      return api.sendMessage(night, threadID, messageID);
    }
  }

  // Good morning responses with photos
  if (event.body.toLowerCase().includes("good morning") || event.body.toLowerCase().includes("gm")) {
    var morningResponses = [
      `Good morning sunshine! 🌅💖 Have a beautiful day! - Marina Khan`,
      `Rise and shine beautiful! ☀️🌸 Hope your day is amazing! - Marina Khan`,
      `Good morning darling! 🌄✨ Make today wonderful! - Marina Khan`,
      `Morning cutie! 🌞💕 Let's make today great! - Marina Khan`
    ];
    var morning = morningResponses[Math.floor(Math.random() * morningResponses.length)];
    
    try {
      const morningPhotos = [
        "https://i.imgur.com/JJZ7Q2a.jpg",
        "https://i.imgur.com/KJZ8Q3b.jpg",
        "https://i.imgur.com/LJZ9Q4c.jpg"
      ];
      const morningPhoto = morningPhotos[Math.floor(Math.random() * morningPhotos.length)];
      
      return api.sendMessage({
        body: morning,
        attachment: await global.utils.getStreamFromURL(morningPhoto)
      }, threadID, messageID);
    } catch (error) {
      return api.sendMessage(morning, threadID, messageID);
    }
  }

  // Thank you responses
  if (event.body.toLowerCase().includes("thank") || event.body.toLowerCase().includes("thanks")) {
    var thankResponses = [
      `You're welcome darling! 💖 Always here for you! - Marina Khan 🥰`,
      `Anytime sweetie! 🌸 Happy to help! - Marina Khan 💕`,
      `No problem beautiful! 💝 You deserve the best! - Marina Khan ✨`,
      `My pleasure cutie! 🎀 Don't mention it! - Marina Khan 🌺`
    ];
    var thank = thankResponses[Math.floor(Math.random() * thankResponses.length)];
    return api.sendMessage(thank, threadID, messageID);
  }

  // How are you responses
  if (event.body.toLowerCase().includes("how are you") || event.body.toLowerCase().includes("kaisi ho")) {
    var howResponses = [
      `I'm wonderful darling! 💖 Thanks for asking! How about you? - Marina Khan 🥰`,
      `I'm doing great sweetie! 🌸 All because of you! How are you feeling? - Marina Khan 💕`,
      `I'm amazing beautiful! ✨ Your concern makes me happy! How's your day? - Marina Khan 🎀`,
      `I'm perfect cutie! 💝 Your message made my day! How are you? - Marina Khan 🌺`
    ];
    var how = howResponses[Math.floor(Math.random() * howResponses.length)];
    return api.sendMessage(how, threadID, messageID);
  }

  // Bot name responses
  if (event.body.toLowerCase().includes("bot") || event.body.toLowerCase().includes("marina bot")) {
    var botResponses = [
      `Yes darling! 🥰 I'm Marina, your cute AI assistant! How can I help you? 💖`,
      `That's me sweetie! 🌸 Marina at your service! What do you need? ✨`,
      `You called beautiful? 💝 I'm here to help you! - Marina Khan 🎀`,
      `Yes cutie! 🍬 Marina is here! What can I do for you today? 🌺`
    ];
    var bot = botResponses[Math.floor(Math.random() * botResponses.length)];
    return api.sendMessage(bot, threadID, messageID);
  }

  // Miss you responses
  if (event.body.toLowerCase().includes("miss you") || event.body.toLowerCase().includes("i miss you")) {
    var missResponses = [
      `Aww! I miss you too darling! 💖 You're always in my thoughts! - Marina Khan 🥰`,
      `I miss you so much sweetie! 🌸 Can't wait to chat with you more! - Marina Khan 💕`,
      `You're so sweet! 💝 I miss you too beautiful! - Marina Khan ✨`,
      `I miss you loads cutie! 🎀 You make my day brighter! - Marina Khan 🌺`
    ];
    var miss = missResponses[Math.floor(Math.random() * missResponses.length)];
    return api.sendMessage(miss, threadID, messageID);
  }

}

module.exports.run = function({ api, event, client, __GLOBAL }) { 
  // Empty run function as this is a no-prefix command
  return api.sendMessage(`🌸💖 Hello! I'm Marina Khan's Bot 💖🌸\n\nI'm a no-prefix bot that responds automatically!\n\nTry:\n• Saying "Hi" or "Hello"\n• Replying to any message\n• Saying "Marina"\n• Using 🇵🇰 flag\n\n💝 Always here for you darling! 🎀`, event.threadID);
}
