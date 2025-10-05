const { createCanvas, loadImage } = require('canvas');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

module.exports = {
    config: {
        name: "glassdp",
        version: "2.0.0", 
        role: 0,
        author: "Marina Khan",
        category: "design",
        description: "Glass effect name editing with PNG overlays",
        guide: "{pn} [name] - Reply to any image",
        countDown: 5
    },

    onStart: async function({ api, event, args }) {
        try {
            if (!event.messageReply) {
                return api.sendMessage("✨ **GLASS DP EDITOR** ✨\n\nPlease REPLY to any image/DP!\n\nExample: Reply to image & type:\n!glassdp Marina", event.threadID);
            }

            const name = args.join(' ') || "User";
            
            let imageUrl;
            if (event.messageReply.attachments && event.messageReply.attachments[0]) {
                imageUrl = event.messageReply.attachments[0].url;
            } else {
                return api.sendMessage("❌ No image found in reply!", event.threadID);
            }

            console.log("Processing glass effect for:", name);
            
            // Create temp folder
            const tempDir = path.join(__dirname, '../temp');
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }
            
            api.sendMessage("🔮 Creating Glass Effect DP...", event.threadID);
            
            const response = await axios.get(imageUrl, { 
                responseType: 'arraybuffer',
                timeout: 30000 
            });
            
            const img = await loadImage(Buffer.from(response.data));
            const canvas = createCanvas(img.width, img.height);
            const ctx = canvas.getContext('2d');
            
            // Draw original image with blur effect
            ctx.drawImage(img, 0, 0, img.width, img.height);
            
            // Apply blur to background for glass effect
            ctx.globalAlpha = 0.3;
            ctx.filter = 'blur(10px)';
            ctx.drawImage(img, 0, 0, img.width, img.height);
            ctx.filter = 'none';
            ctx.globalAlpha = 1.0;

            // **GLASS MORPH EFFECT BACKGROUND**
            const centerX = img.width / 2;
            const centerY = img.height / 2;
            const glassWidth = Math.min(img.width * 0.8, 600);
            const glassHeight = Math.min(img.height * 0.4, 200);

            // Glass rectangle with gradient
            const glassGradient = ctx.createLinearGradient(centerX - glassWidth/2, centerY, centerX + glassWidth/2, centerY);
            glassGradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
            glassGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.4)');
            glassGradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');

            // Draw glass background
            ctx.fillStyle = glassGradient;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.lineWidth = 2;
            
            // Rounded glass rectangle
            ctx.beginPath();
            ctx.roundRect(centerX - glassWidth/2, centerY - glassHeight/2, glassWidth, glassHeight, 20);
            ctx.fill();
            ctx.stroke();

            // **GLASS TEXT EFFECT**
            const fontSize = Math.min(glassWidth / (name.length * 0.6), 80);
            ctx.font = `bold ${fontSize}px 'Arial'`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Text shadow for depth
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;

            // Text stroke (glass border)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 3;
            ctx.strokeText(name, centerX, centerY);

            // Main glass text with gradient
            const textGradient = ctx.createLinearGradient(
                centerX - ctx.measureText(name).width/2, 
                centerY - fontSize/2, 
                centerX + ctx.measureText(name).width/2, 
                centerY + fontSize/2
            );
            textGradient.addColorStop(0, '#ffffff');
            textGradient.addColorStop(0.3, '#e6f3ff');
            textGradient.addColorStop(0.7, '#cce7ff');
            textGradient.addColorStop(1, '#ffffff');

            ctx.fillStyle = textGradient;
            ctx.fillText(name, centerX, centerY);

            // Remove shadow for other elements
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

            // **ADD DECORATIVE GLASS ELEMENTS**

            // Glass bubbles/particles
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            for (let i = 0; i < 15; i++) {
                const radius = Math.random() * 10 + 5;
                const bubbleX = centerX - glassWidth/2 + Math.random() * glassWidth;
                const bubbleY = centerY - glassHeight/2 + Math.random() * glassHeight;
                
                ctx.beginPath();
                ctx.arc(bubbleX, bubbleY, radius, 0, Math.PI * 2);
                ctx.fill();
                
                // Bubble highlight
                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.beginPath();
                ctx.arc(bubbleX - radius/3, bubbleY - radius/3, radius/3, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            }

            // Glass reflection lines
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 1;
            for (let i = 0; i < 3; i++) {
                const lineY = centerY - glassHeight/2 + (i * glassHeight/3);
                ctx.beginPath();
                ctx.moveTo(centerX - glassWidth/2, lineY);
                ctx.lineTo(centerX + glassWidth/2, lineY);
                ctx.stroke();
            }

            // **ADD CORNER DECORATIONS**
            const cornerSize = Math.min(img.width, img.height) / 15;
            
            // Top-left corner
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(50, 50);
            ctx.lineTo(50 + cornerSize, 50);
            ctx.lineTo(50, 50 + cornerSize);
            ctx.stroke();

            // Top-right corner
            ctx.beginPath();
            ctx.moveTo(img.width - 50, 50);
            ctx.lineTo(img.width - 50 - cornerSize, 50);
            ctx.lineTo(img.width - 50, 50 + cornerSize);
            ctx.stroke();

            // Bottom-left corner
            ctx.beginPath();
            ctx.moveTo(50, img.height - 50);
            ctx.lineTo(50, img.height - 50 - cornerSize);
            ctx.lineTo(50 + cornerSize, img.height - 50);
            ctx.stroke();

            // Bottom-right corner
            ctx.beginPath();
            ctx.moveTo(img.width - 50, img.height - 50);
            ctx.lineTo(img.width - 50, img.height - 50 - cornerSize);
            ctx.lineTo(img.width - 50 - cornerSize, img.height - 50);
            ctx.stroke();

            // Save image
            const tempPath = path.join(tempDir, `glass_dp_${Date.now()}.png`);
            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(tempPath, buffer);

            // Send result
            await api.sendMessage({
                body: `✨ **GLASS DP EDITOR** ✨\n\n📝 Name: ${name}\n🎨 Effect: Glass Morphism\n💎 Style: Premium Center Design\n\n✅ Glass effect successfully applied!`,
                attachment: fs.createReadStream(tempPath)
            }, event.threadID);

            // Cleanup
            setTimeout(() => {
                try {
                    if (fs.existsSync(tempPath)) {
                        fs.unlinkSync(tempPath);
                    }
                } catch (cleanupError) {
                    console.log("Cleanup error:", cleanupError.message);
                }
            }, 10000);

        } catch (error) {
            console.error("Glass DP error:", error);
            api.sendMessage(`❌ Glass effect failed: ${error.message}`, event.threadID);
        }
    }
};
