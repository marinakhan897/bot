module.exports = {
    config: {
        name: "dpedit",
        version: "4.0",
        author: "Marina Khan",
        countDown: 5,
        role: 0,
        description: {
            en: "Edit any DP by replying to it - By Marina Khan"
        },
        category: "media",
        guide: {
            en: "Reply to any DP with: {p}dpedit [effect]"
        }
    },

    onStart: async function ({ api, event, args }) {
        try {
            // Check if user replied to a message
            if (event.type !== "message_reply" || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
                return await api.sendMessage(`🎨 **DP EDITOR BY MARINA KHAN** 🎨

💖 **Edit any DP by replying to it!**

📝 **How to use:**
1. Reply to any DP/Profile Picture
2. Type: {p}dpedit [effect]
3. Get edited DP instantly!

🎭 **Available Effects:**
• removebg - Remove background
• blur - Blur background  
• cartoon - Cartoon effect
• vintage - Vintage look
• grayscale - Black & white
• sepia - Old photo effect
• invert - Color invert

💡 **Examples:**
Reply to DP + {p}dpedit removebg
Reply to DP + {p}dpedit cartoon
Reply to DP + {p}dpedit blur

✨ **Powered by AI Magic**
🌟 **Created by Marina Khan**`, event.threadID);
            }

            const attachment = event.messageReply.attachments[0];
            
            // Check if it's an image
            if (!attachment.type || !attachment.type.startsWith('image')) {
                return await api.sendMessage("❌ Please reply to a DP or image file!", event.threadID);
            }

            const effect = args[0] ? args[0].toLowerCase() : 'removebg';
            
            if (!['removebg', 'blur', 'cartoon', 'vintage', 'grayscale', 'sepia', 'invert'].includes(effect)) {
                return await api.sendMessage(`❌ Invalid effect! Available effects:\n\n• removebg\n• blur\n• cartoon\n• vintage\n• grayscale\n• sepia\n• invert\n\nUsage: Reply to DP + {p}dpedit [effect]`, event.threadID);
            }

            await api.sendMessage(`🎨 Applying ${effect} effect to your DP...`, event.threadID);

            const imageUrl = attachment.url;
            const result = await this.processImage(imageUrl, effect);
            
            if (result.success) {
                await api.sendMessage({
                    body: `✨ **DP EDITING COMPLETE!** ✨

✅ Effect: ${effect}
✅ Quality: Excellent  
✅ Status: Success

💖 Processed by Marina Khan
🎀 AI-Powered Editing

📸 **Your DP has been magically edited!**`,
                    attachment: result.imageStream
                }, event.threadID);
            } else {
                await api.sendMessage(`❌ Editing failed: ${result.error}\n\n💡 Try with a different DP or effect!\n\n🔧 Developer: Marina Khan`, event.threadID);
            }

        } catch (error) {
            console.error("DP Edit error:", error);
            await api.sendMessage("💔 Editing service busy! Try again later.\n\n- Marina Khan 🎀", event.threadID);
        }
    },

    processImage: async function(imageUrl, effect) {
        try {
            const axios = require('axios');
            const FormData = require('form-data');
            
            // Download the image
            const imageResponse = await axios.get(imageUrl, {
                responseType: 'arraybuffer'
            });

            let processedImage;

            // Apply different effects
            switch(effect) {
                case 'removebg':
                    processedImage = await this.removeBackground(imageResponse.data);
                    break;
                case 'blur':
                    processedImage = await this.applyBlur(imageResponse.data);
                    break;
                case 'cartoon':
                    processedImage = await this.applyCartoon(imageResponse.data);
                    break;
                case 'vintage':
                    processedImage = await this.applyVintage(imageResponse.data);
                    break;
                case 'grayscale':
                    processedImage = await this.applyGrayscale(imageResponse.data);
                    break;
                case 'sepia':
                    processedImage = await this.applySepia(imageResponse.data);
                    break;
                case 'invert':
                    processedImage = await this.applyInvert(imageResponse.data);
                    break;
                default:
                    processedImage = await this.removeBackground(imageResponse.data);
            }

            return processedImage;

        } catch (error) {
            console.error("Process error:", error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    removeBackground: async function(imageBuffer) {
        try {
            const axios = require('axios');
            const FormData = require('form-data');

            const formData = new FormData();
            formData.append('image_file', imageBuffer, {
                filename: 'dp.jpg',
                contentType: 'image/jpeg'
            });
            formData.append('size', 'auto');

            const response = await axios.post(
                'https://api.remove.bg/v1.0/removebg',
                formData,
                {
                    headers: {
                        'X-Api-Key': 'AVmqihkQ62FFNjyv6W223STd',
                        ...formData.getHeaders()
                    },
                    responseType: 'arraybuffer'
                }
            );

            return {
                success: true,
                imageStream: Buffer.from(response.data)
            };

        } catch (error) {
            return {
                success: false,
                error: "Background removal failed. Try a clearer image."
            };
        }
    },

    applyBlur: async function(imageBuffer) {
        try {
            // Simple blur effect using canvas (you can enhance this)
            const sharp = require('sharp');
            
            const blurredImage = await sharp(imageBuffer)
                .blur(10)
                .toBuffer();

            return {
                success: true,
                imageStream: blurredImage
            };

        } catch (error) {
            return {
                success: false,
                error: "Blur effect failed"
            };
        }
    },

    applyCartoon: async function(imageBuffer) {
        try {
            // Basic cartoon effect
            const sharp = require('sharp');
            
            const cartoonImage = await sharp(imageBuffer)
                .modulate({
                    brightness: 1.2,
                    saturation: 1.5
                })
                .toBuffer();

            return {
                success: true,
                imageStream: cartoonImage
            };

        } catch (error) {
            return {
                success: false,
                error: "Cartoon effect failed"
            };
        }
    },

    applyVintage: async function(imageBuffer) {
        try {
            const sharp = require('sharp');
            
            const vintageImage = await sharp(imageBuffer)
                .sepia()
                .modulate({
                    brightness: 0.9
                })
                .toBuffer();

            return {
                success: true,
                imageStream: vintageImage
            };

        } catch (error) {
            return {
                success: false,
                error: "Vintage effect failed"
            };
        }
    },

    applyGrayscale: async function(imageBuffer) {
        try {
            const sharp = require('sharp');
            
            const grayscaleImage = await sharp(imageBuffer)
                .grayscale()
                .toBuffer();

            return {
                success: true,
                imageStream: grayscaleImage
            };

        } catch (error) {
            return {
                success: false,
                error: "Grayscale effect failed"
            };
        }
    },

    applySepia: async function(imageBuffer) {
        try {
            const sharp = require('sharp');
            
            const sepiaImage = await sharp(imageBuffer)
                .sepia()
                .toBuffer();

            return {
                success: true,
                imageStream: sepiaImage
            };

        } catch (error) {
            return {
                success: false,
                error: "Sepia effect failed"
            };
        }
    },

    applyInvert: async function(imageBuffer) {
        try {
            const sharp = require('sharp');
            
            const invertImage = await sharp(imageBuffer)
                .negate()
                .toBuffer();

            return {
                success: true,
                imageStream: invertImage
            };

        } catch (error) {
            return {
                success: false,
                error: "Invert effect failed"
            };
        }
    }
};
