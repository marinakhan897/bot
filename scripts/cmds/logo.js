const { createCanvas, registerFont } = require('canvas');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "logo",
        version: "4.0.0",
        role: 0,
        author: "Marina Khan",
        category: "design",
        description: "400+ Professional Logo Designs with Perfect Fonts",
        guide: {
            en: "{pn} [name] - Random design\n{pn} style [style_number] [name] - Specific design"
        },
        countDown: 10
    },

    onStart: async function({ api, event, args }) {
        try {
            if (args[0] === 'style' && args.length >= 3) {
                const styleNum = parseInt(args[1]);
                const name = args.slice(2).join(' ');
                return await generateSpecificLogo(api, event, name, styleNum);
            }

            if (args[0] === 'list') {
                return await showDesignCategories(api, event);
            }

            const name = args.join(' ') || "Marina Khan";
            await generateRandomLogo(api, event, name);

        } catch (error) {
            console.error("Logo error:", error);
            api.sendMessage("❌ Logo creation failed. Please try again!", event.threadID);
        }
    }
};

// Show design categories
async function showDesignCategories(api, event) {
    const categories = `
🎨 **400+ LOGO DESIGN CATEGORIES** 🎨

✨ **Modern Styles (1-100)**
• Gradient Designs • Minimal • Tech • Abstract

🎭 **Vintage Styles (101-200)**
• Classic • Retro • Elegant • Ornate

🚀 **Futuristic Styles (201-300)**
• Cyber • Neon • Holographic • Digital

💎 **Luxury Styles (301-400)**
• Gold • Diamond • Premium • Exclusive

🌿 **Nature Styles (401-500)**
• Organic • Leaf • Water • Earth

**Usage:**
!logo style 45 Marina Khan
!logo style 256 Tech Company
!logo Your Brand Name

🌸 _Marina AI Design Studio - 400+ Designs Available_
    `;

    api.sendMessage(categories, event.threadID);
}

// Generate random logo
async function generateRandomLogo(api, event, name) {
    const styleNumber = Math.floor(Math.random() * 400) + 1;
    await generateSpecificLogo(api, event, name, styleNumber);
}

// Generate specific logo design
async function generateSpecificLogo(api, event, name, styleNumber) {
    try {
        api.sendMessage(`🎨 Creating Design #${styleNumber} for "${name}"...`, event.threadID);

        const logoPath = await generateLogoDesign(name, styleNumber);
        
        const designInfo = getDesignInfo(styleNumber);
        
        await api.sendMessage({
            body: `✨ **LOGO DESIGN #${styleNumber}**\n\n📝 Name: ${name}\n🎭 Style: ${designInfo.style}\n🎨 Colors: ${designInfo.colors}\n🔤 Font: ${designInfo.font}\n🌟 By: Marina AI Studio\n\n💝 Professional logo created!`,
            attachment: fs.createReadStream(logoPath)
        }, event.threadID);

        fs.unlinkSync(logoPath);

    } catch (error) {
        console.error("Specific logo error:", error);
        api.sendMessage(`❌ Design #${styleNumber} failed. Try another number (1-400).`, event.threadID);
    }
}

// Get design information
function getDesignInfo(styleNumber) {
    const categories = {
        modern: { range: [1, 100], style: "Modern", colors: "Gradient", font: "Sans-serif" },
        vintage: { range: [101, 200], style: "Vintage", colors: "Warm", font: "Serif" },
        futuristic: { range: [201, 300], style: "Futuristic", colors: "Neon", font: "Tech" },
        luxury: { range: [301, 400], style: "Luxury", colors: "Metallic", font: "Elegant" },
        nature: { range: [401, 500], style: "Nature", colors: "Earth", font: "Organic" }
    };

    for (const [category, info] of Object.entries(categories)) {
        if (styleNumber >= info.range[0] && styleNumber <= info.range[1]) {
            return info;
        }
    }
    return { style: "Modern", colors: "Multi", font: "Professional" };
}

