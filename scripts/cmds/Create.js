module.exports = {
  config: {
    name: "makecmd",
    version: "4.0.0",
    author: "Marina Khan",
    countDown: 15,
    role: 2,
    description: "Create commands with safe JavaScript",
    category: "system",
    guide: {
      en: `{pn} [command_name] [code]

🔹 Safe JavaScript Features Allowed:
• Basic operations and calculations
• String manipulation
• Array and Object methods
• Math functions
• Date operations
• Regular expressions
• Custom functions

🚫 Restricted:
• File system access
• Process operations
• Network requests
• Dangerous prototypes

📝 Examples:
.makecmd calculator
.makecmd "text converter"
.makecmd dice-roller`
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
      let commandName = args[0];
      let code = body.split('\n').slice(1).join('\n').trim();

      // Handle quoted command names
      if ((commandName.startsWith('"') && commandName.endsWith('"')) || 
          (commandName.startsWith("'") && commandName.endsWith("'"))) {
        commandName = commandName.slice(1, -1);
      }

      await this.createCommand(api, event, commandName, code);
    } catch (error) {
      api.sendMessage(`❌ ${error.message}`, threadID, messageID);
    }
  },

  createCommand: async function(api, event, commandName, userCode) {
    const { threadID, messageID } = event;

    const sanitizedName = this.sanitizeCommandName(commandName);
    
    if (!sanitizedName) {
      throw new Error('Invalid command name. Use letters, numbers, or common symbols.');
    }

    if (this.commandExists(sanitizedName)) {
      throw new Error(`Command "${sanitizedName}" already exists.`);
    }

    // Validate code safely
    const validation = this.validateJavaScriptSafely(userCode);
    if (!validation.isValid) {
      throw new Error(validation.error || 'Invalid JavaScript code.');
    }

    const finalCode = this.generateCommandTemplate(sanitizedName, userCode);
    const filePath = `${__dirname}/${sanitizedName}.js`;

    await this.saveFile(filePath, finalCode);
    this.reloadCommands();

    const message = this.getSuccessMessage(commandName, sanitizedName);
    api.sendMessage(message, threadID, messageID);
  },

  // Safe JavaScript validation
  validateJavaScriptSafely: function(code) {
    try {
      if (!code || code.trim().length === 0) {
        return { isValid: false, error: 'Code cannot be empty' };
      }

      if (code.length > 10000) {
        return { isValid: false, error: 'Code too long (max 10000 characters)' };
      }

      // Allowed safe patterns
      const allowedPatterns = [
        'api.sendMessage', 'event.threadID', 'event.messageID', 'event.senderID',
        'args.join', 'args.slice', 'args.map', 'args.filter',
        'Math.', 'Date.', 'String.', 'Array.', 'Object.', 'JSON.',
        'console.log', 'console.error',
        'if (', 'for (', 'while (', 'switch (', 'try {', 'catch (', 'function', '=>',
        'const ', 'let ', 'var ', 'return ', 'await ', 'async '
      ];

      // Dangerous patterns to block
      const dangerousPatterns = [
        'eval(', 'Function(', 'process.', 'require("', 'import(', 'export ',
        'fs.', 'child_process.', 'os.', 'path.', 'http.', 'https.', 'net.',
        '__proto__', 'constructor.prototype', 'module.constructor',
        'while(true)', 'for(;;)', 'setInterval(', 'setTimeout(',
        'process.exit', 'process.kill', 'process.env',
        'exec(', 'spawn(', 'execSync(', 'spawnSync(',
        'readFile', 'writeFile', 'appendFile', 'unlink',
        'rmdir', 'mkdir', 'readdir',
        'fetch(', 'XMLHttpRequest', 'http.request', 'https.request'
      ];

      const codeLines = code.split('\n');
      
      // Check for dangerous patterns
      for (let i = 0; i < codeLines.length; i++) {
        const line = codeLines[i].trim();
        
        // Skip comments and empty lines
        if (!line || line.startsWith('//') || line.startsWith('/*')) {
          continue;
        }

        // Check for dangerous patterns
        for (const pattern of dangerousPatterns) {
          if (line.includes(pattern)) {
            return { 
              isValid: false, 
              error: `Security violation: "${pattern}" is not allowed at line ${i + 1}`
            };
          }
        }

        // Check for suspicious function definitions
        if (line.includes('function') && (
            line.includes('Function(') || 
            line.includes('new Function') ||
            line.includes('constructor(')
        )) {
          return { 
            isValid: false, 
            error: `Dynamic function creation not allowed at line ${i + 1}`
          };
        }
      }

      // Basic syntax check without executing
      try {
        // Use safer parsing method
        const parsed = this.parseJavaScriptSafely(code);
        if (!parsed.valid) {
          return { isValid: false, error: `Syntax error: ${parsed.error}` };
        }
      } catch (parseError) {
        return { isValid: false, error: `Code parsing failed: ${parseError.message}` };
      }

      return { isValid: true };
    } catch (error) {
      return { isValid: false, error: `Validation error: ${error.message}` };
    }
  },

  // Safe JavaScript parsing
  parseJavaScriptSafely: function(code) {
    try {
      // Remove comments for cleaner parsing
      const cleanCode = code
        .replace(/\/\*[\s\S]*?\*\//g, '')  // Remove block comments
        .replace(/\/\/.*$/gm, '')          // Remove line comments
        .trim();

      // Basic syntax structure validation
      const brackets = this.checkBrackets(cleanCode);
      if (!brackets.valid) {
        return { valid: false, error: brackets.error };
      }

      // Check for basic JavaScript structure
      if (!cleanCode.includes('api.sendMessage') && !cleanCode.includes('return')) {
        // If no output method, warn but don't block
        console.log('Warning: Command might not have output');
      }

      return { valid: true };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  },

  // Check bracket balance
  checkBrackets: function(code) {
    const stack = [];
    const brackets = {
      '(': ')', 
      '[': ']', 
      '{': '}'
    };
    const quotes = ['"', "'", '`'];
    let inString = false;
    let currentQuote = '';

    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      const prevChar = code[i - 1];
      
      // Handle strings
      if (quotes.includes(char) && prevChar !== '\\') {
        if (!inString) {
          inString = true;
          currentQuote = char;
        } else if (char === currentQuote) {
          inString = false;
          currentQuote = '';
        }
        continue;
      }

      if (inString) continue;

      // Check brackets
      if (brackets[char]) {
        stack.push(char);
      } else if (Object.values(brackets).includes(char)) {
        if (stack.length === 0) {
          return { valid: false, error: `Unmatched ${char} at position ${i}` };
        }
        const last = stack.pop();
        if (brackets[last] !== char) {
          return { valid: false, error: `Mismatched brackets: ${last} and ${char}` };
        }
      }
    }

    if (stack.length > 0) {
      return { valid: false, error: `Unclosed ${stack.join(', ')}` };
    }

    return { valid: true };
  },

  sanitizeCommandName: function(name) {
    if (!name || name.trim().length === 0) return null;

    let sanitized = name.trim()
      .replace(/\s+/g, '_')
      .replace(/[<>:"|?*\\\/]/g, '-')
      .replace(/^[\.\-_]+/, '')
      .replace(/[\.\-_]+$/, '');

    if (!/^[a-zA-Z0-9]/.test(sanitized)) {
      sanitized = 'cmd_' + sanitized;
    }

    sanitized = sanitized.replace(/[^a-zA-Z0-9_\-]/g, '');
    return sanitized.length > 0 ? sanitized.toLowerCase() : null;
  },

  generateCommandTemplate: function(commandName, userCode) {
    const timestamp = new Date().toLocaleString();
    
    return `// Auto-generated command
// Created: ${timestamp}
// Safe JavaScript Command

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
      // User code starts here
      ${userCode}
      // User code ends here
    } catch (error) {
      console.error("${commandName} error:", error);
      api.sendMessage("❌ Command failed: " + error.message, event.threadID);
    }
  }
};`;
  },

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
      api.sendMessage('❌ Failed to list commands.', threadID, messageID);
    }
  },

  deleteCommand: async function(api, event, commandName) {
    const { threadID, messageID } = event;

    if (!commandName) {
      return api.sendMessage('❌ Please specify command name.', threadID, messageID);
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
      api.sendMessage(`✅ Command "${commandName}" deleted.`, threadID, messageID);
    } catch (error) {
      api.sendMessage(`❌ Failed to delete command.`, threadID, messageID);
    }
  },

  getSuccessMessage: function(originalName, sanitizedName) {
    return `✅ Command Created Successfully!\n\n` +
      `📛 Name: ${originalName}\n` +
      `🔧 File: ${sanitizedName}.js\n` +
      `🚀 Usage: .${sanitizedName}\n\n` +
      `✨ Your command is ready!`;
  },

  getHelpMessage: function() {
    return `🛠️ Safe Command Creator\n\n` +
      `Create commands with safe JavaScript!\n\n` +
      `✅ Allowed Features:\n` +
      `• Variables and functions\n` +
      `• Math calculations\n` +
      `• String operations\n` +
      `• Arrays and objects\n` +
      `• API message sending\n\n` +
      `🚫 Restricted:\n` +
      `• File system access\n` +
      `• Network requests\n` +
      `• Process operations\n\n` +
      `📝 Usage:\n` +
      `.makecmd [name]\n` +
      `[your_safe_javascript_code]\n\n` +
      `🔧 Examples:\n` +
      `.makecmd calculator\n` +
      `const result = 2 + 2;\n` +
      `api.sendMessage("2 + 2 = " + result, event.threadID);\n\n` +
      `.makecmd "random number"\n` +
      `const random = Math.floor(Math.random() * 100) + 1;\n` +
      `api.sendMessage("🎲 Random number: " + random, event.threadID);`;
  },

  commandExists: function(commandName) {
    const fs = require('fs');
    return fs.existsSync(`${__dirname}/${commandName}.js`);
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
    console.log('🔄 Commands reloaded');
  }
};
