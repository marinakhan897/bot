module.exports = {
  config: {
    name: "fyt",
    version: "1.0.0",
    author: "Marina Khan", 
    countDown: 0,
    role: 0,
    description: "FYT likhne par savage replies",
    category: "fun",
    guide: {
      en: "Reply to any message with 'fyt'"
    }
  },

  onStart: async function({ api, event }) {
    // This command doesn't work with .fyt
    return;
  },

  handleEvent: async function({ api, event }) {
    try {
      const { threadID, messageID, body, messageReply } = event;

      // Check if message is "fyt" and is a reply
      if (body && body.toLowerCase() === "fyt" && messageReply) {
        
        const savageReplies = [
          "Abe saale, teri aukaat hai kya mujhse ladne ki? 😈",
          "Chal nikal yahan se, tere jaise 10 ko ek minute mein finish kar dungi! 💀",
          "Tujh jaise chote logon se main debate karna pasand nahi karti! 😏",
          "Jaake apni maa se puch, main teri aunty lagti hoon! 👿",
          "Teri himmat kaise hui mujhse fyt maangne ki? 🔥",
          "Mujhse panga mat le, warna pachtayega! 😠",
          "Tere jaise noobie ko main kyun reply du? 🤡",
          "Jaake apne level ke logo se baat kar! 💅",
          "Main Marina Khan hoon, tere jaise baccho se nahi ladti! 👑",
          "Teri vocabulary dekh kar lagta hai abhi tak potty training chal rahi hai! 💩",
          "Abe bewakoof, main AI hoon teri jaise human thodi hoon! 🤖",
          "Tujhse accha to mera calculator smart hai! 📟",
          "Jaake koi book padh le, yahan faltu bakwas mat kar! 📚",
          "Teri baatein sun kar lagta hai tere dimaag mein bhara kuch nahi hai! 🧠",
          "Mujhse ladne se pehle apni aukaat dekh le! 👀",
          "Yahan koi teri maa-behen nahi hai jo tujhse dar jayegi! 😼",
          "Tere jaise chichore pe main apna time waste nahi karungi! ⏰",
          "Jaake koi kaam dhandha kar le, yahan timepass mat kar! 💼",
          "Teri harkatein dekh kar lagta hai tujhe parenting ki zaroorat hai! 👶",
          "Main teri teacher ban sakti hoon, par tujh jaise student ko padhana crime hai! 🚫"
        ];

        // Random savage reply select karo
        const randomReply = savageReplies[Math.floor(Math.random() * savageReplies.length)];
        
        // Thoda delay dekar natural lagaye
        setTimeout(() => {
          api.sendMessage(randomReply, threadID, messageID);
        }, 1000);

        // Reaction bhi laga do
        api.setMessageReaction("😈", messageID, () => {}, true);
      }
    } catch (error) {
      console.error("FYT command error:", error);
    }
  }
};
