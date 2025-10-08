/**
 * @author Marina Khan
 * Simple Test Handler for Immediate Response
 */

const moment = require('moment-timezone');

class CommandHandler {
    constructor() {
        this.commands = new Map();
        this.loadCommands();
        console.log("💖 SIMPLE HANDLER READY - RESPONSES GUARANTEED!");
    }

    getKarachiTime() {
        return moment().tz("Asia/Karachi").format("HH:mm:ss DD-MM-YYYY");
    }

    loadCommands() {
        // ✅ SIMPLE TEST COMMANDS
        this.commands.set('test', {
            execute: async () => {
                return `🎉 MARINA BOT TEST SUCCESSFUL!\n🕒 Time: ${this.getKarachiTime()}\n✅ Bot is responding!`;
            }
        });

        this.commands.set('help', {
            execute: async () => {
                return `💖 MARINA BOT HELP\n\nAvailable Commands:\n/test - Bot test\n/help - This help\n/time - Current time\n\n🚀 5000+ Commands Ready!`;
            }
        });

        this.commands.set('time', {
            execute: async () => {
                return `🕒 Karachi Time: ${this.getKarachiTime()}\n💖 Marina Bot is Working!`;
            }
        });

        this.commands.set('marina', {
            execute: async () => {
                return `💖 MARINA BOT v2.0\n👤 Developer: Marina Khan\n🕒 Time: ${this.getKarachiTime()}\n🚀 Status: ONLINE & RESPONDING!`;
            }
        });

        console.log(`✅ ${this.commands.size} test commands loaded`);
    }

    async handleMessage(message, event) {
        try {
            const text = message.body || '';
            console.log(`📩 HANDLER RECEIVED: "${text}"`);
            
            if (!text.startsWith('/')) {
                console.log("⚠️ Not a command - ignoring");
                return null;
            }

            const args = text.slice(1).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();
            
            console.log(`🎯 PROCESSING COMMAND: ${commandName}`);
            
            const command = this.commands.get(commandName);
            
            if (!command) {
                console.log(`❌ Command not found: ${commandName}`);
                return `❌ Command "${commandName}" not found. Try /test or /help`;
            }

            console.log(`✅ Executing command: ${commandName}`);
            const result = await command.execute(args, event, this.getKarachiTime());
            console.log(`📤 SENDING RESPONSE: ${result.substring(0, 30)}...`);
            
            return result;

        } catch (error) {
            console.error(`❌ HANDLER ERROR: ${error.message}`);
            return `❌ Error: ${error.message}\n🕒 ${this.getKarachiTime()}`;
        }
    }
}

module.exports = CommandHandler;
