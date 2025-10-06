module.exports = {
    config: {
        name: "nobg",
        version: "2.0",
        author: "Marina", 
        countDown: 5,
        role: 0,
        description: {
            en: "Remove background from any image (reply to photo/DP/PNG) - Created by Marina"
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
💝 **Created and Powered by Marina Khan**

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

- Marina Khan 💝`, event.threadID);
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

💝 Processed by Marina Khan's Magic 🎀

📁 **Now you can:**
• Use as transparent sticker
• Add new backgrounds
• Create professional edits
• Share as profile picture

🌟 **Created by: Marina Khan**`,
                    attachment: result.imageStream
                }, event.threadID);
            } else {
                await api.sendMessage(`❌ Failed to remove background: ${result.error}\n\n💡 **Tips for better results:**\n• Use clear, high-quality images\n• Ensure good contrast between subject and background\n• Avoid complex hair/fur details\n• Use images with solid backgrounds\n\n🔧 **Developer: Marina Khan**`, event.threadID);
            }

        } catch (error) {
            console.error("Background remove error:", error);
            await api.sendMessage("💔 Sorry darling! I couldn't process the image right now. Please try again with a different image! \n\n- Marina Khan 🎀", event.threadID);
        }
    },

    removeBackground: async function(imageUrl) {
        try {
            // Use axios instead of global.utils.request
            const axios = require('axios');
            const FormData = require('form-data');
            
            // First download the image
            const imageResponse = await axios({
                method: 'GET',
                url: imageUrl,
                responseType: 'arraybuffer'
            });

            const formData = new FormData();
            formData.append('image_file', imageResponse.data, {
                filename: 'image.jpg',
                contentType: 'image/jpeg'
            });
            formData.append('size', 'auto');
            
            const response = await axios({
                method: 'POST',
                url: 'https://api.remove.bg/v1.0/removebg',
                data: formData,
                headers: {
                    'X-Api-Key': 'AVmqihkQ62FFNjyv6W223STd',
                    ...formData.getHeaders()
                },
                responseType: 'arraybuffer'
            });

            if (response.status === 200) {
                return {
                    success: true,
                    imageStream: Buffer.from(response.data)
                };
            } else {
                return {
                    success: false,
                    error: `API Error: ${response.status}`
                };
            }

        } catch (error) {
            console.error("Remove.bg API error:", error);
            return {
                success: false,
                error: error.response?.data?.errors?.[0]?.title || error.message
            };
        }
    }
};
