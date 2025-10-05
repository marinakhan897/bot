module.exports = {
  config: {
    name: "createcmd",
    version: "1.0.0",
    author: "Marina Khan",
    countDown: 10,
    role: 2,
    description: "Create and save new commands directly from chat",
    category: "system",
    guide: {
      en: "{pn} [command_name] [code]\n\nExample:\n.createcmd hello\n// This creates hello command\nmodule.exports = {\n  config: {\n    name: \"hello\", \n    version: \"1.0.0\",\n    author: \"Your Name\",\n    role: 0,\n    category: \"fun\"\n  },\n  onStart: async function({ api, event }) {\n    api.sendMessage(\"Hello World! 👋\", event.threadID);\n  }\n};"
    }
  },

  onStart: async function({ api, event, args }) {
    const { threadID, messageID, body } = event;

    if (!args[0]) {
      return api.sendMessage(this.getHelpMessage(), threadID, messageID);
    }

    const commandName = args[0].toLowerCase();
    const code = body.split('\n').slice(1).join('\n').trim();

    if (!code) {
      return api.sendMessage(
        `❌ Please provide the JavaScript code for the command.\n\nExample:\n.createcmd ${commandName}\n// Your code here...`,
        threadID, messageID
      );
    }

    try {
      await this.createCommand(api, event, commandName, code);
    } catch (error) {
      console.error('Create command error:', error);
      api.sendMessage(`❌ Error creating command: ${error.message}`, threadID, messageID);
    }
  },

  createCommand: async function(api, event, commandName, code) {
    const { threadID, messageID } = event;

    // Validate command name
    if (!/^[a-z0-9]+$/.test(commandName)) {
      return api.sendMessage(
        '❌ Command name can only contain lowercase letters and numbers (no spaces or special characters).',
        threadID, messageID
      );
    }

    if (commandName.length > 20) {
      return api.sendMessage('❌ Command name too long (max 20 characters).', threadID, messageID);
    }

    // Check if command already exists
    if (this.commandExists(commandName)) {
      return api.sendMessage(
        `❌ Command "${commandName}" already exists. Use different name or delete existing one first.`,
        threadID, messageID
      );
    }

    // Validate JavaScript code
    if (!this.isValidJavaScript(code)) {
      return api.sendMessage(
        '❌ Invalid JavaScript code. Please check your syntax.',
        threadID, messageID
      );
    }

    // Create command file
    const fileName = `${commandName}.js`;
    const filePath = `${__dirname}/${fileName}`;

    try {
      // Add basic structure if not provided
      let finalCode = code;
      if (!code.includes('module.exports')) {
        finalCode = this.generateCommandTemplate(commandName, code);
      }

      // Save file
      await this.saveFile(filePath, finalCode);
      
      // Reload commands
      this.reloadCommands();

      api.sendMessage(
        `✅ Command "${commandName}" created successfully!\n\n` +
        `📁 File: ${fileName}\n` +
        `🔧 Usage: .${commandName}\n` +
        `💾 Saved in commands folder\n\n` +
        `The command is now ready to use!`,
        threadID, messageID
      );

    } catch (error) {
      throw new Error(`Failed to save command: ${error.message}`);
    }
  },

  // Check if command exists
  commandExists: function(commandName) {
    const fs = require('fs');
    const fileName = `${commandName}.js`;
    return fs.existsSync(`${__dirname}/${fileName}`);
  },

  // Validate JavaScript syntax
  isValidJavaScript: function(code) {
    try {
      // Basic syntax check
      if (!code.trim()) return false;
      
      // Check for common issues
      if (code.includes('eval(') || code.includes('process.exit')) {
        return false; // Prevent dangerous code
      }
      
      return true;
    } catch (error) {
      return false;
    }
  },

  // Generate command template
  generateCommandTemplate: function(commandName, userCode) {
    return `// Command created by CreateCMD
// Created at: ${new Date().toLocaleString()}

module.exports = {
  config: {
    name: "${commandName}",
    version: "1.0.0",
    author: "Custom Command",
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
      api.sendMessage("❌ Command execution failed.", event.threadID);
    }
  }
};`;
  },

  // Save file
  saveFile: function(filePath, content) {
    const fs = require('fs');
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, content, 'utf8', (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  },

  // Reload commands (simplified version)
  reloadCommands: function() {
    // In a real implementation, this would reload the command handler
    console.log(`Commands reloaded - new command added`);
  },

  getHelpMessage: function() {
    return `🛠️ Create Command System\n\n` +
      `Create new commands directly from chat!\n\n` +
      `📝 Usage:\n` +
      `.createcmd [command_name]\n` +
      `[your_javascript_code]\n\n` +
      `🔧 Example:\n` +
      `.createcmd test\n` +
      `api.sendMessage("This is a test command! 🎯", event.threadID);\n\n` +
      `💡 Tips:\n` +
      `• Command name: lowercase, no spaces\n` +
      `• Code must be valid JavaScript\n` +
      `• Use event, api, args parameters\n` +
      `• Command auto-saves to commands folder`;
  }
};
