const { createCanvas, loadImage } = require('canvas');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

module.exports = {
    config: {
        name: "dpname",
        version: "1.0.0", 
        role: 0,
        author: "Marina Khan", 
        category: "design",
        description: "DP pe name add karo",
        guide: "{pn} [name]",
        countDown: 5
    },

    onStart: async function({ api, event, args }) {
        try {
            // Simple check - agar reply hai to use karo
            if (!event.messageReply) {
                return api.sendMessage("⚠️ Please REPLY to an image first!", event.threadID);
            }

            const name = args.join(' ') || "User";
            
            // Direct URL access try karo
            let imageUrl;
            if (event.messageReply.attachments && event.messageReply.attachments[0]) {
                imageUrl = event.messageReply.attachments[0].url;
            } else if (event.messageReply.body && event.messageReply.body.includes('http')) {
                imageUrl = event.messageReply.body;
            } else {
                return api.sendMessage("❌ No image found in reply!", event.threadID);
            }

            console.log("Using image URL:", imageUrl);
            
            // Process image
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const img = await loadImage(Buffer.from(response.data));
            
            const canvas = createCanvas(img.width, img.height);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            // Add name
            const fontSize = Math.min(img.width, img.height) / 8;
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.fillStyle = '#FFFFFF';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 3;
            ctx.textAlign = 'center';
            
            const x = img.width / 2;
            const y = img.height - 50;
            
            ctx.strokeText(name, x, y);
            ctx.fillText(name, x, y);

            // Save and send
            const tempPath = path.join(__dirname, `../temp/dp_${Date.now()}.png`);
            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(tempPath, buffer);

            await api.sendMessage({
                body: `✅ ${name} added to DP!`,
                attachment: fs.createReadStream(tempPath)
            }, event.threadID);

            // Cleanup
            setTimeout(() => fs.unlinkSync(tempPath), 5000);

        } catch (error) {
            console.error(error);
            api.sendMessage(`❌ Error: ${error.message}`, event.threadID);
        }
    }
};