// Generate logo with specific design
async function generateLogoDesign(text, designNumber) {
    const width = 800;
    const height = 400;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Get design parameters based on design number
    const design = getDesignParameters(designNumber);
    
    // Apply background
    applyBackground(ctx, width, height, design);
    
    // Apply decorative elements
    applyDecorations(ctx, width, height, design);
    
    // Apply main text
    applyMainText(ctx, width, height, text, design);
    
    // Apply additional elements
    applyAdditionalElements(ctx, width, height, design);

    // Save image
    const logoPath = path.join(__dirname, `logo_${Date.now()}.png`);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(logoPath, buffer);
    
    return logoPath;
}

// Get design parameters for 400+ designs
function getDesignParameters(designNumber) {
    const designs = {
        // MODERN DESIGNS (1-100)
        1: { bg: 'gradient', colors: ['#667eea', '#764ba2'], font: 'bold 60px Arial', textColor: '#ffffff', elements: 'circles' },
        2: { bg: 'gradient', colors: ['#ff6b6b', '#4ecdc4'], font: 'bold 55px Arial', textColor: '#ffffff', elements: 'lines' },
        3: { bg: 'solid', colors: ['#2c3e50'], font: 'bold 65px Arial', textColor: '#ecf0f1', elements: 'dots' },
        4: { bg: 'gradient', colors: ['#fd746c', '#ff9068'], font: 'bold 58px Arial', textColor: '#ffffff', elements: 'triangles' },
        5: { bg: 'gradient', colors: ['#6a11cb', '#2575fc'], font: 'bold 62px Arial', textColor: '#ffffff', elements: 'squares' },
        
        // VINTAGE DESIGNS (101-200)
        101: { bg: 'texture', colors: ['#8b4513', '#daa520'], font: 'italic 50px Georgia', textColor: '#8b4513', elements: 'vintage' },
        102: { bg: 'solid', colors: ['#f5deb3'], font: 'bold 55px Times New Roman', textColor: '#8b0000', elements: 'classic' },
        
        // FUTURISTIC DESIGNS (201-300)
        201: { bg: 'dark', colors: ['#00d2ff', '#3a7bd5'], font: 'bold 60px Courier New', textColor: '#00ff00', elements: 'neon' },
        202: { bg: 'dark', colors: ['#ff0080', '#7928ca'], font: 'bold 58px Arial', textColor: '#ff0080', elements: 'glow' },
        
        // LUXURY DESIGNS (301-400)
        301: { bg: 'dark', colors: ['#ffd700', '#000000'], font: 'bold 52px Garamond', textColor: '#ffd700', elements: 'gold' },
        302: { bg: 'gradient', colors: ['#c0c0c0', '#ffffff'], font: 'bold 56px Arial', textColor: '#2c3e50', elements: 'silver' },
        
        // NATURE DESIGNS (401-500)
        401: { bg: 'gradient', colors: ['#4ecdc4', '#44a08d'], font: 'bold 54px Verdana', textColor: '#ffffff', elements: 'leaf' },
        402: { bg: 'gradient', colors: ['#ffe259', '#ffa751'], font: 'bold 58px Arial', textColor: '#ffffff', elements: 'sun' }
    };

    // If specific design exists, return it, otherwise generate based on category
    if (designs[designNumber]) {
        return designs[designNumber];
    }

    // Generate parameters based on design number for remaining 395+ designs
    return generateDynamicDesign(designNumber);
}

