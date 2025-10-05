module.exports = {
  config: {
    name: "admin",
    version: "1.0.0",
    author: "Marina Khan",
    countDown: 5,
    role: 2, // Only bot admins can use this
    description: "Bot configuration and settings management",
    category: "system",
    guide: {
      en: "{pn} [command] [value]\n\nAvailable commands:\n• prefix [new_prefix] - Change bot prefix\n• addadmin [userID] - Add new admin\n• removeadmin [userID] - Remove admin\n• status [text] - Change bot status\n• name [text] - Change bot name\n• autoreply [on/off] - Toggle auto reply\n• listadmins - Show all admins\n• settings - Show current settings"
    }
  },

  onStart: async function({ api, event, args, threadsData, usersData }) {
    const { threadID, messageID, senderID } = event;
    
    if (!args[0]) {
      return api.sendMessage(this.getHelpMessage(), threadID, messageID);
    }

    const command = args[0].toLowerCase();
    const value = args.slice(1).join(" ");

    try {
      switch (command) {
        case 'prefix':
          await this.changePrefix(api, event, value);
          break;
        
        case 'addadmin':
          await this.addAdmin(api, event, value);
          break;
        
        case 'removeadmin':
          await this.removeAdmin(api, event, value);
          break;
        
        case 'status':
          await this.changeStatus(api, event, value);
          break;
        
        case 'name':
          await this.changeName(api, event, value);
          break;
        
        case 'autoreply':
          await this.toggleAutoReply(api, event, value);
          break;
        
        case 'listadmins':
          await this.listAdmins(api, event);
          break;
        
        case 'settings':
          await this.showSettings(api, event);
          break;
        
        default:
          api.sendMessage(`❌ Invalid command. Use "${this.config.guide.en.split('\n')[0]}" for help.`, threadID, messageID);
      }
    } catch (error) {
      console.error('Admin command error:', error);
      api.sendMessage('❌ An error occurred while processing your request.', threadID, messageID);
    }
  },

  // Change bot prefix
  changePrefix: async function(api, event, newPrefix) {
    const { threadID, messageID } = event;
    
    if (!newPrefix) {
      return api.sendMessage('❌ Please provide a new prefix. Example: .admin prefix !', threadID, messageID);
    }

    if (newPrefix.length > 5) {
      return api.sendMessage('❌ Prefix cannot be longer than 5 characters.', threadID, messageID);
    }

    // Save to database or configuration
    global.GoatBot.config.prefix = newPrefix;
    
    api.sendMessage(`✅ Bot prefix changed to: "${newPrefix}"`, threadID, messageID);
  },

  // Add new admin
  addAdmin: async function(api, event, userID) {
    const { threadID, messageID } = event;
    
    if (!userID) {
      return api.sendMessage('❌ Please provide a user ID. Example: .admin addadmin 123456789', threadID, messageID);
    }

    // Validate user ID
    if (!/^\d+$/.test(userID)) {
      return api.sendMessage('❌ Invalid user ID format.', threadID, messageID);
    }

    try {
      // Check if user exists
      const userInfo = await api.getUserInfo(userID);
      if (!userInfo[userID]) {
        return api.sendMessage('❌ User not found.', threadID, messageID);
      }

      const userName = userInfo[userID].name;
      
      // Add to admin list
      if (!global.GoatBot.config.adminBot.includes(userID)) {
        global.GoatBot.config.adminBot.push(userID);
        api.sendMessage(`✅ Added ${userName} (${userID}) as bot admin.`, threadID, messageID);
      } else {
        api.sendMessage('❌ User is already an admin.', threadID, messageID);
      }
    } catch (error) {
      api.sendMessage('❌ Failed to add admin. User might not exist.', threadID, messageID);
    }
  },

  // Remove admin
  removeAdmin: async function(api, event, userID) {
    const { threadID, messageID, senderID } = event;
    
    if (!userID) {
      return api.sendMessage('❌ Please provide a user ID. Example: .admin removeadmin 123456789', threadID, messageID);
    }

    // Prevent removing yourself
    if (userID === senderID) {
      return api.sendMessage('❌ You cannot remove yourself as admin.', threadID, messageID);
    }

    try {
      const userInfo = await api.getUserInfo(userID);
      const userName = userInfo[userID]?.name || 'Unknown User';
      
      // Remove from admin list
      const index = global.GoatBot.config.adminBot.indexOf(userID);
      if (index > -1) {
        global.GoatBot.config.adminBot.splice(index, 1);
        api.sendMessage(`✅ Removed ${userName} (${userID}) from admin list.`, threadID, messageID);
      } else {
        api.sendMessage('❌ User is not an admin.', threadID, messageID);
      }
    } catch (error) {
      api.sendMessage('❌ Failed to remove admin.', threadID, messageID);
    }
  },

  // Change bot status
  changeStatus: async function(api, event, status) {
    const { threadID, messageID } = event;
    
    if (!status) {
      return api.sendMessage('❌ Please provide status text. Example: .admin status Online and ready!', threadID, messageID);
    }

    if (status.length > 100) {
      return api.sendMessage('❌ Status cannot be longer than 100 characters.', threadID, messageID);
    }

    try {
      await api.changeBio(status);
      api.sendMessage(`✅ Bot status changed to: "${status}"`, threadID, messageID);
    } catch (error) {
      api.sendMessage('❌ Failed to change status.', threadID, messageID);
    }
  },

  // Change bot name
  changeName: async function(api, event, name) {
    const { threadID, messageID } = event;
    
    if (!name) {
      return api.sendMessage('❌ Please provide a new name. Example: .admin name MyNewBot', threadID, messageID);
    }

    if (name.length > 20) {
      return api.sendMessage('❌ Name cannot be longer than 20 characters.', threadID, messageID);
    }

    try {
      await api.changeNickname(name, event.threadID, api.getCurrentUserID());
      api.sendMessage(`✅ Bot name changed to: "${name}"`, threadID, messageID);
    } catch (error) {
      api.sendMessage('❌ Failed to change name.', threadID, messageID);
    }
  },

  // Toggle auto reply
  toggleAutoReply: async function(api, event, value) {
    const { threadID, messageID } = event;
    
    if (!value || !['on', 'off'].includes(value.toLowerCase())) {
      return api.sendMessage('❌ Please specify "on" or "off". Example: .admin autoreply on', threadID, messageID);
    }

    const isEnabled = value.toLowerCase() === 'on';
    
    // Save auto reply setting
    if (!global.botSettings) global.botSettings = {};
    global.botSettings.autoReply = isEnabled;
    
    api.sendMessage(`✅ Auto reply ${isEnabled ? 'enabled' : 'disabled'}.`, threadID, messageID);
  },

  // List all admins
  listAdmins: async function(api, event) {
    const { threadID, messageID } = event;
    
    try {
      const adminList = global.GoatBot.config.adminBot;
      
      if (adminList.length === 0) {
        return api.sendMessage('📝 No admins configured.', threadID, messageID);
      }

      let message = '👑 Bot Admins:\n\n';
      
      for (const adminID of adminList) {
        try {
          const userInfo = await api.getUserInfo(adminID);
          const userName = userInfo[adminID]?.name || 'Unknown User';
          message += `• ${userName} (${adminID})\n`;
        } catch (error) {
          message += `• Unknown User (${adminID})\n`;
        }
      }

      api.sendMessage(message, threadID, messageID);
    } catch (error) {
      api.sendMessage('❌ Failed to fetch admin list.', threadID, messageID);
    }
  },

  // Show current settings
  showSettings: async function(api, event) {
    const { threadID, messageID } = event;
    
    try {
      const settings = {
        prefix: global.GoatBot.config.prefix,
        adminCount: global.GoatBot.config.adminBot.length,
        autoReply: global.botSettings?.autoReply ?? true,
        botName: 'Marina Bot', // You can make this dynamic
        version: this.config.version
      };

      const message = `⚙️ Current Bot Settings:\n\n` +
        `🔸 Prefix: ${settings.prefix}\n` +
        `🔸 Admins: ${settings.adminCount}\n` +
        `🔸 Auto Reply: ${settings.autoReply ? '✅ On' : '❌ Off'}\n` +
        `🔸 Bot Name: ${settings.botName}\n` +
        `🔸 Version: ${settings.version}\n\n` +
        `Use ".admin help" for configuration options.`;

      api.sendMessage(message, threadID, messageID);
    } catch (error) {
      api.sendMessage('❌ Failed to fetch settings.', threadID, messageID);
    }
  },

  // Get help message
  getHelpMessage: function() {
    return `🛠️ Admin Commands Guide:\n\n` +
      `🔹 ${this.config.guide.en.split('\n').slice(2).join('\n🔹 ')}\n\n` +
      `📖 Example usage:\n` +
      `• .admin prefix !\n` +
      `• .admin addadmin 123456789\n` +
      `• .admin status Online now!\n` +
      `• .admin autoreply off\n` +
      `• .admin listadmins`;
  }
};
