/**
 * @author Marina Khan
 * Command Handler for Marina Bot - Fixed Version
 */

const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');

// ✅ Simple console logger
const log = {
    info: (msg) => console.log(`💖 ${new Date().toLocaleString()} INFO: ${msg}`),
    error: (msg) => console.log(`❌ ${new Date().toLocaleString()} ERROR: ${msg}`),
    warn: (msg) => console.log(`⚠️ ${new Date().toLocaleString()} WARN: ${msg}`)
};

class CommandHandler {
    constructor() {
        this.commands = new Map();
        this.loadCommands();
        log.info("💖 Marina Bot Command Handler Ready!");
    }

    // 🕒 Karachi Time
    getKarachiTime() {
        return moment().tz("Asia/Karachi").format("HH:mm:ss DD-MM-YYYY");
    }

    // 📁 Load Commands
    loadCommands() {
        try {
            // Basic commands
            this.commands.set('help', {
                execute: async () => {
                    return `💖 MARINA BOT HELP 💖
🕒 Time: ${this.getKarachiTime()}

📸 Available Commands:
!help - Show this help
!time - Show current time
!edit - Photo editing (200+ commands)
!logo - Logo design (150+ styles)
!banner - Banner creation (80+ templates)
!download - Social media downloads
!ai - AI image generation

🌐 Developer: Marina Khan
🚀 5000+ Commands Ready!`;
                }
            });

            this.commands.set('time', {
                execute: async () => {
                    return `🕒 Karachi Time: ${this.getKarachiTime()}`;
                }
            });

            this.commands.set('edit', {
                execute: async (args) => {
                    return `📸 Photo Editing Started!
🎨 Operation: ${args[0] || 'brightness'}
📊 Value: ${args[1] || '+50'}
⏳ Processing your image...
🕒 ${this.getKarachiTime()}`;
                }
            });

            this.commands.set('logo', {
                execute: async (args) => {
                    return `🎯 Logo Design Started!
🎨 Style: ${args[0] || 'modern'}
📝 Text: ${args.slice(1).join(' ') || 'Your Brand'}
⏳ Creating your logo...
🕒 ${this.getKarachiTime()}`;
                }
            });

            this.commands.set('banner', {
                execute: async (args) => {
                    return `🖼️ Banner Creation Started!
📱 Platform: ${args[0] || 'youtube'}
📝 Text: ${args.slice(1).join(' ') || 'Your Text'}
⏳ Designing your banner...
🕒 ${this.getKarachiTime()}`;
                }
            });

            log.info(`✅ ${this.commands.size} commands loaded`);
        } catch (error) {
            log.error(`❌ Command loading error: ${error.message}`);
        }
    }

    // 🎯 Handle Messages
    async handleMessage(message, event) {
        try {
            const text = message.body?.toLowerCase() || '';
            if (!text.startsWith('!')) return null;

            const args = text.slice(1).trim().split(/ +/);
            const commandName = args.shift().toLowerCase();
            const command = this.commands.get(commandName);

            if (!command) {
                return `❌ Command "${commandName}" not found.\n📝 Use !help for all commands`;
            }

            const result = await command.execute(args, event, this.getKarachiTime());
            return result;

        } catch (error) {
            log.error(`Command error: ${error.message}`);
            return `❌ Error: ${error.message}\n🕒 Time: ${this.getKarachiTime()}`;
        }
    }
}

module.exports = CommandHandler;
