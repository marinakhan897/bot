const axios = require('axios');

module.exports = {
    command: 'ai',
    description: '🤖 Generate AI Images',
    execute: async (args, event, time) => {
        const prompt = args.join(' ');
        
        if (!prompt) {
            return '❌ Prompt diye bina. Usage: !ai <your prompt description>';
        }

        try {
            // Using a free AI image generation API
            const response = await axios.post('https://api.ideogram.ai/generate', {
                prompt: prompt,
                style: 'photorealistic',
                size: '1024x1024'
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.IDEOGRAM_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data && response.data.image_url) {
                await event.reply({
                    body: `🤖 AI Generated Image\n📝 Prompt: ${prompt}\n🕒 Time: ${time}`,
                    attachment: await global.utils.getStreamFromURL(response.data.image_url)
                });
                return null;
            } else {
                return '❌ AI image generate nahi ho saki';
            }

        } catch (error) {
            return `❌ AI generation error: ${error.message}`;
        }
    }
};
