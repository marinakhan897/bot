/**
 * @author Marina Khan
 * Direct Message Handler for Marina Bot
 */

const CommandHandler = require('../../scripts/cmds/handler');
const commandHandler = new CommandHandler();

console.log("💖 MARINA BOT DIRECT HANDLER LOADED");

module.exports = async function marinaMessageHandler(api, event) {
    try {
        // Check if message exists and starts with command prefix
        if (!event.body || !event.body.startsWith('/')) {
            return;
        }

        const message = event.body;
        const threadID = event.threadID;
        const messageID = event.messageID;
        
        console.log(`💬 Marina Bot Received: ${message}`);
        console.log(`👤 From: ${event.senderID}, Thread: ${threadID}`);

        // Process command through Marina Bot handler
        const response = await commandHandler.handleMessage(event, event);
        
        if (response) {
            console.log(`✅ Sending Response: ${response.substring(0, 50)}...`);
            await api.sendMessage(response, threadID, messageID);
            console.log("🎉 Response Sent Successfully!");
        } else {
            console.log("⚠️ No response from command handler");
        }

    } catch (error) {
        console.error("❌ Marina Handler Error:", error.message);
        
        // Send error message to user
        try {
            await api.sendMessage(
                `❌ Marina Bot Error: ${error.message}\n🕒 Please try again later.`,
                event.threadID,
                event.messageID
            );
        } catch (sendError) {
            console.error("❌ Failed to send error message:", sendError.message);
        }
    }
};
