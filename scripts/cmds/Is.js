module.exports = {
    config: {
        name: "islamic",
        version: "1.0",
        author: "Marina",
        countDown: 3,
        role: 0,
        description: {
            en: "Islamic greetings and knowledge auto-replies"
        },
        category: "islamic"
    },

    onChat: async function ({ api, event }) {
        const message = event.body?.toLowerCase().trim();
        if (!message) return;

        const islamicReplies = {
            // Islamic Greetings
            'assalamualaikum': '🕌 Wa Alaikum Assalam Wa Rahmatullahi Wa Barakatuh 🌙\nMay peace, mercy, and blessings of Allah be upon you!',
            'salam': '🤲 Wa Alaikum Assalam! May Allah\'s peace be with you!',
            'as salam alaikum': '🌙 Wa Alaikum Assalam Warahmatullahi Wabarakatuh!',
            
            // Allah's Names & Attributes
            'allah': '🤲 Allah is Ar-Rahman (The Most Merciful), Ar-Raheem (The Most Compassionate). He is the Creator of all things!',
            'subhanallah': '💫 Subhanallah! Glory be to Allah! The Perfect, The Pure!',
            'alhamdulillah': '🙏 Alhamdulillah! All praise and thanks belong to Allah alone!',
            'allah hu akbar': '⚡ Allahu Akbar! Allah is the Greatest! Nothing is greater than Allah!',
            'masha allah': '🌟 Masha Allah! As Allah has willed! Beautiful and perfect!',
            
            // Prophet Muhammad (PBUH)
            'prophet muhammad': '🕋 Peace be upon him! The final Messenger of Allah, sent as mercy to all worlds!',
            'muhammad': '🌹 Peace and blessings be upon Prophet Muhammad (PBUH), the best of creation!',
            'rasulullah': '✨ Rasulullah (SAW) - The perfect example for all humanity!',
            
            // Quran & Islamic Terms
            'quran': '📖 Al-Quran is the eternal miracle, guidance for all humanity from Allah SWT!',
            'islam': '🕌 Islam means peace and submission to the will of Allah! The complete way of life!',
            'muslim': '🤲 A Muslim is one who submits to Allah and follows the teachings of Prophet Muhammad (PBUH)!',
            'iman': '💖 Iman is faith - believing in Allah, His angels, His books, His messengers, the Last Day, and Divine Decree!',
            
            // Prayer & Worship
            'prayer': '🕋 Salah (prayer) is the pillar of Islam! It connects us directly with Allah!',
            'namaz': '🤲 Namaz is the key to Paradise! The first thing we\'ll be asked about on Judgment Day!',
            'fasting': '🌙 Fasting in Ramadan teaches us self-control and brings us closer to Allah!',
            'zakah': '💰 Zakah purifies wealth and helps those in need! An obligation for every capable Muslim!',
            'hajj': '🕋 Hajj is the journey of a lifetime! Symbolizing unity and equality before Allah!',
            
            // Islamic Phrases
            'insha allah': '📅 Insha Allah! If Allah wills! We should always say this when planning for future!',
            'astaghfirullah': '😔 Astaghfirullah! I seek forgiveness from Allah! The door to repentance is always open!',
            'la ilaha illallah': '⚡ La ilaha illallah! There is no god but Allah! The foundation of faith!',
            'subhanallah': '💫 Subhanallah! How perfect Allah is! Free from all imperfections!',
            
            // Daily Duas
            'good morning': '🌅 Assalamualaikum! May Allah bless your day with barakah and success! 🤲',
            'good night': '🌙 Fi Amanillah! May Allah protect you through the night! Sweet dreams!',
            'thank you': '🙏 JazakAllah Khair! May Allah reward you with good!',
            'bye': '👋 Fi Amanillah! Go with the protection of Allah!',
            
            // Islamic Months & Events
            'ramadan': '🌙 Ramadan Mubarak! The month of Quran, forgiveness, and mercy! May Allah accept our fasts!',
            'eid': '🎉 Eid Mubarak! May Allah accept our good deeds and bless us all! Takbeer!',
            'muharram': '📅 Muharram Mubarak! The sacred month, beginning of Islamic year!',
            'hijri': '📆 The Hijri calendar reminds us of the Prophet\'s migration for Islam!'
        };

        // Check for matches
        for (const [trigger, response] of Object.entries(islamicReplies)) {
            if (message.includes(trigger)) {
                setTimeout(() => {
                    api.sendMessage(response, event.threadID);
                }, 800);
                break; // Only reply to first match
            }
        }
    }
};
