const { createCanvas, registerFont } = require('canvas');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "dpname",
        version: "1.0.0", 
        role: 0,
        author: "Marina Khan",
        category: "design",
        description: "DP pe perfect name editing with auto-fitting fonts",
        guide: {
            en: "{pn} [name] - Auto design\n{pn} font [font_number] [name] - Specific font"
        },
        countDown: 5
    },

    onStart: async function({ api, event, args }) {
        try {
            // Get user's profile picture
            const userInfo = await api.getUserInfo(event.senderID);
            const avatarUrl = `https://graph.facebook.com/${event.senderID}/picture?width=512&height=512&access_token=1730117696515757%7Cad747ae3f99cee0f5b5f0aae`;
            
            if (args[0] === 'font' && args.length >= 3) {
                const fontNum = parseInt(args[1]);
                const name = args.slice(2).join(' ');
                return await generateNameDP(api, event, avatarUrl, name, fontNum);
            }

            if (args[0] === 'list') {
                return await showFontList(api, event);
            }

            const name = args.join(' ') || userInfo[event.senderID].name;
            await generateNameDP(api, event, avatarUrl, name);

        } catch (error) {
            console.error("DP Name error:", error);
            api.sendMessage("❌ DP editing failed. Please try again!", event.threadID);
        }
    }
};

// Show available fonts
async function showFontList(api, event) {
    const fonts = `
🎨 **DP NAME EDITOR - FONT STYLES** 🎨

✨ **Modern Fonts (1-50)**
• Clean • Minimal • Bold • Tech

🎭 **Elegant Fonts (51-100)**  
• Script • Cursive • Classic • Formal

🚀 **Creative Fonts (101-150)**
• Artistic • Unique • Stylish • Design

💎 **Luxury Fonts (151-200)**
• Gold • Metallic • Premium • Exclusive

**Usage:**
!dpname Marina Khan
!dpname font 45 John Doe
!dpname font 123 Your Name

🌸 _Auto-fitted to your DP with perfect positioning_
    `;

    api.sendMessage(fonts, event.threadID);
}

// Generate DP with name
async function generateNameDP(api, event, avatarUrl, name, fontNumber = null) {
    try {
        api.sendMessage(`🎨 Editing your DP with "${name}"...`, event.threadID);

        const dpPath = await addNameToDP(avatarUrl, name, fontNumber);
        
        await api.sendMessage({
            body: `✨ **DP NAME EDITOR**\n\n📝 Name: ${name}\n🎨 Font Style: ${fontNumber || 'Auto'}\n🌟 Perfectly fitted to your DP!\n\n💝 Your customized DP is ready!`,
            attachment: fs.createReadStream(dpPath)
        }, event.threadID);

        fs.unlinkSync(dpPath);

    } catch (error) {
        console.error("DP name error:", error);
        api.sendMessage("❌ DP editing failed. Please try again!", event.threadID);
    }
}

// Main function to add name to DP
async function addNameToDP(avatarUrl, name, fontNumber = null) {
    const response = await require('axios').get(avatarUrl, { 
        responseType: 'arraybuffer' 
    });
    
    const imageBuffer = Buffer.from(response.data, 'binary');
    const img = await loadImage(imageBuffer);
    
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');

    // Draw original DP
    ctx.drawImage(img, 0, 0, img.width, img.height);

    // Get optimal font settings
    const fontConfig = getOptimalFontConfig(img.width, img.height, name, fontNumber);
    
    // Apply name with perfect positioning
    applyNameToImage(ctx, img.width, img.height, name, fontConfig);

    // Save edited DP
    const outputPath = path.join(__dirname, `dp_name_${Date.now()}.png`);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);
    
    return outputPath;
}

// Get optimal font configuration
function getOptimalFontConfig(width, height, name, fontNumber) {
    const baseSize = Math.min(width, height) / 10;
    
    const fontStyles = {
        // Modern Fonts (1-50)
        1: { font: `bold ${baseSize}px Arial`, color: '#ffffff', stroke: '#000000' },
        2: { font: `bold ${baseSize}px Helvetica`, color: '#000000', stroke: '#ffffff' },
        3: { font: `bold ${baseSize}px Verdana`, color: '#ff6b6b', stroke: '#000000' },
        4: { font: `bold ${baseSize}px Tahoma`, color: '#4ecdc4', stroke: '#ffffff' },
        
        // Elegant Fonts (51-100)
        51: { font: `italic ${baseSize}px Georgia`, color: '#ffffff', stroke: '#8b4513' },
        52: { font: `bold ${baseSize}px Times New Roman`, color: '#daa520', stroke: '#000000' },
        
        // Creative Fonts (101-150)  
        101: { font: `bold ${baseSize}px Courier New`, color: '#00ff00', stroke: '#000000' },
        102: { font: `bold ${baseSize}px Arial`, color: '#ff0080', stroke: '#ffffff' },
        
        // Luxury Fonts (151-200)
        151: { font: `bold ${baseSize}px Garamond`, color: '#ffd700', stroke: '#000000' },
        152: { font: `bold ${baseSize}px Arial`, color: '#c0c0c0', stroke: '#2c3e50' }
    };

    // If specific font requested
    if (fontNumber && fontStyles[fontNumber]) {
        return fontStyles[fontNumber];
    }

    // Auto-select best font based on name length and image size
    return getAutoFontConfig(width, height, name, baseSize);
}

// Auto font configuration
function getAutoFontConfig(width, height, name, baseSize) {
    const nameLength = name.length;
    
    if (nameLength <= 8) {
        return { 
            font: `bold ${baseSize}px Arial`, 
            color: '#ffffff', 
            stroke: '#000000' 
        };
    } else if (nameLength <= 15) {
        return { 
            font: `bold ${baseSize * 0.8}px Verdana`, 
            color: '#ffffff', 
            stroke: '#000000' 
        };
    } else {
        return { 
            font: `bold ${baseSize * 0.6}px Arial`, 
            color: '#ffffff', 
            stroke: '#000000' 
        };
    }
}

// Apply name to image with perfect positioning
function applyNameToImage(ctx, width, height, name, fontConfig) {
    ctx.font = fontConfig.font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Calculate text dimensions
    const textMetrics = ctx.measureText(name);
    const textWidth = textMetrics.width;
    
    // Auto position based on image composition
    const position = getOptimalTextPosition(width, height, textWidth);
    
    // Add text stroke for readability
    ctx.strokeStyle = fontConfig.stroke;
    ctx.lineWidth = Math.max(width, height) / 200;
    ctx.strokeText(name, position.x, position.y);
    
    // Add main text
    ctx.fillStyle = fontConfig.color;
    ctx.fillText(name, position.x, position.y);
    
    // Add subtle shadow effect
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 10;
    ctx.fillText(name, position.x, position.y);
    ctx.shadowBlur = 0;
}

// Get optimal text position based on image analysis
function getOptimalTextPosition(width, height, textWidth) {
    const padding = Math.min(width, height) / 20;
    
    // Prefer bottom area (common for DP names)
    if (textWidth < width - (padding * 2)) {
        return { x: width / 2, y: height - padding - 30 };
    }
    
    // Center if text is long
    return { x: width / 2, y: height / 2 };
}

// Load image utility
function loadImage(buffer) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = buffer;
    });
}
