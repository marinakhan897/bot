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
        description: "Reply ki DP pe perfect name editing with PNGs",
        guide: "{pn} [name] - Reply to a DP",
        countDown: 5
    },

    onStart: async function({ api, event, args }) {
        try {
            console.log("Command started...");
            
            // Check if user replied to a message
            if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
                return api.sendMessage("❌ Please reply to a DP/image to add name!", event.threadID);
            }

            const attachment = event.messageReply.attachments[0];
            if (!attachment.type || !attachment.type.includes("image")) {
                return api.sendMessage("❌ Please reply to an image only!", event.threadID);
            }

            if (args.length === 0) {
                return api.sendMessage("✨ Please provide a name!\nExample: !dpname Marina", event.threadID);
            }

            const name = args.join(' ');
            console.log("Processing name:", name);
            console.log("Image URL:", attachment.url);
            
            await generateNameDP(api, event, attachment.url, name);

        } catch (error) {
            console.error("Main error:", error);
            api.sendMessage(`❌ Error: ${error.message}`, event.threadID);
        }
    }
};

async function generateNameDP(api, event, imageUrl, name) {
    try {
        api.sendMessage(`🎨 Editing DP with "${name}"...`, event.threadID);
        console.log("Starting DP generation...");

        const dpPath = await addNameToDP(imageUrl, name);
        console.log("DP created at:", dpPath);
        
        if (!fs.existsSync(dpPath)) {
            throw new Error("DP file not created");
        }

        await api.sendMessage({
            body: `✨ **DP NAME EDITOR**\n\n📝 Name: ${name}\n🎨 Style: Premium Design\n✅ Successfully edited!`,
            attachment: fs.createReadStream(dpPath)
        }, event.threadID);

        // Clean up
        setTimeout(() => {
            if (fs.existsSync(dpPath)) {
                fs.unlinkSync(dpPath);
            }
        }, 5000);

    } catch (error) {
        console.error("DP generation error:", error);
        api.sendMessage(`❌ DP editing failed: ${error.message}`, event.threadID);
    }
}

async function addNameToDP(imageUrl, name) {
    try {
        console.log("Downloading image...");
        const response = await axios({
            method: 'GET',
            url: imageUrl,
            responseType: 'arraybuffer',
            timeout: 30000
        });

        console.log("Image downloaded, size:", response.data.length);
        
        const imageBuffer = Buffer.from(response.data);
        const img = await loadImage(imageBuffer);
        
        console.log("Image loaded, dimensions:", img.width, "x", img.height);

        // Create canvas with original dimensions
        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');

        // Draw original image
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // Calculate optimal font size based on image dimensions
        const baseSize = Math.min(img.width, img.height);
        const fontSize = Math.max(baseSize / 10, 20); // Minimum 20px
        
        // Premium font styling with multiple effects
        ctx.font = `bold ${fontSize}px 'Arial'`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Text position - bottom center with padding
        const x = img.width / 2;
        const y = img.height - (fontSize * 1.2);

        // **PREMIUM TEXT EFFECTS**

        // 1. Background shadow for readability
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(
            x - (ctx.measureText(name).width / 2) - 10, 
            y - fontSize + 5, 
            ctx.measureText(name).width + 20, 
            fontSize + 10
        );

        // 2. Text stroke (border)
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = fontSize / 15;
        ctx.strokeText(name, x, y);

        // 3. Main text with gradient
        const gradient = ctx.createLinearGradient(
            x - ctx.measureText(name).width / 2, 
            y, 
            x + ctx.measureText(name).width / 2, 
            y
        );
        gradient.addColorStop(0, '#FFFFFF');
        gradient.addColorStop(0.5, '#FFD700');
        gradient.addColorStop(1, '#FFFFFF');
        
        ctx.fillStyle = gradient;
        ctx.fillText(name, x, y);

        // 4. Add subtle glow effect
        ctx.shadowColor = 'rgba(255, 215, 0, 0.5)';
        ctx.shadowBlur = 15;
        ctx.fillText(name, x, y);
        ctx.shadowBlur = 0;

        // **ADD DECORATIVE PNG ELEMENTS**

        // Add crown emoji for premium look (text-based)
        if (name.length <= 12) {
            ctx.font = `bold ${fontSize * 0.8}px Arial`;
            ctx.fillText('👑', x, y - fontSize * 1.5);
        }

        // Add decorative lines
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - ctx.measureText(name).width / 2 - 15, y);
        ctx.lineTo(x - ctx.measureText(name).width / 2 - 5, y);
        ctx.moveTo(x + ctx.measureText(name).width / 2 + 5, y);
        ctx.lineTo(x + ctx.measureText(name).width / 2 + 15, y);
        ctx.stroke();

        // Save image
        const outputPath = path.join(__dirname, `../temp/dp_name_${Date.now()}.png`);
        
        // Ensure temp directory exists
        const tempDir = path.join(__dirname, '../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(outputPath, buffer);
        
        console.log("Premium DP saved successfully");
        return outputPath;

    } catch (error) {
        console.error("addNameToDP error:", error);
        throw new Error(`Image processing failed: ${error.message}`);
    }
}
