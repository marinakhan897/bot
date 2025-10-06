module.exports.config = {
  name: "bot2",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Marina Khan",
  description: "Cute AI Girl Bot with Auto Photo Reply",
  commandCategory: "Noprefix",
  usages: "noprefix",
  cooldowns: 6,
};

module.exports.handleEvent = async function({ api, event, args, Threads, Users }) {
  var { threadID, messageID, reason } = event;
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Kolkata").format("HH:MM:ss L");
  var idgr = `${event.threadID}`;
  var id = event.senderID;
  var name = await Users.getNameUser(event.senderID);

  var tl = [
    "Hello darling! 🥰 Want some cute DPs? Type: .girldp / .cpldp / .frnddp / .boydp / .bestiedp",
    "Hey sweetie! 😊 I'm here! Want some delicious Biryani? 🥗 Type: Biryani",
    "Hi honey! 🌸 Want some crunchy Mungfali? 🥜 Type: Mungfali",
    "Hello beautiful! 💖 Want some sweet Milk Cake? Type: Milk cake",
    "Hey cutie! 🍪 Want some yummy Laddu? Type: Laddu",
    "Hi darling! 🫓 Want some tasty Kurkure? Type: Kurkure",
    "Hello sweetheart! 🥤 Want some refreshing Cold Drink? Type: Cold drink",
    "Hey lovely! 🥔 Want some crispy Chips? Type: Chips",
    "Hi angel! 💧 Want some fresh Water? Type: Pani",
    "Hello princess! 🍬 Want some sweet Toffee? Type: Toffee",
    "Hey gorgeous! 🧀 Want some delicious Barfi? Type: Barfi",
    "Hi beautiful! 🍔 Want a tasty Burger? Type: Burger",
    "Hello darling! 🚬 Want a Cigarette? Type: Cigarette",
    "Hey sweetie! 🏺 Want to try Hukka? Type: Hukka",
    "Hi honey! 🍨 Want some Ice Cream? Type: Ice Cream",
    "Hello cutie! 🍜 Want some Chowmin? Type: Chowmin",
    "Hey lovely! 💝 Need some help? Just ask me! - Marina Khan",
    "Hi angel! 🍝 Want some Maggie? Type: Maggie",
    "Hello princess! 🎂 Want some Cake? Type: Cake",
    "Hey gorgeous! 🥨 Want some Jalebi? Type: Jalebi",
    "Hi beautiful! 🍟 Want some French fries? Type: French",
    "Hello darling! 🧃 Want some Juice? Type: Juice",
    "Hey sweetie! 🍻 Want some Daru? Type: Daru",
    "Hi honey! ☕ Want some Chai? Type: Chai",
    "Hello cutie! 🥘 Want some Biskut? Type: Biskut",
    "Hey lovely! 😋 Want some Golgappe? Type: Golgappe",
    "Hi angel! 🥐 Want some Pasta? Type: Pasta",
    "Hello princess! 🍡 Want some Rasgulla? Type: Rasgulla",
    "Hey gorgeous! 🍮 Want some Gulabjamun? Type: Gulabjamun",
    "Hi beautiful! 🍽️ Want some Nasta? Type: Nasta",
    "Hello darling! 🔶 Want some Samosa? Type: Samosa",
    "Hey sweetie! 🍕 Want some Pizza? Type: Pizza",
    "Hi honey! 🥟 Want some Momos? Type: Momos",
    "Hello cutie! 🍫 Want some Chocolate? Type: Chocolate",
    "Hey lovely! 🫓 Want some Chhole Bhature? Type: Bhatura",
    "Hi angel! 🐔 Want some Chicken? Type: Murga",
    "Hello princess! ☕ Want some Coffee? Type: Coffee",
    "Hey gorgeous! 🥤 Want some Pepsi? Type: Pepsi",
    "Hi beautiful! 🥞 Want some Parathe? Type: Parathe",
    "Hello darling! 🍿 Want some Popcorn? Type: Popcorn",
    "Hey sweetie! 🥛 Want some Dudh? Type: Dudh",
    "Hi honey! 🧋 Want some Lassi? Type: Lassi",
    "Hello cutie! 🍭 Want some Lolipop? Type: lolipop",
    "Hey lovely! 🌹 Want a Rose? Type: Rose"
  ];
  
  var rand = tl[Math.floor(Math.random() * tl.length)];

  // Auto Photo Reply Feature - When someone replies to any message
  if (event.type === "message_reply") {
    try {
      const replyMessage = event.messageReply;
      
      // Send random DP/Photo when someone replies
      const photos = [
        "https://i.imgur.com/8JZ7Q2a.jpg", // Cute girl DP 1
        "https://i.imgur.com/3JZ8Q3b.jpg", // Cute girl DP 2
        "https://i.imgur.com/5JZ9Q4c.jpg", // Cute girl DP 3
        "https://i.imgur.com/7JZ0Q5d.jpg", // Cute girl DP 4
        "https://i.imgur.com/9JZ1Q6e.jpg", // Cute girl DP 5
        "https://i.imgur.com/2JZ2Q7f.jpg", // Cute girl DP 6
        "https://i.imgur.com/4JZ3Q8g.jpg", // Cute girl DP 7
        "https://i.imgur.com/6JZ4Q9h.jpg", // Cute girl DP 8
        "https://i.imgur.com/1JZ5Q0i.jpg", // Cute girl DP 9
        "https://i.imgur.com/0JZ6Q1j.jpg"  // Cute girl DP 10
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
        "https://i.imgur.com/XJZ7Q2a.jpg", // Marina DP 1
        "https://i.imgur.com/YJZ8Q3b.jpg", // Marina DP 2
        "https://i.imgur.com/ZJZ9Q4c.jpg"  // Marina DP 3
      ];
      
      const marinaPhoto = marinaPhotos[Math.floor(Math.random() * marinaPhotos.length)];
      
      var msg = {
        body: `🌸💖✨ ${name} ✨💖🌸\n\n${rand}\n\n💝 𝐁𝐲: 𝐌𝐚𝐫𝐢𝐧𝐚 𝐊𝐡𝐚𝐧 🎀\n✨ 𝐘𝐨𝐮𝐫 𝐂𝐮𝐭𝐞 𝐀𝐈 𝐆𝐢𝐫𝐥 𝐁𝐨𝐭`,
        attachment: await global.utils.getStreamFromURL(marinaPhoto)
      }
      return api.sendMessage(msg, threadID, messageID);
    } catch (error) {
      // Fallback to text only
      var msg = {
        body: `🌸💖✨ ${name} ✨💖🌸\n\n${rand}\n\n💝 𝐁𝐲: 𝐌𝐚𝐫𝐢𝐧𝐚 𝐊𝐡𝐚𝐧 🎀\n✨ 𝐘𝐨𝐮𝐫 𝐂𝐮𝐭𝐞 𝐀𝐈 𝐆𝐢𝐫𝐥 𝐁𝐨𝐭`
      }
      return api.sendMessage(msg, threadID, messageID);
    }
  };

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
        "https://i.imgur.com/DJZ7Q2a.jpg", // Love DP 1
        "https://i.imgur.com/EJZ8Q3b.jpg", // Love DP 2
        "https://i.imgur.com/FJZ9Q4c.jpg"  // Love DP 3
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
        "https://i.imgur.com/GJZ7Q2a.jpg", // Night DP 1
        "https://i.imgur.com/HJZ8Q3b.jpg", // Night DP 2
        "https://i.imgur.com/IJZ9Q4c.jpg"  // Night DP 3
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
        "https://i.imgur.com/JJZ7Q2a.jpg", // Morning DP 1
        "https://i.imgur.com/KJZ8Q3b.jpg", // Morning DP 2
        "https://i.imgur.com/LJZ9Q4c.jpg"  // Morning DP 3
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
}
