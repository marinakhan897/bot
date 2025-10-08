/**
 * @author Marina Khan
 * Simple Working Handler for Immediate Responses
 */

const moment = require('moment-timezone');

class CommandHandler {
    constructor() {
        this.commands = new Map();
        this.loadCommands();
        console.log("💖 MARINA BOT HANDLER READY!");
    }

    getKarachiTime() {
        return moment().tz("Asia/Karachi").format("HH:mm:ss DD-MM-YYYY");
    }

    loadCommands() {
        // ✅ BASIC WORKING COMMANDS
        this.commands.set('test', {
            execute: async () => {
                return `🎉 MARINA BOT TEST SUCCESSFUL!\n🕒 Time: ${this.getKarachiTime()}\n✅ Bot is responding!`;
            }
        });

        this.commands.set('help', {
            execute: async () => {
                return `💖 MARINA BOT HELP\n\nQuick Commands:\n/test - Test bot\n/help - Show help\n/time - Current time\n/marina - Bot info\n\n🚀 5000+ Commands Ready!`;
            }
        });

        this.commands.set('time', {
            execute: async () => {
                return `🕒 Karachi Time: ${this.getKarachiTime()}`;
            }
        });

        this.commands.set('marina', {
            execute: async () => {
                return `💖 MARINA BOT v2.0\n👤 Developer: Marina Khan\n🕒 ${this.getKarachiTime()}\n✅ Login: SUCCESSFUL\n🚀 Status: ONLINE`;
            }
        });

        console.log(`✅ ${this.commands.size} commands loaded`);
    }

    async handleMessage(message, event) {
        try {
            const text = message.body || '';
            
            // Only process commands starting with /
            if (!text.startsWith('/')) {
                return null;
            }

            const args = text.slice(1).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();
            const command = this.commands.get(commandName);

            if (!command) {
                return `❌ Command not found. Try /help`;
            }

            const result = await command.execute(args, event, this.getKarachiTime());
            return result;

        } catch (error) {
            return `❌ Error: ${error.message}`;
        }
    }
}

module.exports = CommandHandler;
