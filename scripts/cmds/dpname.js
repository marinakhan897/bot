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
            // Check reply
            if (!event.messageReply) {
                return api.sendMessage("⚠️ Please REPLY to an image first!", event.threadID);
            }

            const name = args.join(' ') || "User";
            
            // Get image URL from reply
            let imageUrl;
            if (event.messageReply.attachments && event.messageReply.attachments[0]) {
                imageUrl = event.messageReply.attachments[0].url;
            } else {
                return api.sendMessage("❌ No image found in reply!", event.threadID);
            }

            console.log("Using image URL:", imageUrl);
            
            // ✅ CREATE TEMP FOLDER IF NOT EXISTS
            const tempDir = path.join(__dirname, '../temp');
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
                console.log("✅ Temp folder created:", tempDir);
            }
            
            // Download and process image
            api.sendMessage("🔄 Processing your DP...", event.threadID);
            
            const response = await axios.get(imageUrl, { 
                responseType: 'arraybuffer',
                timeout: 30000 
            });
            
            const img = await loadImage(Buffer.from(response.data));
            
            const canvas = createCanvas(img.width, img.height);
            const ctx = canvas.getContext('2d');
            
            // Draw original image
            ctx.drawImage(img, 0, 0, img.width, img.height);

            // ✅ PREMIUM TEXT STYLING
            const fontSize = Math.min(img.width, img.height) / 10;
            
            // Text background for readability
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            const textWidth = ctx.measureText(name).width;
            const bgHeight = fontSize + 20;
            ctx.fillRect(
                (img.width - textWidth) / 2 - 15, 
                img.height - bgHeight - 10, 
                textWidth + 30, 
                bgHeight
            );

            // Text styling
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.fillStyle = '#FFFFFF';
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 3;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const x = img.width / 2;
            const y = img.height - fontSize - 10;

            // Add text with effects
            ctx.strokeText(name, x, y);
            ctx.fillText(name, x, y);

            // ✅ SAVE IMAGE
            const tempPath = path.join(tempDir, `dp_${Date.now()}.png`);
            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(tempPath, buffer);

            console.log("✅ Image saved at:", tempPath);

            // Send result
            await api.sendMessage({
                body: `✨ **DP NAME EDITOR**\n\n📝 Name: ${name}\n✅ Successfully added to your DP!`,
                attachment: fs.createReadStream(tempPath)
            }, event.threadID);

            // ✅ CLEANUP AFTER 10 SECONDS
            setTimeout(() => {
                try {
                    if (fs.existsSync(tempPath)) {
                        fs.unlinkSync(tempPath);
                        console.log("✅ Temporary file cleaned up");
                    }
                } catch (cleanupError) {
                    console.log("⚠️ Cleanup error:", cleanupError.message);
                }
            }, 10000);

        } catch (error) {
            console.error("❌ Main error:", error);
            api.sendMessage(`❌ Error: ${error.message}`, event.threadID);
        }
    }
};
