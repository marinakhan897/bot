module.exports = {
  config: {
    name: "font",
    version: "1.0.0",
    author: "Marina Khan", 
    countDown: 0,
    role: 0,
    description: "Text styling with different fonts",
    category: "creative",
    guide: {
      en: ".font [text]"
    }
  },

  onStart: async function({ api, event, args }) {
    if (!args[0]) {
      return api.sendMessage("❌ Please provide text to style!", event.threadID, event.messageID);
    }
    
    const text = args.join(" ");
    
    const fonts = {
      bold: this.toBold(text),
      small: this.toSmallCaps(text),
      bubble: this.toBubble(text)
    };
    
    let result = `🎨 Font Styles:\n\n`;
    result += `**𝐁𝐎𝐋𝐃**: ${fonts.bold}\n`;
    result += `🅂🄼🄰🄻🄻: ${fonts.small}\n`;
    result += 🅱🆄🅱🅱🅻🅴: ${fonts.bubble}\n`;
    
    api.sendMessage(result, event.threadID, event.messageID);
  },

  toBold: function(text) {
    const boldMap = {
      'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴',
      'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻',
      'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂',
      'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
      'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚',
      'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡',
      'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨',
      'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭'
    };
    
    return text.split('').map(char => boldMap[char] || char).join('');
  },

  toSmallCaps: function(text) {
    const smallMap = {
      'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ', 'f': 'ғ', 'g': 'ɢ',
      'h': 'ʜ', 'i': 'ɪ', 'j': 'ᴊ', 'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ',
      'o': 'ᴏ', 'p': 'ᴘ', 'q': 'ǫ', 'r': 'ʀ', 's': 's', 't': 'ᴛ', 'u': 'ᴜ',
      'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ'
    };
    
    return text.split('').map(char => smallMap[char] || char).join('');
  },

  toBubble: function(text) {
    const bubbleMap = {
      'a': '🅐', 'b': '🅑', 'c': '🅒', 'd': '🅓', 'e': '🅔', 'f': '🅕', 'g': '🅖',
      'h': '🅗', 'i': '🅘', 'j': '🅙', 'k': '🅚', 'l': '🅛', 'm': '🅜', 'n': '🅝',
      'o': '🅞', 'p': '🅟', 'q': '🅠', 'r': '🅡', 's': '🅢', 't': '🅣', 'u': '🅤',
      'v': '🅥', 'w': '🅦', 'x': '🅧', 'y': '🅨', 'z': '🅩'
    };
    
    return text.split('').map(char => bubbleMap[char] || char).join('');
  }
};
