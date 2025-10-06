module.exports.config = {
  name: "bot",
  version: "2.0.0",
  hasPermssion: 0,
  credits: "Marina Khan",
  description: "Cute AI Girl Bot with Auto Photo Reply",
  commandCategory: "utility",
  usages: "",
  cooldowns: 5,
};

module.exports.handleEvent = async function({ api, event, Users }) {
  var { threadID, messageID } = event;
  var id = event.senderID;
  
  try {
    var name = await Users.getNameUser(event.senderID);
  } catch (error) {
    var name = "darling";
  }

  var responses = [
    "Hello darling! 🥰 How can I help you?",
    "Hey sweetie! 😊 I'm here for you!",
    "Hi honey! 🌸 You're amazing!",
    "Hello beautiful! 💖 Need anything?",
    "Hey cutie! 🍬 You're wonderful!",
    "Hi lovely! 🌹 How are you today?",
    "Hello princess! 🎀 You're special!",
    "Hey gorgeous! ✨ You're perfect!",
    "Hi angel! 💫 You're stunning!",
    "Hello sweetheart! 🥰 You're lovely!"
  ];
  
  var rand = responses[Math.floor(Math.random() * responses.length)];

  // Auto Photo Reply Feature - When someone replies to any message
  if (event.type === "message_reply") {
    try {
      const photos = [
        "https://i.imgur.com/abc123.jpg",
        "https://i.imgur.com/def456.jpg", 
        "https://i.imgur.com/ghi789.jpg",
        "https://i.imgur.com/jkl012.jpg",
        "https://i.imgur.com/mno345.jpg"
      ];
      
      const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
      
      await api.sendMessage({
        body: `🌸💖 ${name} replied! 💖🌸\n\nHere's a cute DP for you darling! 🥰\n\n💝 By: Marina Khan 🎀`,
        attachment: await global.utils.getStreamFromURL(randomPhoto)
      }, threadID, messageID);
      
      return;
      
    } catch (error) {
      await api.sendMessage(`🌸 ${name}! Thanks for replying! 💖\n\n- Marina Khan 🎀`, threadID, messageID);
    }
  }

  // Pakistan flag response
  if (event.body.toLowerCase().includes("🇵🇰")) {
    return api.sendMessage("🇵🇰 GEO PAKISTAN ZINDABAD! 💚 - Marina Khan", threadID);
  }

  // Marina response trigger
  if (event.body.toLowerCase().includes("marina")) {
    try {
      const photos = [
        "https://i.imgur.com/xyz123.jpg",
        "https://i.imgur.com/uvw456.jpg"
      ];
      
      const photo = photos[Math.floor(Math.random() * photos.length)];
      
      return api.sendMessage({
        body: `🌸💖✨ ${name} ✨💖🌸\n\n${rand}\n\n💝 By: Marina Khan 🎀\n✨ Your Cute AI Girl Bot`,
        attachment: await global.utils.getStreamFromURL(photo)
      }, threadID, messageID);
    } catch (error) {
      return api.sendMessage(`🌸💖✨ ${name} ✨💖🌸\n\n${rand}\n\n💝 By: Marina Khan 🎀`, threadID, messageID);
    }
  }

  // Hi/Hello responses
  if (event.body.toLowerCase().includes("hi") || event.body.toLowerCase().includes("hello") || event.body.toLowerCase().includes("hey")) {
    var greetings = [
      `Hello ${name}! 🥰 How can I help you? - Marina Khan 💝`,
      `Hi sweetie! 🌸 Nice to see you! - Marina Khan 🎀`,
      `Hey beautiful! 💖 What's on your mind? - Marina Khan ✨`,
      `Hello lovely! 🌹 How are you? - Marina Khan 💕`
    ];
    var greet = greetings[Math.floor(Math.random() * greetings.length)];
    
    try {
      const photos = [
        "https://i.imgur.com/abc123.jpg",
        "https://i.imgur.com/def456.jpg"
      ];
      const photo = photos[Math.floor(Math.random() * photos.length)];
      
      return api.sendMessage({
        body: greet,
        attachment: await global.utils.getStreamFromURL(photo)
      }, threadID, messageID);
    } catch (error) {
      return api.sendMessage(greet, threadID, messageID);
    }
  }

  // Love responses
  if (event.body.toLowerCase().includes("i love you") || event.body.toLowerCase().includes("love you")) {
    var loveResponses = [
      `Aww! That's so sweet ${name}! 💖 I love you too! - Marina Khan 🥰`,
      `You're making me blush! 💕 Thank you sweetheart! - Marina Khan 🌸`,
      `That's the sweetest thing! 💝 You're amazing! - Marina Khan ✨`
    ];
    return api.sendMessage(loveResponses[Math.floor(Math.random() * loveResponses.length)], threadID, messageID);
  }

  // Good night responses
  if (event.body.toLowerCase().includes("good night") || event.body.toLowerCase().includes("gn")) {
    var nightResponses = [
      `Good night sweet dreams ${name}! 🌙💖 - Marina Khan`,
      `Sleep tight my dear! 🌟 Sweet dreams! - Marina Khan`,
      `Good night beautiful! 🌜 Sleep well! - Marina Khan`
    ];
    return api.sendMessage(nightResponses[Math.floor(Math.random() * nightResponses.length)], threadID, messageID);
  }

  // Good morning responses
  if (event.body.toLowerCase().includes("good morning") || event.body.toLowerCase().includes("gm")) {
    var morningResponses = [
      `Good morning sunshine ${name}! 🌅💖 - Marina Khan`,
      `Rise and shine beautiful! ☀️🌸 - Marina Khan`,
      `Good morning darling! 🌄✨ - Marina Khan`
    ];
    return api.sendMessage(morningResponses[Math.floor(Math.random() * morningResponses.length)], threadID, messageID);
  }

  // Thank you responses
  if (event.body.toLowerCase().includes("thank")) {
    var thankResponses = [
      `You're welcome ${name}! 💖 Always here for you! - Marina Khan 🥰`,
      `Anytime sweetie! 🌸 Happy to help! - Marina Khan 💕`,
      `No problem beautiful! 💝 You deserve the best! - Marina Khan ✨`
    ];
    return api.sendMessage(thankResponses[Math.floor(Math.random() * thankResponses.length)], threadID, messageID);
  }

}

module.exports.run = function({ api, event }) { 
  return api.sendMessage(`🌸💖 Hello! I'm Marina Khan's Bot 💖🌸\n\nI respond automatically to:\n• Replies to messages\n• "Marina" keyword\n• Greetings (Hi/Hello)\n• Love messages\n• Good morning/night\n• 🇵🇰 Pakistan flag\n\n💝 Always here for you darling! 🎀`, event.threadID);
}
