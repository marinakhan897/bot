module.exports = {
    config: {
        name: "removebg",
        version: "3.0",
        author: "Marina", 
        countDown: 5,
        role: 0,
        description: {
            en: "AI-powered background removal for any image"
        },
        category: "media",
        guide: {
            en: "Reply to any image with '{p}removebg'"
        }
    },

    onStart: async function ({ api, event, args }) {
        // If no reply, show help
        if (event.type !== "message_reply") {
            return await this.showHelp(api, event);
        }

        await this.processImage(api, event);
    },

    showHelp: async function (api, event) {
        const helpMessage = `🎨 **AI BACKGROUND REMOVER** 🎨

💖 **Powered by Marina's Magic**

📸 **HOW TO USE:**
1. Find any image (photo, DP, PNG, JPG)
2. Reply to that image
3. Type: {p}removebg
4. Get instant transparent background!

✨ **PERFECT FOR:**
• Profile pictures
• Product photos
• Selfies
• Logos
• Any image with clear subject

🎯 **RESULTS:**
✅ Crystal clear transparent PNG
✅ Professional quality
✅ AI-powered precision
✅ Fast processing

💝 **Example:**
[Reply to any image] + {p}removebg

- Marina 🎀`;
        
        await api.sendMessage(helpMessage, event.threadID);
    },

    processImage: async function (api, event) {
        try {
            const reply = event.messageReply;
            
            if (!reply.attachments || reply.attachments.length === 0) {
                return await api.sendMessage("❌ No image found in your reply! Please reply to a photo, DP, or PNG image.", event.threadID);
            }

            const attachment = reply.attachments[0];
            
            // Validate it's an image
            const validTypes = ['image', 'photo', 'sticker'];
            const isImage = validTypes.some(type => 
                attachment.type?.includes(type) || 
                attachment.mimeType?.startsWith('image/')
            );

            if (!isImage) {
                return await api.sendMessage("❌ Please reply to an image file (JPG, PNG, photo, DP) to remove background!", event.threadID);
            }

            await api.sendMessage("🔮 Working my magic... Removing background with AI! ✨", event.threadID);

            const result = await this.callRemoveBG(attachment.url);
            
            if (result.success) {
                await api.sendMessage({
                    body: `🎉 **BACKGROUND REMOVED!** 🎉

🌈 **Your image is now transparent!**

📊 **Quality: Excellent**
🎯 **Precision: Perfect**
⚡ **Speed: Lightning Fast**

💖 **Now you can:**
• Use as WhatsApp sticker
• Set as transparent DP
• Add creative backgrounds
• Use in professional designs

✨ Processed with love by Marina 🎀`,
                    attachment: result.imageBuffer
                }, event.threadID);
                
                // Send tips for best results
                setTimeout(async () => {
                    await api.sendMessage(`💡 **PRO TIPS FOR BEST RESULTS:**\n\n• Use images with clear subjects\n• Good lighting = better cutouts\n• Solid backgrounds work best\n• High-quality images = perfect results\n\nTry with different images! 🎨`, event.threadID);
                }, 2000);
                
            } else {
                await api.sendMessage(`❌ Oops! Background removal failed.\n\n🔧 **Error:** ${result.error}\n\n💡 **Try this:**\n• Use a clearer image\n• Ensure good contrast\n• Avoid busy backgrounds\n• Try a different image\n\nI believe in your next attempt! 💝`, event.threadID);
            }

        } catch (error) {
            console.error("Process error:", error);
            await api.sendMessage("💔 My magic wand is tired! Please try again in a moment darling! 🎀", event.threadID);
        }
    },

    callRemoveBG: async function (imageUrl) {
        try {
            const response = await global.utils.request({
                method: 'POST',
                url: 'https://api.remove.bg/v1.0/removebg',
                headers: {
                    'X-Api-Key': 'AVmqihkQ62FFNjyv6W223STd',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    image_url: imageUrl,
                    size: 'auto',
                    format: 'png',
                    quality: 100
                }),
                encoding: null
            });

            if (response.statusCode === 200) {
                return {
                    success: true,
                    imageBuffer: response.body
                };
            } else {
                return {
                    success: false,
                    error: `API returned status: ${response.statusCode}`
                };
            }
        } catch (error) {
            return {
                success: false, 
                error: error.message
            };
        }
    }
};
