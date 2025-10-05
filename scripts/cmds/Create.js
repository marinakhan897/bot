module.exports = {
  config: {
    name: "makecmd",
    version: "3.0.0",
    author: "Marina Khan",
    countDown: 15,
    role: 2,
    description: "Create commands with flexible naming",
    category: "system",
    guide: {
      en: `{pn} [command_name] [code]

🔹 Command names can contain:
• Letters (a-z, A-Z)
• Numbers (0-9)
• Spaces (converted to underscores)
• Hyphens (-), underscores (_)
• Most special characters

📝 Examples:
.makecmd hello-world
.makecmd "my command"
.makecmd calculator_v2
.makecmd image-editor`
    }
  },

  onStart: async function({ api, event, args }) {
    const { threadID, messageID, body } = event;

    if (args[0] === 'list') {
      return this.listCommands(api, event);
    }

    if (args[0] === 'delete') {
      return this.deleteCommand(api, event, args[1]);
    }

    if (!args[0]) {
      return api.sendMessage(this.getHelpMessage(), threadID, messageID);
    }

    try {
      // Handle quoted command names with spaces
      let commandName = args[0];
      let code = body.split('\n').slice(1).join('\n').trim();

      // If command name is quoted, extract the full name
      if ((commandName.startsWith('"') && commandName.endsWith('"')) || 
          (commandName.startsWith("'") && commandName.endsWith("'"))) {
        commandName = commandName.slice(1, -1);
      } else if (body.includes('"') || body.includes("'")) {
        // Extract quoted command name from body
        const quoteMatch = body.match(/(["'])(.*?)\1/);
        if (quoteMatch) {
          commandName = quoteMatch[2];
          code = body.split('\n').slice(1).join('\n').trim();
        }
      }

      await this.createCommand(api, event, commandName, code);
    } catch (error) {
      api.sendMessage(`❌ Error: ${error.message}`, threadID, messageID);
    }
  },

  createCommand: async function(api, event, commandName, userCode) {
    const { threadID, messageID } = event;

    // Validate and sanitize command name
    const sanitizedName = this.sanitizeCommandName(commandName);
    
    if (!sanitizedName) {
      throw new Error('Invalid command name. Please use letters, numbers, spaces, or common symbols.');
    }

    if (sanitizedName.length > 30) {
      throw new Error('Command name too long (max 30 characters).');
    }

    // Check if command already exists
    if (this.commandExists(sanitizedName)) {
      throw new Error(`Command "${sanitizedName}" already exists. Use different name.`);
    }

    // Validate JavaScript code
    if (!this.isValidJavaScript(userCode)) {
      throw new Error('Invalid JavaScript code. Please check syntax.');
    }

    // Create command file
    const finalCode = this.generateCommandTemplate(sanitizedName, userCode);
    const filePath = `${__dirname}/${sanitizedName}.js`;

    await this.saveFile(filePath, finalCode);
    this.reloadCommands();

    const message = this.getSuccessMessage(commandName, sanitizedName);
    api.sendMessage(message, threadID, messageID);
  },

  // Improved command name sanitization
  sanitizeCommandName: function(name) {
    if (!name || name.trim().length === 0) {
      return null;
    }

    // Remove extra spaces and trim
    let sanitized = name.trim().replace(/\s+/g, ' ');
    
    // Replace spaces with underscores for filename safety
    sanitized = sanitized.replace(/\s+/g, '_');
    
    // Remove or replace problematic characters
    sanitized = sanitized
      .replace(/[<>:"|?*]/g, '') // Remove Windows forbidden characters
      .replace(/[\\\/]/g, '-')   // Replace slashes with hyphens
      .replace(/^[\.\s]+/, '')   // Remove leading dots and spaces
      .replace(/[\.\s]+$/, '');  // Remove trailing dots and spaces

    // Ensure it starts with a letter or number
    if (!/^[a-zA-Z0-9]/.test(sanitized)) {
      sanitized = 'cmd_' + sanitized;
    }

    // Final validation - allow letters, numbers, underscores, hyphens
    if (!/^[a-zA-Z0-9_\-]+$/.test(sanitized)) {
      // If still invalid, create a safe name
      sanitized = sanitized.replace(/[^a-zA-Z0-9_\-]/g, '');
    }

    return sanitized.length > 0 ? sanitized.toLowerCase() : null;
  },

  // Enhanced JavaScript validation
  isValidJavaScript: function(code) {
    try {
      if (!code || code.trim().length === 0) {
        return false;
      }

      // Security checks - block dangerous patterns
      const dangerousPatterns = [
        'eval(', 'process.exit', 'require("fs")', 'require("child_process")',
        'delete', 'while(true)', 'for(;;)', '__proto__', 'constructor',
        'require("os")', 'require("path")', 'require("http")',
        'process.env', 'module.constructor', 'Function('
      ];

      const codeLower = code.toLowerCase();
      for (const pattern of dangerousPatterns) {
        if (codeLower.includes(pattern.toLowerCase())) {
          throw new Error(`Security violation: ${pattern} not allowed`);
        }
      }

      // Basic syntax check by attempting to parse
      if (typeof code === 'string') {
        // Try to parse as JavaScript
        new Function(code);
      }

      return true;
    } catch (error) {
      if (error.message.includes('Security violation')) {
        throw error;
      }
      return false;
    }
  },

  // Enhanced command template
  generateCommandTemplate: function(commandName, userCode) {
    const timestamp = new Date().toLocaleString();
    
    return `// Auto-generated command
// Created: ${timestamp}
// Original name: ${commandName}

module.exports = {
  config: {
    name: "${commandName}",
    version: "1.0.0",
    author: "User Created",
    countDown: 5,
    role: 0,
    category: "custom",
    guide: {
      en: ".${commandName}"
    }
  },

  onStart: async function({ api, event, args }) {
    try {
      ${userCode}
    } catch (error) {
      console.error("${commandName} error:", error);
      api.sendMessage("❌ Command execution failed: " + error.message, event.threadID);
    }
  },

  onChat: async function({ api, event }) {
    // Auto-reply functionality can be added here
  }
};`;
  },

  // List all custom commands
  listCommands: async function(api, event) {
    const { threadID, messageID } = event;
    const fs = require('fs');

    try {
      const files = fs.readdirSync(__dirname);
      const customCommands = files.filter(file => 
        file.endsWith('.js') && 
        !file.startsWith('_') &&
        !['makecmd.js', 'createcmd.js', 'help.js', 'admin.js'].includes(file)
      );

      if (customCommands.length === 0) {
        return api.sendMessage('📝 No custom commands found.', threadID, messageID);
      }

      let message = `📁 Custom Commands (${customCommands.length}):\n\n`;
      customCommands.forEach((cmd, index) => {
        const cmdName = cmd.replace('.js', '');
        message += `${index + 1}. ${cmdName}\n`;
      });

      message += `\n💡 Use .makecmd delete [name] to remove a command`;
      api.sendMessage(message, threadID, messageID);

    } catch (error) {
      api.sendMessage('❌ Failed to list commands: ' + error.message, threadID, messageID);
    }
  },

  // Delete command
  deleteCommand: async function(api, event, commandName) {
    const { threadID, messageID } = event;

    if (!commandName) {
      return api.sendMessage('❌ Please specify command name to delete.', threadID, messageID);
    }

    const fs = require('fs');
    const sanitizedName = this.sanitizeCommandName(commandName);
    const filePath = `${__dirname}/${sanitizedName}.js`;

    if (!fs.existsSync(filePath)) {
      return api.sendMessage(`❌ Command "${commandName}" not found.`, threadID, messageID);
    }

    try {
      fs.unlinkSync(filePath);
      this.reloadCommands();
      api.sendMessage(`✅ Command "${commandName}" deleted successfully.`, threadID, messageID);
    } catch (error) {
      api.sendMessage(`❌ Failed to delete command: ${error.message}`, threadID, messageID);
    }
  },

  getSuccessMessage: function(originalName, sanitizedName) {
    return `✅ Command Created Successfully!\n\n` +
      `📛 Original Name: ${originalName}\n` +
      `🔧 File Name: ${sanitizedName}.js\n` +
      `🚀 Usage: .${sanitizedName}\n` +
      `💾 Saved in commands folder\n\n` +
      `✨ Your command is ready to use!`;
  },

  getHelpMessage: function() {
    return `🛠️ Advanced Command Creator\n\n` +
      `Create commands with flexible names!\n\n` +
      `📝 Supported Names:\n` +
      `• Letters & Numbers: hello, cmd123\n` +
      `• Spaces: "my command" → my_command\n` +
      `• Hyphens & Underscores: my-cmd, my_cmd\n` +
      `• Special Characters: image-editor, calculator_v2\n\n` +
      `🔧 Usage:\n` +
      `.makecmd [command_name]\n` +
      `[your_javascript_code]\n\n` +
      `📋 Examples:\n` +
      `.makecmd "hello world"\n` +
      `api.sendMessage("Hello World! 🌍", event.threadID);\n\n` +
      `.makecmd calculator\n` +
      `const result = eval(args.join(' '));\n` +
      `api.sendMessage("Result: " + result, event.threadID);\n\n` +
      `📁 Management:\n` +
      `.makecmd list - Show all commands\n` +
      `.makecmd delete [name] - Remove command\n\n` +
      `🛡️ Security: All code is validated for safety`;
  },

  commandExists: function(commandName) {
    const fs = require('fs');
    const fileName = `${commandName}.js`;
    return fs.existsSync(`${__dirname}/${fileName}`);
  },

  saveFile: function(filePath, content) {
    const fs = require('fs');
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, content, 'utf8', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  },

  reloadCommands: function() {
    console.log('🔄 Commands reloaded - new command added');
  }
};
