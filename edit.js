const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const jimp = require('jimp');

module.exports = {
    config: {
        name: "dpedit",
        version: "1.0",
        author: "Marina",
        countDown: 10,
        role: 0,
        description: {
            en: "Advanced DP editing with glass effects, fonts, and filters"
        },
        category: "image",
        guide: {
            en: "{p}dpedit [effect] [text]\n{p}dpedit list\n{p}dpedit fonts"
        }
    },

    onStart: async function ({ api, event, args }) {
        try {
            const action = args[0];
            
            if (!action || action === 'list') {
                return this.showEffectsList(api, event);
            }

            if (action === 'fonts') {
                return this.showFontsList(api, event);
            }

            await this.handleDPEdit(api, event, args);
            
        } catch (error) {
            console.error('DP Edit Error:', error);
            await api.sendMessage("❌ Error processing your DP. Please try again.", event.threadID);
        }
    },

    showEffectsList: async function (api, event) {
        const effectsList = `🎨 **MARINA DP EDITOR** 🎨

👑 **GLASS EFFECTS:**
• glass1 - Frosted glass effect
• glass2 - Blurred glass
• glass3 - Transparent overlay
• glass4 - Icy glass texture
• glass5 - Crystal clear effect

🌈 **FILTERS:**
• vintage - Old photo style
• neon - Glowing neon effect
• bokeh - Blurred background
• grayscale - Black & white
• sepia - Vintage brown tone

💫 **TEXT EFFECTS:**
• text3d - 3D text with shadow
• textneon - Glowing neon text
• textglass - Glass-like text
• textgradient - Color gradient text
• textoutline - Outlined text

🎯 **USAGE:**
{p}dpedit glass1 "Your Text"
{p}dpedit neon "Marina"
{p}dpedit text3d "Hello"

💡 Reply to an image or it will use your profile picture!`;

        await api.sendMessage(effectsList, event.threadID);
    },

    showFontsList: async function (api, event) {
        const fontsList = `🔤 **AVAILABLE FONTS** 🔤

1. Arial Bold
2. Times New Roman  
3. Impact
4. Comic Sans
5. Georgia
6. Verdana
7. Courier New
8. Trebuchet MS
9. Lucida Console
10. Brush Script MT

💡 Fonts are applied automatically with text effects!`;

        await api.sendMessage(fontsList, event.threadID);
    },

    handleDPEdit: async function (api, event, args) {
        const effect = args[0];
        const text = args.slice(1).join(' ');
        
        // Get user's profile picture or use replied image
        let imageUrl;
        
        if (event.messageReply && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
            imageUrl = event.messageReply.attachments[0].url;
        } else {
            const userInfo = await api.getUserInfo(event.senderID);
            imageUrl = userInfo[event.senderID].thumb_src;
        }

        if (!imageUrl) {
            return api.sendMessage("❌ Please provide an image or I'll use your profile picture.", event.threadID);
        }

        const processingMsg = await api.sendMessage("🔄 Marina is editing your DP with glass effects...", event.threadID);

        try {
            const editedImage = await this.applyEffect(imageUrl, effect, text);
            await api.sendMessage({
                body: `✨ **DP EDITING COMPLETE** ✨\n\n🎨 Effect: ${effect}\n💫 Text: ${text || 'No text'}\n👑 Edited by Marina's Advanced Editor`,
                attachment: fs.createReadStream(editedImage)
            }, event.threadID);

            // Clean up
            await fs.remove(editedImage);
            await api.unsendMessage(processingMsg.messageID);

        } catch (error) {
            await api.sendMessage("❌ Failed to edit image. Please try another effect.", event.threadID);
        }
    },

    applyEffect: async function (imageUrl, effect, text) {
        // Download image
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const imageBuffer = Buffer.from(response.data);
        
        // Load image with Jimp
        const image = await jimp.read(imageBuffer);
        
        // Apply effects based on type
        switch (effect) {
            case 'glass1':
                await this.applyFrostedGlass(image);
                break;
            case 'glass2':
                await this.applyBlurredGlass(image);
                break;
            case 'glass3':
                await this.applyTransparentOverlay(image);
                break;
            case 'glass4':
                await this.applyIcyGlass(image);
                break;
            case 'glass5':
                await this.applyCrystalEffect(image);
                break;
            case 'vintage':
                await this.applyVintageFilter(image);
                break;
            case 'neon':
                await this.applyNeonEffect(image);
                break;
            case 'bokeh':
                await this.applyBokehEffect(image);
                break;
            case 'grayscale':
                image.grayscale();
                break;
            case 'sepia':
                image.sepia();
                break;
            default:
                await this.applyFrostedGlass(image); // Default effect
        }

        // Add text if provided
        if (text) {
            await this.addTextToImage(image, text, effect);
        }

        // Save processed image
        const outputPath = path.join(__dirname, '..', 'temp', `dpedit_${Date.now()}.png`);
        await image.writeAsync(outputPath);
        
        return outputPath;
    },

    applyFrostedGlass: async function (image) {
        image.blur(3);
        image.opacity(0.7);
        const overlay = await this.createGlassOverlay(image.getWidth(), image.getHeight());
        image.composite(overlay, 0, 0);
    },

    applyBlurredGlass: async function (image) {
        image.blur(5);
        image.brightness(0.1);
        image.contrast(0.1);
    },

    applyTransparentOverlay: async function (image) {
        image.opacity(0.8);
        const overlay = new jimp(image.getWidth(), image.getHeight(), 0x228B22AA); // Green tint
        image.composite(overlay, 0, 0);
    },

    applyIcyGlass: async function (image) {
        image.blur(2);
        image.color([{ apply: 'lighten', params: [20] }]);
        const iceOverlay = new jimp(image.getWidth(), image.getHeight(), 0x87CEEB88); // Light blue tint
        image.composite(iceOverlay, 0, 0);
    },

    applyCrystalEffect: async function (image) {
        image.blur(1);
        image.brightness(0.2);
        image.contrast(0.3);
    },

    applyVintageFilter: async function (image) {
        image.sepia();
        image.contrast(0.2);
        image.brightness(-0.1);
    },

    applyNeonEffect: async function (image) {
        image.posterize(5);
        image.color([{ apply: 'mix', params: ['#FF00FF', 30] }]);
        image.brightness(0.3);
    },

    applyBokehEffect: async function (image) {
        image.blur(8);
        image.brightness(0.1);
    },

    createGlassOverlay: async function (width, height) {
        const overlay = new jimp(width, height, 0xFFFFFF22); // White transparent
        // Add some noise for glass texture
        for (let x = 0; x < width; x += 5) {
            for (let y = 0; y < height; y += 5) {
                const alpha = Math.random() * 50 + 10;
                overlay.setPixelColor(jimp.rgbaToInt(255, 255, 255, alpha), x, y);
            }
        }
        return overlay;
    },

    addTextToImage: async function (image, text, effect) {
        try {
            // Load font based on effect
            let font;
            const fontSize = image.getWidth() / 15; // Responsive font size
            
            switch (effect) {
                case 'text3d':
                    font = await jimp.loadFont(jimp.FONT_SANS_32_BLACK);
                    this.add3DText(image, text, font);
                    break;
                case 'textneon':
                    font = await jimp.loadFont(jimp.FONT_SANS_32_WHITE);
                    this.addNeonText(image, text, font);
                    break;
                case 'textglass':
                    font = await jimp.loadFont(jimp.FONT_SANS_32_WHITE);
                    this.addGlassText(image, text, font);
                    break;
                default:
                    font = await jimp.loadFont(jimp.FONT_SANS_32_WHITE);
                    this.addBasicText(image, text, font);
            }
        } catch (error) {
            console.error('Text adding error:', error);
        }
    },

    add3DText: function (image, text, font) {
        const x = image.getWidth() / 2 - (jimp.measureText(font, text) / 2);
        const y = image.getHeight() - 100;
        
        // Shadow
        image.print(font, x + 3, y + 3, text);
        // Main text
        image.print(font, x, y, text);
    },

    addNeonText: function (image, text, font) {
        const x = image.getWidth() / 2 - (jimp.measureText(font, text) / 2);
        const y = image.getHeight() - 100;
        
        // Glow effect
        for (let i = -2; i <= 2; i++) {
            for (let j = -2; j <= 2; j++) {
                if (i !== 0 || j !== 0) {
                    image.print(font, x + i, y + j, text);
                }
            }
        }
        // Main text
        image.print(font, x, y, text);
    },

    addGlassText: function (image, text, font) {
        const x = image.getWidth() / 2 - (jimp.measureText(font, text) / 2);
        const y = image.getHeight() - 100;
        
        // Semi-transparent background
        const textWidth = jimp.measureText(font, text);
        const textHeight = jimp.measureTextHeight(font, text, textWidth);
        const overlay = new jimp(textWidth + 20, textHeight + 10, 0x00000066);
        image.composite(overlay, x - 10, y - 5);
        
        // Text
        image.print(font, x, y, text);
    },

    addBasicText: function (image, text, font) {
        const x = image.getWidth() / 2 - (jimp.measureText(font, text) / 2);
        const y = image.getHeight() - 100;
        image.print(font, x, y, text);
    }
};
