module.exports = {
  config: {
    name: "quran",
    version: "1.0.0",
    author: "Marina Khan", 
    countDown: 5,
    role: 0,
    description: "Read Quran verses safely",
    category: "islamic",
    guide: {
      en: "{pn} [surah] [verse]\nEx: .quran 1 | .quran 2 1-5 | .quran list"
    }
  },

  onStart: async function({ api, event, args }) {
    const { threadID, messageID } = event;

    if (!args[0] || args[0] === 'list') {
      return this.showSurahList(api, event);
    }

    const surahNum = parseInt(args[0]);
    if (surahNum < 1 || surahNum > 114) {
      return api.sendMessage("❌ Surah number must be 1-114", threadID, messageID);
    }
    await this.showSurah(api, event, surahNum, args[1]);
  },

  showSurahList: async function(api, event) {
    const message = 
      "📖 Quran Surahs (1-114)\n\n" +
      "1. Al-Fatihah\n2. Al-Baqarah\n3. Al-Imran\n36. Yaseen\n55. Ar-Rahman\n" +
      "67. Al-Mulk\n112. Al-Ikhlas\n113. Al-Falaq\n114. An-Nas\n\n" +
      "💡 Use: .quran [surah] [verses]\n" +
      "Ex: .quran 1 | .quran 2 1-5 | .quran 36";
    
    api.sendMessage(message, event.threadID, event.messageID);
  },

  showSurah: async function(api, event, surahNum, verseRange) {
    const surahData = this.getSurahData(surahNum);
    
    if (!surahData) {
      return api.sendMessage("❌ Surah not available", event.threadID, event.messageID);
    }

    let versesToShow = surahData.verses;
    
    // Handle verse range
    if (verseRange && verseRange.includes('-')) {
      const rangeParts = verseRange.split('-');
      const start = parseInt(rangeParts[0]);
      const end = parseInt(rangeParts[1]);
      
      if (start && end && start > 0 && end <= versesToShow.length && start <= end) {
        versesToShow = versesToShow.slice(start - 1, end);
      }
    }

    let message = `📖 ${surahData.name}\nSurah ${surahNum} | ${surahData.verses.length} verses\n\n`;
    
    versesToShow.forEach(verse => {
      message += `${verse}\n\n`;
    });
    
    if (versesToShow.length < surahData.verses.length) {
      message += `📚 Use: .quran ${surahNum} ${versesToShow.length + 1}-${surahData.verses.length} for more`;
    }

    api.sendMessage(message, event.threadID, event.messageID);
  },

  getSurahData: function(surahNum) {
    const allSurahs = {
      1: {
        name: "Al-Fatihah - The Opening",
        verses: [
          "1. بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nIn the name of Allah, the Most Gracious, the Most Merciful.",
          "2. الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ\nAll praise is due to Allah, Lord of the worlds.",
          "3. الرَّحْمَٰنِ الرَّحِيمِ\nThe Most Gracious, the Most Merciful.",
          "4. مَالِكِ يَوْمِ الدِّينِ\nMaster of the Day of Judgment.",
          "5. إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ\nYou alone we worship, and You alone we ask for help.",
          "6. اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ\nGuide us to the straight path.",
          "7. صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ\nThe path of those You have blessed, not of those with anger, nor of those who are astray."
        ]
      },
      2: {
        name: "Al-Baqarah - The Cow",
        verses: [
          "1. الم\nAlif, Lam, Meem.",
          "2. ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ\nThis is the Book about which there is no doubt, a guidance for the righteous.",
          "3. الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ\nWho believe in the unseen, establish prayer, and spend from what We have provided.",
          "4. وَالَّذِينَ يُؤْمِنُونَ بِمَا أُنزِلَ إِلَيْكَ وَمَا أُنزِلَ مِن قَبْلِكَ وَبِالْآخِرَةِ هُمْ يُوقِنُونَ\nAnd who believe in what has been revealed to you and what was revealed before you.",
          "5. أُولَٰئِكَ عَلَىٰ هُدًى مِّن رَّبِّهِمْ ۖ وَأُولَٰئِكَ هُمُ الْمُفْلِحُونَ\nThose are upon guidance from their Lord, and it is those who are the successful."
        ]
      },
      36: {
        name: "Yaseen",
        verses: [
          "1. يس\nYa, Seen.",
          "2. وَالْقُرْآنِ الْحَكِيمِ\nBy the wise Qur'an.",
          "3. إِنَّكَ لَمِنَ الْمُرْسَلِينَ\nIndeed you, [O Muhammad], are from among the messengers.",
          "4. عَلَىٰ صِرَاطٍ مُّسْتَقِيمٍ\nOn a straight path.",
          "5. تَنزِيلَ الْعَزِيزِ الرَّحِيمِ\n[This is] a revelation of the Exalted in Might, the Merciful."
        ]
      },
      55: {
        name: "Ar-Rahman - The Beneficent", 
        verses: [
          "1. الرَّحْمَٰنُ\nThe Most Merciful",
          "2. عَلَّمَ الْقُرْآنَ\nTaught the Qur'an,",
          "3. خَلَقَ الْإِنسَانَ\nCreated man,",
          "4. عَلَّمَهُ الْبَيَانَ\n[And] taught him eloquence."
        ]
      },
      67: {
        name: "Al-Mulk - The Sovereignty",
        verses: [
          "1. تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ\nBlessed is He in whose hand is dominion, and He is over all things competent.",
          "2. الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ\n[He] who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving."
        ]
      },
      112: {
        name: "Al-Ikhlas - The Sincerity",
        verses: [
          "1. قُلْ هُوَ اللَّهُ أَحَدٌ\nSay, 'He is Allah, [who is] One.'",
          "2. اللَّهُ الصَّمَدُ\nAllah, the Eternal Refuge.",
          "3. لَمْ يَلِدْ وَلَمْ يُولَدْ\nHe neither begets nor is born.",
          "4. وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ\nNor is there to Him any equivalent.'"
        ]
      },
      113: {
        name: "Al-Falaq - The Daybreak",
        verses: [
          "1. قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ\nSay, 'I seek refuge in the Lord of daybreak.'",
          "2. مِن شَرِّ مَا خَلَقَ\nFrom the evil of that which He created.'",
          "3. وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ\nAnd from the evil of darkness when it settles.'",
          "4. وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ\nAnd from the evil of the blowers in knots.'",
          "5. وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ\nAnd from the evil of an envier when he envies.'"
        ]
      },
      114: {
        name: "An-Nas - Mankind",
        verses: [
          "1. قُلْ أَعُوذُ بِرَبِّ النَّاسِ\nSay, 'I seek refuge in the Lord of mankind.'",
          "2. مَلِكِ النَّاسِ\nThe Sovereign of mankind.'",
          "3. إِلَٰهِ النَّاسِ\nThe God of mankind.'",
          "4. مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ\nFrom the evil of the retreating whisperer.'",
          "5. الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ\nWho whispers [evil] into the breasts of mankind.'",
          "6. مِنَ الْجِنَّةِ وَالنَّاسِ\nFrom among the jinn and mankind.'"
        ]
      }
    };

    return allSurahs[surahNum];
  }
};
