module.exports = {
    config: {
        name: "nobg",
        version: "2.0",
        author: "Marina",
        countDown: 5,
        role: 0,
        description: {
            en: "Remove background from any image (reply to photo/DP/PNG)"
        },
        category: "media",
        guide: {
            en: "Simply reply to any image with '{p}nobg' to remove background"
        }
    },

    onStart: async function ({ api, event, args }) {
        try {
            // Check if user replied to a message with image
            if (event.type !== "message_reply" || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
                return await api.sendMessage(`🎨 **BACKGROUND REMOVER BY MARINA** 🎨

✨ **Remove background from any image!**

📝 **How to use:**
1. Reply to any photo/DP/PNG image
2. Type: {p}nobg
3. I'll remove the background instantly!

📸 **Supported formats:**
• JPG/JPEG images
• PNG images  
• Profile pictures
• Any photo with clear subject

💖 **Example:**
Reply to any image and type: {p}nobg

🎯 **Features:**
✅ AI-powered background removal
✅ High quality transparent PNG
✅ Fast processing
✅ Perfect cutouts

- Marina 💝`, event.threadID);
            }

            const attachment = event.messageReply.attachments[0];
            
            // Check if it's an image
            if (!attachment.type || !attachment.type.startsWith('image')) {
                return await api.sendMessage("❌ Please reply to an image file (jpg, png, etc.) to remove background!", event.threadID);
            }

            await api.sendMessage("🔄 Removing background from your image... Please wait! ✨", event.threadID);

            const imageUrl = attachment.url;
            const result = await this.removeBackground(imageUrl);
            
            if (result.success) {
                await api.sendMessage({
                    body: `✨ **BACKGROUND REMOVED SUCCESSFULLY!** ✨

✅ Perfect AI cutout
✅ Transparent PNG format
✅ High quality result
✅ Ready to use anywhere!

💝 Processed by Marina's Magic 🎀

📁 **Now you can:**
• Use as transparent sticker
• Add new backgrounds
• Create professional edits
• Share as profile picture`,
                    attachment: result.imageStream
                }, event.threadID);
            } else {
                await api.sendMessage(`❌ Failed to remove background: ${result.error}\n\n💡 **Tips for better results:**\n• Use clear, high-quality images\n• Ensure good contrast between subject and background\n• Avoid complex hair/fur details\n• Use images with solid backgrounds`, event.threadID);
            }

        } catch (error) {
            console.error("Background remove error:", error);
            await api.sendMessage("💔 Sorry darling! I couldn't process the image right now. Please try again with a different image! 🎀", event.threadID);
        }
    },

    removeBackground: async function(imageUrl) {
        try {
            const removeBGApi = {
                apiKey: "AVmqihkQ62FFNjyv6W223STd",
                endpoint: "https://api.remove.bg/v1.0/removebg"
            };

            // Using global.utils.getStreamFromURL for better compatibility
            const imageStream = await global.utils.getStreamFromURL(imageUrl);
            
            const formData = new FormData();
            formData.append('image_file', imageStream);
            formData.append('size', 'auto');
            formData.append('format', 'png');
            formData.append('quality', '100');

            const response = await fetch(removeBGApi.endpoint, {
                method: 'POST',
                headers: {
                    'X-Api-Key': removeBGApi.apiKey,
                },
                body: formData
            });

            if (response.ok) {
                const imageBuffer = await response.buffer();
                return {
                    success: true,
                    imageStream: imageBuffer
                };
            } else {
                const errorText = await response.text();
                return {
                    success: false,
                    error: `API Error: ${response.status} - ${errorText}`
                };
            }

        } catch (error) {
            console.error("Remove.bg API error:", error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    // Handle when someone mentions background removal
    onChat: async function ({ api, event }) {
        if (event.body && event.body.toLowerCase().includes('{p}nobg') && event.messageReply) {
            // Auto-trigger if someone types {p}nobg while replying to an image
            setTimeout(async () => {
                await this.onStart({ api, event, args: [] });
            }, 500);
        }
    }
};
