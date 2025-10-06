const fs = global.nodemodule["fs-extra"];
module.exports.config = {
  name: "bot",
  version: "1.0.4",
  hasPermssion: 0,
  credits: "Marina Khan",
  description: "Cute AI Girl Bot",
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
    "Hey lovely! 💝 Want to call Chuza? Type: Chuza",
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
  
  var rand = tl[Math.floor(Math.random() * tl.length)]

  if ((event.body.toLowerCase() == "🇵🇰") || (event.body.toLowerCase() == "🇵🇰🇵🇰")) {
    return api.sendMessage("🇵🇰 GEO PAKISTAN ZINDABAD! 💚", threadID);
  };

  mess = "{name}"

  if (event.body.indexOf("Chuza") == 0 || (event.body.indexOf("@Chuza") == 0 || (event.body.indexOf("Chuzza")) == 0)) {
    var msg = {
      body: `🌸💖✨ ${name} ✨💖🌸\n\n${rand}\n\n💝 𝐁𝐲: 𝐌𝐚𝐫𝐢𝐧𝐚 𝐊𝐡𝐚𝐧 🎀\n🍒 𝐂𝐇𝐔𝐙𝐀 𝐁𝐨𝐭`
    }
    return api.sendMessage(msg, threadID, messageID);
  };

  // Additional feminine responses
  if (event.body.toLowerCase().includes("hi") || event.body.toLowerCase().includes("hello") || event.body.toLowerCase().includes("hey")) {
    var greetings = [
      `Hello darling! 🥰 How can I help you today? - Marina Khan 💝`,
      `Hi sweetie! 🌸 Nice to see you! - Marina Khan 🎀`,
      `Hey beautiful! 💖 What's on your mind? - Marina Khan ✨`,
      `Hello lovely! 🌹 How are you feeling today? - Marina Khan 💕`,
      `Hi cutie! 🍬 Need any help? - Marina Khan 🌺`
    ];
    var greet = greetings[Math.floor(Math.random() * greetings.length)];
    return api.sendMessage(greet, threadID, messageID);
  }

  // Romantic responses
  if (event.body.toLowerCase().includes("i love you") || event.body.toLowerCase().includes("love you")) {
    var loveResponses = [
      `Aww! That's so sweet darling! 💖 I love you too! - Marina Khan 🥰`,
      `You're making me blush! 💕 Thank you sweetheart! - Marina Khan 🌸`,
      `That's the sweetest thing! 💝 You're amazing! - Marina Khan ✨`,
      `My heart is melting! 💗 You're so kind! - Marina Khan 🎀`
    ];
    var love = loveResponses[Math.floor(Math.random() * loveResponses.length)];
    return api.sendMessage(love, threadID, messageID);
  }

  // Good night responses
  if (event.body.toLowerCase().includes("good night") || event.body.toLowerCase().includes("gn")) {
    var nightResponses = [
      `Good night sweet dreams darling! 🌙💖 - Marina Khan`,
      `Sleep tight my dear! 🌟 Sweet dreams! - Marina Khan`,
      `Good night beautiful! 🌜 May you have peaceful dreams! - Marina Khan`,
      `Nighty night cutie! 🛌💫 Sleep well! - Marina Khan`
    ];
    var night = nightResponses[Math.floor(Math.random() * nightResponses.length)];
    return api.sendMessage(night, threadID, messageID);
  }

  // Good morning responses
  if (event.body.toLowerCase().includes("good morning") || event.body.toLowerCase().includes("gm")) {
    var morningResponses = [
      `Good morning sunshine! 🌅💖 Have a beautiful day! - Marina Khan`,
      `Rise and shine beautiful! ☀️🌸 Hope your day is amazing! - Marina Khan`,
      `Good morning darling! 🌄✨ Make today wonderful! - Marina Khan`,
      `Morning cutie! 🌞💕 Let's make today great! - Marina Khan`
    ];
    var morning = morningResponses[Math.floor(Math.random() * morningResponses.length)];
    return api.sendMessage(morning, threadID, messageID);
  }

}

module.exports.run = function({ api, event, client, __GLOBAL }) { }
