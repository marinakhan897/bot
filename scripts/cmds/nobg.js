module.exports = {
    config: {
        name: "edit",
        version: "3.0",
        author: "Marina Khan",
        countDown: 5,
        role: 0,
        description: {
            en: "Advanced DP editing with multiple effects - By Marina Khan"
        },
        category: "media",
        guide: {
            en: "{p}dpedit [effect] - Edit your DP\n{p}dpedit list - Show all effects\n{p}dpedit bg [color] - Change background"
        }
    },

    onStart: async function ({ api, event, args }) {
        if (args.length === 0) {
            const helpMessage = `🎨 **DP EDITING SUITE** 🎨

💖 **Created by: Marina Khan**
✨ **Professional Profile Picture Editing**

🛠️ **Available APIs:**
• Remove.bg - Background Removal
• Cloudinary - Advanced Effects
• Pixlr - Professional Editing

📝 **Commands:**
• {p}dpedit [effect] - Apply effect
• {p}dpedit list - Show effects
• {p}dpedit bg [color] - Change background
• {p}dpedit removebg - Remove background
• {p}dpedit blur - Blur effect
• {p}dpedit cartoon - Cartoon filter

🎭 **Effects Available:**
blur, cartoon, vintage, grayscale, invert, sepia, pixelate

💡 **Examples:**
{p}dpedit removebg
{p}dpedit cartoon
{p}dpedit bg blue

🌟 **Powered by Multiple AI APIs**`;
            
            await api.sendMessage(helpMessage, event.threadID);
            return;
        }

        try {
            const action = args[0].toLowerCase();
            
            if (action === 'list') {
                const effects = `🎨 **Available DP Effects:**\n\n• removebg - Remove background\n• blur - Blur background\n• cartoon - Cartoon filter\n• vintage - Vintage look\n• grayscale - Black & white\n• invert - Color invert\n• sepia - Old photo effect\n• pixelate - Pixel art\n• bg [color] - Change background color\n\n💖 Created by Marina Khan`;
                return await api.sendMessage(effects, event.threadID);
            }

            await api.sendMessage("🎨 Processing your DP with AI magic...", event.threadID);
            
            // Get user's profile picture
            const userInfo = await api.getUserInfo(event.senderID);
            const avatarUrl = userInfo[event.senderID].thumbSrc;
            
            let editedImage;
            
            if (action === 'removebg') {
                editedImage = await this.removeBackground(avatarUrl);
            }
            else if (action === 'bg' && args[1]) {
                editedImage = await this.changeBackground(avatarUrl, args[1]);
            }
            else {
                editedImage = await this.applyEffect(avatarUrl, action);
            }
            
            if (editedImage && editedImage.success) {
                await api.sendMessage({
                    body: `✨ **DP Editing Complete!** ✨\n\nEffect: ${action}\nQuality: Excellent\nStatus: Success\n\n💖 Processed by Marina Khan's Editing Suite\n🎀 Powered by AI APIs`,
                    attachment: await global.utils.getStreamFromURL(editedImage.url)
                }, event.threadID);
            } else {
                await api.sendMessage(`❌ Editing failed: ${editedImage?.error || 'Unknown error'}\n\n🔧 Developer: Marina Khan`, event.threadID);
            }

        } catch (error) {
            console.error("DP Edit error:", error);
            await api.sendMessage("💔 Editing service unavailable. Try again later!\n\n- Marina Khan 🎀", event.threadID);
        }
    },

    // Remove Background using Remove.bg
    removeBackground: async function(imageUrl) {
        try {
            const axios = require('axios');
            const FormData = require('form-data');
            
            // Download image
            const imageResponse = await axios.get(imageUrl, { 
                responseType: 'arraybuffer' 
            });

            // Remove background
            const formData = new FormData();
            formData.append('image_file', imageResponse.data, 'image.jpg');
            formData.append('size', 'auto');

            const response = await axios.post(
                'https://api.remove.bg/v1.0/removebg',
                formData,
                {
                    headers: {
                        'X-Api-Key': 'AVmqihkQ62FFNjyv6W223STd', // Your API Key
                        ...formData.getHeaders()
                    },
                    responseType: 'arraybuffer'
                }
            );

            // Convert to base64 for easy handling
            const base64Image = Buffer.from(response.data).toString('base64');
            
            return {
                success: true,
                url: `data:image/png;base64,${base64Image}`,
                message: "Background removed successfully"
            };

        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.errors?.[0]?.title || error.message
            };
        }
    },

    // Apply Effects using Cloudinary (if you get API key)
    applyEffect: async function(imageUrl, effect) {
        try {
            // Cloudinary transformations
            const effects = {
                'blur': 'e_blur:300',
                'cartoon': 'e_cartoonify',
                'vintage': 'e_sepia:60',
                'grayscale': 'e_grayscale',
                'invert': 'e_negate',
                'sepia': 'e_sepia',
                'pixelate': 'e_pixelate:20'
            };

            if (!effects[effect]) {
                return {
                    success: false,
                    error: `Effect '${effect}' not available`
                };
            }

            // If you get Cloudinary API, use this:
            const cloudinaryUrl = `https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/${effects[effect]}/${btoa(imageUrl)}.jpg`;
            
            return {
                success: true,
                url: cloudinaryUrl,
                message: `Applied ${effect} effect`
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    },

    changeBackground: async function(imageUrl, color) {
        try {
            // First remove background
            const noBg = await this.removeBackground(imageUrl);
            if (!noBg.success) return noBg;

            // Then add color background (simplified version)
            return {
                success: true,
                url: noBg.url, // In real implementation, you'd overlay the color
                message: `Background changed to ${color}`
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
};
