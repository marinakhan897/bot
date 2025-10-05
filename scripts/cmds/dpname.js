const { createCanvas, registerFont, loadImage } = require('canvas');
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
        description: "DP pe perfect name editing",
        guide: "{pn} [name]",
        countDown: 5
    },

    onStart: async function({ api, event, args }) {
        try {
            console.log("Command started...");
            
            if (args.length === 0) {
                return api.sendMessage("✨ Please provide a name!\nExample: !dpname Marina", event.threadID);
            }

            const name = args.join(' ');
            console.log("Processing name:", name);
            
            // Get user info for profile picture
            const userInfo = await api.getUserInfo(event.senderID);
            const userID = event.senderID;
            
            // Facebook profile picture URL
            const avatarUrl = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
            
            console.log("Avatar URL:", avatarUrl);
            
            await generateNameDP(api, event, avatarUrl, name);

        } catch (error) {
            console.error("Main error:", error);
            api.sendMessage(`❌ Error: ${error.message}`, event.threadID);
        }
    }
};

async function generateNameDP(api, event, avatarUrl, name) {
    try {
        api.sendMessage(`🔄 Editing your DP with "${name}"...`, event.threadID);
        console.log("Starting DP generation...");

        const dpPath = await addNameToDP(avatarUrl, name);
        console.log("DP created at:", dpPath);
        
        if (!fs.existsSync(dpPath)) {
            throw new Error("DP file not created");
        }

        await api.sendMessage({
            body: `✨ **DP NAME EDITOR**\n\n📝 Name: ${name}\n✅ Successfully added to your DP!`,
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

async function addNameToDP(avatarUrl, name) {
    try {
        console.log("Downloading avatar...");
        const response = await axios({
            method: 'GET',
            url: avatarUrl,
            responseType: 'arraybuffer'
        });

        console.log("Avatar downloaded, size:", response.data.length);
        
        const imageBuffer = Buffer.from(response.data);
        const img = await loadImage(imageBuffer);
        
        console.log("Image loaded, dimensions:", img.width, "x", img.height);

        const canvas = createCanvas(img.width, img.height);
        const ctx = canvas.getContext('2d');

        // Draw original image
        ctx.drawImage(img, 0, 0, img.width, img.height);

        // Font settings
        const fontSize = Math.min(img.width, img.height) / 8;
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = fontSize / 20;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Text position (bottom center)
        const x = img.width / 2;
        const y = img.height - (fontSize * 1.5);

        // Add text stroke
        ctx.strokeText(name, x, y);
        // Add text fill
        ctx.fillText(name, x, y);

        // Save image
        const outputPath = path.join(__dirname, `../temp/dp_name_${Date.now()}.png`);
        
        // Ensure temp directory exists
        const tempDir = path.join(__dirname, '../temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(outputPath, buffer);
        
        console.log("DP saved successfully");
        return outputPath;

    } catch (error) {
        console.error("addNameToDP error:", error);
        throw new Error(`Image processing failed: ${error.message}`);
    }
}
