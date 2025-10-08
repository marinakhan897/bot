const { createCanvas, registerFont } = require('canvas');
const sharp = require('sharp');

module.exports = {
    command: 'logo',
    description: '🎯 Create Professional Logos',
    execute: async (args, event, time) => {
        const style = args[0]?.toLowerCase();
        const text = args.slice(1).join(' ');

        if (!text) {
            return '❌ Logo text diye bina. Usage: !logo <style> "Your Text"';
        }

        const width = 800;
        const height = 400;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext('2d');

        let urduMessage = '';

        // 🎨 Logo Styles
        switch (style) {
            case 'modern':
                ctx.fillStyle = '#2c3e50';
                ctx.fillRect(0, 0, width, height);
                
                ctx.fillStyle = '#3498db';
                ctx.font = 'bold 60px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(text, width/2, height/2 + 20);
                urduMessage = '✅ Modern logo ban gaya';
                break;

            case 'minimal':
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, width, height);
                
                ctx.strokeStyle = '#2c3e50';
                ctx.lineWidth = 3;
                ctx.strokeRect(50, 50, width-100, height-100);
                
                ctx.fillStyle = '#2c3e50';
                ctx.font = '40px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(text, width/2, height/2 + 10);
                urduMessage = '✅ Minimal logo tayyar hai';
                break;

            case 'vintage':
                ctx.fillStyle = '#8b4513';
                ctx.fillRect(0, 0, width, height);
                
                ctx.fillStyle = '#daa520';
                ctx.font = 'italic bold 50px Times New Roman';
                ctx.textAlign = 'center';
                ctx.fillText(text, width/2, height/2 + 15);
                urduMessage = '✅ Vintage style logo complete';
                break;

            case 'tech':
                ctx.fillStyle = '#000000';
                ctx.fillRect(0, 0, width, height);
                
                ctx.fillStyle = '#00ff00';
                ctx.font = 'bold 55px Courier New';
                ctx.textAlign = 'center';
                ctx.fillText(text, width/2, height/2 + 20);
                urduMessage = '✅ Tech logo ready hai';
                break;

            case 'luxury':
                ctx.fillStyle = '#1a1a1a';
                ctx.fillRect(0, 0, width, height);
                
                // Gold gradient effect
                const gradient = ctx.createLinearGradient(0, 0, width, height);
                gradient.addColorStop(0, '#ffd700');
                gradient.addColorStop(1, '#daa520');
                
                ctx.fillStyle = gradient;
                ctx.font = 'bold 65px Georgia';
                ctx.textAlign = 'center';
                ctx.fillText(text, width/2, height/2 + 25);
                urduMessage = '✅ Luxury logo ban gaya';
                break;

            default:
                return `❌ Logo style "${style}" nahi mila.\n` +
                       `🎨 Available: modern, minimal, vintage, tech, luxury`;
        }

        const buffer = canvas.toBuffer('image/png');
        
        await event.reply({
            body: `${urduMessage}\n📝 Text: ${text}\n🎨 Style: ${style}\n🕒 Time: ${time}`,
            attachment: buffer
        });

        return null;
    }
};