// Generate dynamic design for remaining designs
function generateDynamicDesign(designNumber) {
    const colorPalettes = [
        ['#667eea', '#764ba2'], ['#f093fb', '#f5576c'], ['#4facfe', '#00f2fe'],
        ['#43e97b', '#38f9d7'], ['#fa709a', '#fee140'], ['#a8edea', '#fed6e3'],
        ['#ffecd2', '#fcb69f'], ['#ff9a9e', '#fecfef'], ['#a1c4fd', '#c2e9fb'],
        ['#d4fc79', '#96e6a1'], ['#84fab0', '#8fd3f4'], ['#a6c0fe', '#f68084']
    ];

    const fonts = [
        'bold 60px Arial', 'bold 55px Arial', 'bold 65px Arial', 'bold 58px Arial',
        'bold 62px Arial', 'bold 54px Arial', 'bold 56px Arial', 'bold 52px Arial'
    ];

    const backgrounds = ['gradient', 'solid', 'texture', 'dark'];
    const elements = ['circles', 'lines', 'dots', 'triangles', 'squares', 'abstract'];

    const colorIndex = designNumber % colorPalettes.length;
    const fontIndex = designNumber % fonts.length;
    const bgIndex = designNumber % backgrounds.length;
    const elementIndex = designNumber % elements.length;

    return {
        bg: backgrounds[bgIndex],
        colors: colorPalettes[colorIndex],
        font: fonts[fontIndex],
        textColor: '#ffffff',
        elements: elements[elementIndex]
    };
}

// Apply background based on design
function applyBackground(ctx, width, height, design) {
    switch (design.bg) {
        case 'gradient':
            const gradient = ctx.createLinearGradient(0, 0, width, height);
            design.colors.forEach((color, index) => {
                gradient.addColorStop(index / (design.colors.length - 1), color);
            });
            ctx.fillStyle = gradient;
            break;
        case 'solid':
            ctx.fillStyle = design.colors[0];
            break;
        case 'dark':
            ctx.fillStyle = '#1a1a1a';
            break;
        case 'texture':
            ctx.fillStyle = '#f5f5dc';
            break;
        default:
            ctx.fillStyle = design.colors[0];
    }
    ctx.fillRect(0, 0, width, height);
}

// Apply decorative elements
function applyDecorations(ctx, width, height, design) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    
    switch (design.elements) {
        case 'circles':
            for (let i = 0; i < 30; i++) {
                ctx.beginPath();
                ctx.arc(
                    Math.random() * width,
                    Math.random() * height,
                    Math.random() * 40 + 10,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
            break;
        case 'lines':
            for (let i = 0; i < 20; i++) {
                ctx.beginPath();
                ctx.moveTo(Math.random() * width, Math.random() * height);
                ctx.lineTo(Math.random() * width, Math.random() * height);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
            break;
        case 'dots':
            for (let i = 0; i < 100; i++) {
                ctx.beginPath();
                ctx.arc(
                    Math.random() * width,
                    Math.random() * height,
                    Math.random() * 5 + 1,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
            break;
        case 'triangles':
            for (let i = 0; i < 15; i++) {
                ctx.beginPath();
                ctx.moveTo(Math.random() * width, Math.random() * height);
                ctx.lineTo(Math.random() * width, Math.random() * height);
                ctx.lineTo(Math.random() * width, Math.random() * height);
                ctx.closePath();
                ctx.fill();
            }
            break;
    }
}

// Apply main text
function applyMainText(ctx, width, height, text, design) {
    ctx.fillStyle = design.textColor;
    ctx.font = design.font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Handle long text by splitting into two lines if needed
    if (text.length > 15) {
        const words = text.split(' ');
        const mid = Math.ceil(words.length / 2);
        const line1 = words.slice(0, mid).join(' ');
        const line2 = words.slice(mid).join(' ');
        
        ctx.fillText(line1.toUpperCase(), width / 2, height / 2 - 30);
        ctx.fillText(line2.toUpperCase(), width / 2, height / 2 + 30);
    } else {
        ctx.fillText(text.toUpperCase(), width / 2, height / 2);
    }
}

// Apply additional elements
function applyAdditionalElements(ctx, width, height, design) {
    // Add border
    ctx.strokeStyle = design.textColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    // Add footer text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '16px Arial';
    ctx.fillText('DESIGNED BY MARINA AI STUDIO', width / 2, height - 40);
}
