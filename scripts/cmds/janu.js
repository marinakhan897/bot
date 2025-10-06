const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    config: {
        name: "banner",
        version: "2.0.0",
        author: "Marina Khan",
        countDown: 5,
        role: 0,
        description: "Create stunning banners and DP edits with multiple styles",
        category: "media",
        guide: {
            en: "{pn} [text] | [style number] | [background color/url]\n\n🎨 Styles: 1-20\nExample: .banner Marina | 5 | blue"
        }
    },

    onStart: async function ({ api, event, args }) {
        try {
            const { threadID, messageID, senderID } = event;
            
            if (args.length === 0) {
                return api.sendMessage(
                    `🎨 **Marina's Banner Creator** 🎨\n\n✨ Available Styles:\n\n` +
                    `🟦 **Modern Styles**\n` +
                    `1. Gradient Glow\n2. Neon Lights\n3. Glass Morphism\n4. 3D Text\n5. Animated Gradient\n\n` +
                    `🟪 **Aesthetic Styles**\n` +
                    `6. Vintage Retro\n7. Cyberpunk\n8. Minimalist\n9. Luxury Gold\n10. Pastel Dream\n\n` +
                    `🟥 **Professional Styles**\n` +
                    `11. Corporate\n12. Tech\n13. Creative\n14. Elegant\n15. Bold\n\n` +
                    `🟨 **Special Effects**\n` +
                    `16. Fire Text\n17. Ice Crystal\n18. Galaxy\n19. Watercolor\n20. Geometric\n\n` +
                    `💡 Usage: .banner text | style | background\nExample: .banner Marina | 3 | purple\n\n` +
                    `🎀 Created by: Marina Khan`,
                    threadID,
                    messageID
                );
            }

            const input = args.join(" ");
            const parts = input.split("|").map(part => part.trim());
            
            if (parts.length < 2) {
                return api.sendMessage("❌ Invalid format! Use: .banner text | style | background", threadID, messageID);
            }

            const text = parts[0];
            const style = parseInt(parts[1]) || 1;
            const background = parts[2] || "random";

            // Show processing message
            api.sendMessage("🔄 Creating your beautiful banner... Please wait! 💫", threadID, messageID);

            // Create banner using Canvas API
            const bannerUrl = await createBanner(text, style, background);
            
            if (bannerUrl) {
                // Download and send the image
                const imageResponse = await axios.get(bannerUrl, { responseType: 'stream' });
                
                return api.sendMessage({
                    body: `🎨 **Your Banner is Ready!** 🎨\n\n📝 Text: ${text}\n🎭 Style: ${getStyleName(style)}\n🌈 Background: ${background}\n\n💖 Created by Marina Khan`,
                    attachment: imageResponse.data
                }, threadID, messageID);
            } else {
                return api.sendMessage("❌ Failed to create banner. Please try again!", threadID, messageID);
            }

        } catch (error) {
            console.error("Banner error:", error);
            return api.sendMessage("❌ Error creating banner. Please check your input and try again! 🎀", threadID, messageID);
        }
    }
};

async function createBanner(text, style, background) {
    try {
        // Using a banner generation API (you can replace with any banner API)
        const apiUrl = `https://api.banner-generator.com/create`;
        
        const stylesConfig = {
            1: { effect: "gradient-glow", theme: "modern" },
            2: { effect: "neon-lights", theme: "dark" },
            3: { effect: "glass-morphism", theme: "frost" },
            4: { effect: "3d-text", theme: "depth" },
            5: { effect: "animated-gradient", theme: "rainbow" },
            6: { effect: "vintage", theme: "retro" },
            7: { effect: "cyberpunk", theme: "futuristic" },
            8: { effect: "minimalist", theme: "clean" },
            9: { effect: "luxury-gold", theme: "elegant" },
            10: { effect: "pastel", theme: "soft" },
            11: { effect: "corporate", theme: "professional" },
            12: { effect: "tech", theme: "digital" },
            13: { effect: "creative", theme: "artistic" },
            14: { effect: "elegant", theme: "sophisticated" },
            15: { effect: "bold", theme: "strong" },
            16: { effect: "fire", theme: "hot" },
            17: { effect: "ice", theme: "cold" },
            18: { effect: "galaxy", theme: "cosmic" },
            19: { effect: "watercolor", theme: "painting" },
            20: { effect: "geometric", theme: "abstract" }
        };

        const styleConfig = stylesConfig[style] || stylesConfig[1];
        
        const params = {
            text: text,
            style: styleConfig.effect,
            theme: styleConfig.theme,
            background: background,
            width: 1200,
            height: 600,
            format: "png"
        };

        const response = await axios.get(apiUrl, { params, timeout: 30000 });
        
        if (response.data && response.data.url) {
            return response.data.url;
        } else {
            // Fallback to a simple text-based banner if API fails
            return createFallbackBanner(text, style, background);
        }
    } catch (error) {
        console.error("Banner creation error:", error);
        return createFallbackBanner(text, style, background);
    }
}

function createFallbackBanner(text, style, background) {
    // Simple fallback using a text-to-image service
    const colors = {
        gradient: ["FF6B6B", "4ECDC4", "45B7D1", "96CEB4", "FFEAA7"],
        neon: ["FF0000", "00FF00", "0000FF", "FFFF00", "FF00FF"],
        pastel: ["FFB6C1", "87CEEB", "98FB98", "DDA0DD", "FFD700"]
    };

    const colorSet = style <= 5 ? colors.gradient : 
                    style <= 10 ? colors.neon : 
                    colors.pastel;
    
    const color = colorSet[style % colorSet.length];
    
    return `https://via.placeholder.com/1200x600/${color}/FFFFFF?text=${encodeURIComponent(text)}`;
}

function getStyleName(style) {
    const styles = {
        1: "Gradient Glow ✨",
        2: "Neon Lights 🌟", 
        3: "Glass Morphism 🍸",
        4: "3D Text 🔮",
        5: "Animated Gradient 🌈",
        6: "Vintage Retro 📻",
        7: "Cyberpunk 🤖", 
        8: "Minimalist ⚪",
        9: "Luxury Gold 👑",
        10: "Pastel Dream 🎀",
        11: "Corporate 💼",
        12: "Tech 💻",
        13: "Creative 🎨",
        14: "Elegant 🌹",
        15: "Bold 🔥",
        16: "Fire Text 🔥",
        17: "Ice Crystal ❄️",
        18: "Galaxy 🌌",
        19: "Watercolor 🎨",
        20: "Geometric 🔷"
    };
    
    return styles[style] || "Custom Style";
}
