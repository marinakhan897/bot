module.exports = {
    config: {
        name: "removebg",
        version: "3.0",
        author: "Marina Khan",
        countDown: 5,
        role: 0,
        description: {
            en: "AI background removal - Created by Marina Khan"
        },
        category: "media",
        guide: {
            en: "Reply to image with {p}removebg"
        }
    },

    onStart: async function ({ api, event, args }) {
        try {
            if (event.type !== "message_reply" || !event.messageReply.attachments?.[0]) {
                return await api.sendMessage(`🎨 **Background Remover** 🎨
                
💖 **Created by: Marina Khan**
✨ **AI-Powered Background Removal**

📝 **Usage:**
Reply to any image with: {p}removebg

📸 **Works with:**
• Profile Pictures (DP)
• PNG/JPG Images  
• Photos & Selfies
• Any clear image

🎯 **Result:**
Perfect transparent background PNG

💝 **Example:**
[Reply to image] + {p}removebg

- Marina Khan 🎀`, event.threadID);
            }

            const attachment = event.messageReply.attachments[0];
            if (!attachment.type?.includes('image')) {
                return await api.sendMessage("❌ Please reply to an image file!", event.threadID);
            }

            await api.sendMessage("🔮 Processing your image... Powered by Marina Khan ✨", event.threadID);

            const result = await this.removeBackgroundSimple(attachment.url);
            
            if (result.success) {
                await api.sendMessage({
                    body: `🎉 **BACKGROUND REMOVED!** 🎉

🌈 **Perfect transparent result!**
⚡ **AI-Powered Precision**
💫 **High Quality Output**

💖 **Created by: Marina Khan**
🎀 **Powered by Remove.bg API**

✨ **Your image is now ready for:**
• Transparent stickers
• New backgrounds  
• Professional edits
• Profile pictures`,
                    attachment: result.imageBuffer
                }, event.threadID);
            } else {
                await api.sendMessage(`❌ Removal failed: ${result.error}\n\n💡 Try with a clearer image!\n\n🔧 **Developer:** Marina Khan`, event.threadID);
            }

        } catch (error) {
            console.error("Error:", error);
            await api.sendMessage("💔 Service temporarily unavailable. Try again later!\n\n- Marina Khan 🎀", event.threadID);
        }
    },

    removeBackgroundSimple: async function(imageUrl) {
        try {
            const axios = require('axios');
            
            // Download image first
            const imageResponse = await axios.get(imageUrl, { 
                responseType: 'arraybuffer' 
            });

            // Send to remove.bg
            const formData = new FormData();
            formData.append('image_file', imageResponse.data, 'image.jpg');
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
                imageBuffer: Buffer.from(response.data)
            };

        } catch (error) {
            let errorMsg = "Unknown error";
            if (error.response) {
                try {
                    const errorData = JSON.parse(Buffer.from(error.response.data).toString());
                    errorMsg = errorData.errors?.[0]?.title || `HTTP ${error.response.status}`;
                } catch {
                    errorMsg = `HTTP ${error.response.status}`;
                }
            } else {
                errorMsg = error.message;
            }
            
            return {
                success: false,
                error: errorMsg
            };
        }
    }
};
