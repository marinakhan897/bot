const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');

// Directory to store saved codes
const codeDirectory = path.join(__dirname, '..', 'saved_codes');

module.exports = {
    config: {
        name: "codesave",
        version: "1.0",
        author: "Marina",
        countDown: 5,
        role: 1,
        description: {
            en: "Save and execute code snippets automatically"
        },
        category: "developer",
        guide: {
            en: "{p}codesave save [filename] | [code]\n{p}codesave run [filename]\n{p}codesave list\n{p}codesave delete [filename]"
        }
    },

    onStart: async function ({ api, event, args }) {
        await this.ensureCodeDir();
        
        const action = args[0];
        
        if (!action) {
            const helpMessage = `💾 **MARINA CODE SAVER SYSTEM** 💾

👑 **Powered by Marina - Advanced Developer**

🎯 **Commands:**
• {p}codesave save [filename] | [code]
• {p}codesave run [filename] 
• {p}codesave list
• {p}codesave delete [filename]
• {p}codesave view [filename]

💡 **Examples:**
{p}codesave save test.js | module.exports = { onStart: ({ api, event }) => api.sendMessage("Hello!", event.threadID) }
{p}codesave run test.js
{p}codesave save islamic.js | // Islamic auto-reply code here

🚀 **Marina's Code Engine - Save & Execute Instantly!**`;

            await api.sendMessage(helpMessage, event.threadID);
            return;
        }

        try {
            switch (action) {
                case 'save':
                    await this.handleSaveCode(api, event, args.slice(1));
                    break;
                case 'run':
                    await this.handleRunCode(api, event, args.slice(1));
                    break;
                case 'list':
                    await this.handleListCodes(api, event);
                    break;
                case 'delete':
                    await this.handleDeleteCode(api, event, args.slice(1));
                    break;
                case 'view':
                    await this.handleViewCode(api, event, args.slice(1));
                    break;
                default:
                    await api.sendMessage("❌ Invalid action. Use save, run, list, or delete.", event.threadID);
            }
        } catch (error) {
            console.error(error);
            await api.sendMessage("❌ Marina encountered an error processing your request.", event.threadID);
        }
    },

    handleSaveCode: async function (api, event, args) {
        const input = args.join(' ');
        const [filename, ...codeParts] = input.split('|');
        
        if (!filename || !codeParts.length) {
            return api.sendMessage("❌ Use: codesave save [filename] | [code]", event.threadID);
        }

        const cleanFilename = filename.trim().replace(/[^a-zA-Z0-9._-]/g, '_');
        const code = codeParts.join('|').trim();
        const filePath = path.join(codeDirectory, cleanFilename);

        // Ensure it's a .js file
        const finalFilename = cleanFilename.endsWith('.js') ? cleanFilename : cleanFilename + '.js';
        const finalPath = path.join(codeDirectory, finalFilename);

        await fs.writeFile(finalPath, code, 'utf8');
        
        await api.sendMessage(`✅ **Marina Saved Code Successfully!** ✅

📁 File: ${finalFilename}
💾 Location: saved_codes/
💫 Status: Ready to execute!

Use: {p}codesave run ${finalFilename}`, event.threadID);
    },

    handleRunCode: async function (api, event, args) {
        const filename = args[0];
        if (!filename) {
            return api.sendMessage("❌ Use: codesave run [filename]", event.threadID);
        }

        const cleanFilename = filename.endsWith('.js') ? filename : filename + '.js';
        const filePath = path.join(codeDirectory, cleanFilename);

        if (!fs.existsSync(filePath)) {
            return api.sendMessage(`❌ File "${cleanFilename}" not found in saved codes.`, event.threadID);
        }

        try {
            // Load and execute the code
            const codeModule = require(filePath);
            
            if (typeof codeModule.onStart === 'function') {
                await codeModule.onStart({ api, event, args: args.slice(1) });
                await api.sendMessage(`🚀 **Marina Executed Code Successfully!** 🚀\n\n📁 File: ${cleanFilename}\n✅ Execution: Completed`, event.threadID);
            } else {
                await api.sendMessage(`❌ No onStart function found in ${cleanFilename}`, event.threadID);
            }
        } catch (error) {
            await api.sendMessage(`❌ **Execution Error in ${cleanFilename}**\n\nError: ${error.message}`, event.threadID);
        }
    },

    handleListCodes: async function (api, event) {
        const files = await fs.readdir(codeDirectory);
        const jsFiles = files.filter(file => file.endsWith('.js'));
        
        if (jsFiles.length === 0) {
            return api.sendMessage("📁 No saved codes found. Save some code first!", event.threadID);
        }

        let list = "💾 **Marina's Saved Codes** 💾\n\n";
        jsFiles.forEach((file, index) => {
            const stats = fs.statSync(path.join(codeDirectory, file));
            list += `${index + 1}. ${file} (${this.formatFileSize(stats.size)})\n`;
        });

        list += `\n💫 Total: ${jsFiles.length} saved codes\n👑 Use: codesave run [filename]`;

        await api.sendMessage(list, event.threadID);
    },

    handleDeleteCode: async function (api, event, args) {
        const filename = args[0];
        if (!filename) {
            return api.sendMessage("❌ Use: codesave delete [filename]", event.threadID);
        }

        const cleanFilename = filename.endsWith('.js') ? filename : filename + '.js';
        const filePath = path.join(codeDirectory, cleanFilename);

        if (!fs.existsSync(filePath)) {
            return api.sendMessage(`❌ File "${cleanFilename}" not found.`, event.threadID);
        }

        await fs.remove(filePath);
        await api.sendMessage(`✅ **Marina Deleted Code** ✅\n\n📁 File: ${cleanFilename}\n🗑️ Status: Permanently deleted`);
    },

    handleViewCode: async function (api, event, args) {
        const filename = args[0];
        if (!filename) {
            return api.sendMessage("❌ Use: codesave view [filename]", event.threadID);
        }

        const cleanFilename = filename.endsWith('.js') ? filename : filename + '.js';
        const filePath = path.join(codeDirectory, cleanFilename);

        if (!fs.existsSync(filePath)) {
            return api.sendMessage(`❌ File "${cleanFilename}" not found.`, event.threadID);
        }

        const code = await fs.readFile(filePath, 'utf8');
        const preview = code.length > 1000 ? code.substring(0, 1000) + '...' : code;
        
        await api.sendMessage(`📄 **Code Preview: ${cleanFilename}** 📄\n\n\`\`\`javascript\n${preview}\n\`\`\``, event.threadID);
    },

    formatFileSize: function (bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    ensureCodeDir: async function () {
        await fs.ensureDir(codeDirectory);
    }
};
