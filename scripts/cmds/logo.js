const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "logo",
        version: "3.0.0",
        role: 0,
        author: "Marina Khan",
        category: "design",
        description: "Create REAL image logos with your name",
        guide: "{pn} [your name]"
    },

    onStart: async function({ api, event, args }) {
        try {
            const name = args.join(' ') || "Marina Khan";
            
            api.sendMessage(`🎨 Creating professional logo for "${name}"...`, event.threadID);

            // Generate REAL image logo
            const logoPath = await generateRealLogo(name);
            
            await api.sendMessage({
                body: `✨ **LOGO CREATED SUCCESSFULLY!**\n\n📝 Name: ${name}\n🎨 Style: Professional Gradient\n🌈 Colors: Dynamic\n🌟 By: Marina AI Studio\n\n💝 Your brand identity is ready!`,
                attachment: fs.createReadStream(logoPath)
            }, event.threadID);

            // Clean up
            fs.unlinkSync(logoPath);

        } catch (error) {
            console.error("Logo creation error:", error);
            api.sendMessage("❌ Logo creation failed. Installing canvas package might help: npm install canvas", event.threadID);
        }
    }
};

async function generateRealLogo(text) {
    const width = 800;
    const height = 400;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Create beautiful gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(0.5, '#764ba2');
    gradient.addColorStop(1, '#f093fb');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add decorative elements
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < 50; i++) {
        ctx.beginPath();
        ctx.arc(
            Math.random() * width,
            Math.random() * height,
            Math.random() * 30 + 10,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }

    // Main text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 60px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text.toUpperCase(), width / 2, height / 2 - 30);

    // Sub text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '20px Arial';
    ctx.fillText('DESIGNED BY MARINA AI', width / 2, height / 2 + 50);

    // Add border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 5;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    // Save image
    const logoPath = path.join(__dirname, `logo_${Date.now()}.png`);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(logoPath, buffer);
    
    return logoPath;
}
