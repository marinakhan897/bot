/**
 * @author NTKhang + Marina Khan
 * Enhanced Command Handler with Urdu/English Support
 */

const fs = require('fs');
const path = require('path');
const log = require('../logger/log.js');
const moment = require('moment-timezone');

class CommandHandler {
    constructor() {
        this.commands = new Map();
        this.urduResponses = new Map();
        this.loadCommands();
        this.loadUrduResponses();
    }

    // 🕒 Karachi Time Function
    getKarachiTime() {
        return moment().tz("Asia/Karachi").format("HH:mm:ss DD-MM-YYYY");
    }

    // 📁 Load all command modules
    loadCommands() {
        const commandsDir = path.join(__dirname, 'modules');
        
        try {
            const commandFiles = fs.readdirSync(commandsDir).filter(file => 
                file.endsWith('.js') && file !== 'handler.js'
            );

            for (const file of commandFiles) {
                try {
                    const commandModule = require(path.join(commandsDir, file));
                    if (commandModule.command && commandModule.execute) {
                        this.commands.set(commandModule.command, commandModule);
                        log.info(`✅ Command loaded: ${commandModule.command}`);
                    }
                } catch (error) {
                    log.error(`❌ Error loading command ${file}: ${error.message}`);
                }
            }
            
            log.info(`🎯 Total commands loaded: ${this.commands.size}`);
        } catch (error) {
            log.error(`📁 Commands directory error: ${error.message}`);
        }
    }

    // 🈯 Urdu Responses Loader
    loadUrduResponses() {
        this.urduResponses.set('welcome', '🚀 Marina Bot mein aapka swagat hai!');
        this.urduResponses.set('help', '📚 Madad chahiye? !help command use karein');
        this.urduResponses.set('error', '❌ Masla aya hai, dubara koshish karein');
        this.urduResponses.set('success', '✅ Kaam mukammal ho gaya!');
        this.urduResponses.set('processing', '⏳ Kaam jaari hai, meharbani intezar karein...');
    }

    // 🎯 Process Incoming Messages
    async handleMessage(message, event) {
        try {
            const text = message.body?.toLowerCase() || '';
            
            if (!text.startsWith('!')) return null;

            const args = text.slice(1).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();
            const command = this.commands.get(commandName);

            if (!command) {
                return this.sendMessage(event, 
                    `❌ Command "${commandName}" nahi mila.\n` +
                    `📝 Available commands: !help\n` +
                    `🕒 Time: ${this.getKarachiTime()}`
                );
            }

            // Send processing message
            await this.sendMessage(event, this.urduResponses.get('processing'));

            // Execute command
            const result = await command.execute(args, event, this.getKarachiTime());
            
            if (result) {
                await this.sendMessage(event, result);
            }

        } catch (error) {
            log.error(`Command error: ${error.message}`);
            await this.sendMessage(event, 
                `${this.urduResponses.get('error')}\n` +
                `🔧 Error: ${error.message}\n` +
                `🕒 Time: ${this.getKarachiTime()}`
            );
        }
    }

    // 📤 Send Message Helper
    async sendMessage(event, message) {
        try {
            // Implementation depends on your bot framework
            await event.reply(message);
        } catch (error) {
            log.error(`Send message error: ${error.message}`);
        }
    }

    // 📜 Get All Commands
    getCommandList() {
        return Array.from(this.commands.keys()).sort();
    }
}

module.exports = CommandHandler;
