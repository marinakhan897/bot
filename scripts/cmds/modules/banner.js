const { createCanvas, loadImage } = require('canvas');

module.exports = {
    command: 'banner',
    description: '🖼️ Create Social Media Banners',
    execute: async (args, event, time) => {
        const platform = args[0]?.toLowerCase();
        const text = args.slice(1).join(' ');

        if (!text) {
            return '❌ Banner text diye bina. Usage: !banner <platform> "Your Text"';
        }

        let width, height;
        let urduMessage = '';

        // Platform dimensions
        switch (platform) {
            case 'youtube':
                width = 2560; height = 1440;
                urduMessage = '✅ YouTube banner ready';
                break;
            case 'facebook':
                width = 1200; height = 630;
                urduMessage = '✅ Facebook cover ready';
                break;
            case 'twitter':
                width = 1500; height = 500;
                urduMessage = '✅ Twitter header ready';
                break;
            case 'instagram':
                width = 1080; height = 1080;
                urduMessage = '✅ Instagram post ready';
                break;
            case 'linkedin':
                width = 1584; height = 396;
                urduMessage = '✅ LinkedIn banner ready';
                break;
            case 'twitch':
                width = 1920; height = 1080;
                urduMessage = '✅ Twitch overlay ready';
                break;
            default:
                return `❌ Platform "${platform}" support nahi hai.\n` +
                       `📱 Available: youtube, facebook, twitter, instagram, linkedin, twitch`;
        }

        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        // Gradient background
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Text styling
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.min(width, height) / 10}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Add text
        ctx.fillText(text, width / 2, height / 2);

        const buffer = canvas.toBuffer('image/png');
        
        await event.reply({
            body: `${urduMessage}\n📝 Text: ${text}\n📱 Platform: ${platform}\n🕒 Time: ${time}`,
            attachment: buffer
        });

        return null;
    }
};
