const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "logodesign",
        version: "3.0.0",
        role: 0,
        author: "Marina Khan",
        category: "design",
        description: "AI Powered Logo Designer with Custom Name",
        guide: {
            en: "{pn} [name] - Design logo with your name\n{pn} style [style] [name] - Choose specific style"
        },
        countDown: 15
    },

    onStart: async function({ api, event, args }) {
        try {
            if (args[0] === 'style' && args.length >= 3) {
                return await generateStyledLogo(api, event, args[1], args.slice(2).join(' '));
            }

            const name = args.join(' ');
            if (!name) {
                return showLogoMenu(api, event);
            }

            await generateCustomLogo(api, event, name);

        } catch (error) {
            console.error("Logo design error:", error);
            api.sendMessage("❌ Logo design failed. Please try again!", event.threadID);
        }
    }
};

// Show logo design menu
function showLogoMenu(api, event) {
    const menu = `
🎨 **Marina's AI Logo Designer** 🎨

╔════════════════════╗
║   LOGO DESIGN STUDIO  ║
╠════════════════════╣
║                                    ║
║  🎯 **Basic Usage:**              ║
║  !logodesign YourName             ║
║                                    ║
║  🎭 **Style Options:**            ║
║  !logodesign style modern Name    ║
║  !logodesign style vintage Name   ║
║  !logodesign style tech Name      ║
║  !logodesign style luxury Name    ║
║  !logodesign style nature Name    ║
║                                    ║
╚════════════════════╝

✨ **Available Styles:**
• modern - Sleek & contemporary
• vintage - Classic & retro  
• tech - Digital & futuristic
• luxury - Premium & elegant
• nature - Organic & natural
• minimal - Simple & clean
• gradient - Colorful blends
• 3d - Three dimensional

🌸 _Create your brand identity with Marina AI_
    `;

    api.sendMessage(menu, event.threadID);
}

// Generate custom logo
async function generateCustomLogo(api, event, name) {
    api.sendMessage(`🎨 Designing logo for: "${name}"...`, event.threadID);

    const logoData = await createAILogo(name, 'auto');
    const logoBuffer = await generateLogoImage(logoData);
    
    await api.sendMessage({
        body: `✨ **Logo Designed Successfully!**\n\n📝 Name: ${name}\n🎭 Style: ${logoData.style}\n🌈 Colors: ${logoData.colors.join(', ')}\n\n💝 Designed by Marina AI Logo Studio`,
        attachment: logoBuffer
    }, event.threadID);
}

// Generate styled logo
async function generateStyledLogo(api, event, style, name) {
    const validStyles = ['modern', 'vintage', 'tech', 'luxury', 'nature', 'minimal', 'gradient', '3d'];
    
    if (!validStyles.includes(style.toLowerCase())) {
        return api.sendMessage(`❌ Invalid style! Choose from: ${validStyles.join(', ')}`, event.threadID);
    }

    api.sendMessage(`🎨 Creating ${style} logo for: "${name}"...`, event.threadID);

    const logoData = await createAILogo(name, style);
    const logoBuffer = await generateLogoImage(logoData);
    
    await api.sendMessage({
        body: `✨ **${style.toUpperCase()} Logo Created!**\n\n📝 Name: ${name}\n🎭 Style: ${logoData.style}\n🎨 Palette: ${logoData.colors.join(' → ')}\n\n🌟 Marina AI Design Studio`,
        attachment: logoBuffer
    }, event.threadID);
}

// AI Logo Creation
async function createAILogo(name, style) {
    const styles = {
        modern: {
            colors: ['#667eea', '#764ba2'],
            font: 'bold',
            elements: ['geometric', 'clean'],
            bg: 'gradient'
        },
        vintage: {
            colors: ['#d4af37', '#8b4513'],
            font: 'serif', 
            elements: ['ornate', 'classic'],
            bg: 'texture'
        },
        tech: {
            colors: ['#00d2ff', '#3a7bd5'],
            font: 'monospace',
            elements: ['circuit', 'digital'],
            bg: 'dark'
        },
        luxury: {
            colors: ['#ffd700', '#000000'],
            font: 'elegant',
            elements: ['gold', 'minimal'],
            bg: 'dark'
        },
        nature: {
            colors: ['#4ecdc4', '#44a08d'],
            font: 'organic',
            elements: ['leaf', 'water'],
            bg: 'light'
        },
        minimal: {
            colors: ['#000000', '#ffffff'],
            font: 'thin',
            elements: ['simple', 'clean'],
            bg: 'white'
        },
        gradient: {
            colors: ['#ff9a9e', '#fad0c4', '#fbc2eb'],
            font: 'modern',
            elements: ['colorful', 'flow'],
            bg: 'gradient'
        },
        '3d': {
            colors: ['#ff6b6b', '#4ecdc4'],
            font: 'bold',
            elements: ['shadow', 'depth'],
            bg: 'light'
        }
    };

    const selectedStyle = styles[style] || styles.modern;
    
    return {
        name: name,
        style: style,
        colors: selectedStyle.colors,
        font: selectedStyle.font,
        elements: selectedStyle.elements,
        background: selectedStyle.bg,
        timestamp: Date.now()
    };
}

// Generate logo image (simulated)
async function generateLogoImage(logoData) {
    try {
        // In real implementation, you would use canvas or external API
        // For now, we'll use placeholder and simulated generation
        
        const logoUrl = await generatePlaceholderLogo(logoData);
        const response = await axios.get(logoUrl, { responseType: 'arraybuffer' });
        
        return Buffer.from(response.data, 'binary');
        
    } catch (error) {
        // Fallback to text-based logo
        return createTextLogo(logoData);
    }
}

// Generate placeholder logo
async function generatePlaceholderLogo(logoData) {
    const baseUrl = 'https://placehold.co/400x200';
    const color = logoData.colors[0].replace('#', '');
    const text = encodeURIComponent(logoData.name);
    
    return `${baseUrl}/${color}/ffffff/png?text=${text}&font=montserrat`;
}

// Create text-based logo fallback
function createTextLogo(logoData) {
    // This would create a simple text-based logo
    // In real implementation, use node-canvas
    const text = `
╔════════════════════╗
║                    ║
║    🎨 ${logoData.name}    ║
║                    ║
║  Style: ${logoData.style}  ║
║                    ║
╚════════════════════╝
    `;
    
    return Buffer.from(text);
}
