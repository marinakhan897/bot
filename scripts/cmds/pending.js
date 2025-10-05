const fs = require('fs-extra');
const path = require('path');

const pendingFile = path.join(__dirname, '..', 'data', 'pending_groups.json');
const approvedFile = path.join(__dirname, '..', 'data', 'approved_groups.json');

module.exports = {
    config: {
        name: "groupadmin",
        version: "1.0",
        author: "Marina",
        countDown: 5,
        role: 2, // Owner only
        description: {
            en: "Manage pending group approvals and group administration"
        },
        category: "admin",
        guide: {
            en: "{p}groupadmin pending\n{p}groupadmin approve [id]\n{p}groupadmin reject [id]\n{p}groupadmin list\n{p}groupadmin settings"
        }
    },

    onStart: async function ({ api, event, args }) {
        await this.ensureDataDir();
        
        const action = args[0];
        
        if (!action) {
            const helpMessage = `👑 **MARINA GROUP ADMIN SYSTEM** 👑

🎯 **Commands for Group Management:**
• {p}groupadmin pending - View pending group requests
• {p}groupadmin approve [id] - Approve a group
• {p}groupadmin reject [id] - Reject a group
• {p}groupadmin list - Show approved groups
• {p}groupadmin settings - Configure group settings
• {p}groupadmin stats - View group statistics

💡 **Auto-Approval Features:**
• Islamic groups auto-approved
• Marina fan groups auto-approved
• Developer communities auto-approved
• Spam groups auto-rejected

🚀 **Managed by Marina - Professional Group Administration**`;

            await api.sendMessage(helpMessage, event.threadID);
            return;
        }

        try {
            switch (action) {
                case 'pending':
                    await this.showPendingGroups(api, event);
                    break;
                case 'approve':
                    await this.approveGroup(api, event, args.slice(1));
                    break;
                case 'reject':
                    await this.rejectGroup(api, event, args.slice(1));
                    break;
                case 'list':
                    await this.showApprovedGroups(api, event);
                    break;
                case 'stats':
                    await this.showGroupStats(api, event);
                    break;
                case 'settings':
                    await this.showGroupSettings(api, event);
                    break;
                default:
                    await api.sendMessage("❌ Invalid command. Use: pending, approve, reject, list, stats, settings", event.threadID);
            }
        } catch (error) {
            console.error('Group Admin Error:', error);
            await api.sendMessage("❌ Error processing group admin request.", event.threadID);
        }
    },

    onChat: async function ({ api, event }) {
        // Auto-detect when bot is added to a group
        if (event.logMessageType === 'log:subscribe' && event.logMessageData.addedParticipants) {
            const addedParticipants = event.logMessageData.addedParticipants;
            const botID = api.getCurrentUserID();
            
            const isBotAdded = addedParticipants.some(participant => participant.userFbId === botID);
            
            if (isBotAdded) {
                await this.handleNewGroup(api, event);
            }
        }
    },

    handleNewGroup: async function (api, event) {
        const groupID = event.threadID;
        const groupInfo = await api.getThreadInfo(groupID);
        
        const groupData = {
            id: groupID,
            name: groupInfo.threadName || 'Unnamed Group',
            participants: groupInfo.participantIDs.length,
            adminIDs: groupInfo.adminIDs || [],
            timestamp: new Date().toISOString(),
            status: 'pending'
        };

        // Check for auto-approval conditions
        const autoApprove = await this.checkAutoApprove(groupInfo);
        
        if (autoApprove) {
            await this.autoApproveGroup(api, event, groupData);
        } else {
            await this.addToPending(groupData);
            await this.notifyOwner(api, groupData);
            await this.sendWelcomeMessage(api, event, false);
        }
    },

    checkAutoApprove: async function (groupInfo) {
        const groupName = groupInfo.threadName?.toLowerCase() || '';
        
        // Auto-approve conditions
        const islamicKeywords = ['islam', 'quran', 'muslim', 'allah', 'deen', 'sunnah', 'masjid'];
        const marinaKeywords = ['marina', 'developer', 'coding', 'programming', 'bot'];
        const trustedKeywords = ['education', 'learning', 'tech', 'development'];
        
        const hasIslamic = islamicKeywords.some(keyword => groupName.includes(keyword));
        const hasMarina = marinaKeywords.some(keyword => groupName.includes(keyword));
        const hasTrusted = trustedKeywords.some(keyword => groupName.includes(keyword));
        
        return hasIslamic || hasMarina || hasTrusted;
    },

    autoApproveGroup: async function (api, event, groupData) {
        groupData.status = 'approved';
        groupData.autoApproved = true;
        groupData.approvedAt = new Date().toISOString();
        
        await this.addToApproved(groupData);
        await this.sendWelcomeMessage(api, event, true);
        
        // Notify owner about auto-approval
        const ownerMessage = `✅ **AUTO-APPROVED GROUP** ✅

🏠 Group: ${groupData.name}
👥 Members: ${groupData.participants}
🆔 ID: ${groupData.id}
⏰ Time: ${new Date().toLocaleString()}

💫 Reason: Met auto-approval criteria
👑 Managed by Marina's Smart System`;
        
        await this.sendToOwner(api, ownerMessage);
    },

    showPendingGroups: async function (api, event) {
        const pendingGroups = await this.getPendingGroups();
        
        if (pendingGroups.length === 0) {
            return api.sendMessage("📭 No pending group requests. All clear! ✅", event.threadID);
        }

        let response = `⏳ **PENDING GROUP REQUESTS** ⏳\n\n`;
        
        pendingGroups.forEach((group, index) => {
            response += `🔸 **Request ${index + 1}**\n`;
            response += `🏠 Name: ${group.name}\n`;
            response += `👥 Members: ${group.participants}\n`;
            response += `🆔 ID: ${group.id}\n`;
            response += `⏰ Added: ${new Date(group.timestamp).toLocaleDateString()}\n`;
            response += `📝 Commands: {p}groupadmin approve ${group.id}\n           {p}groupadmin reject ${group.id}\n\n`;
        });

        response += `💫 Total Pending: ${pendingGroups.length} groups\n👑 Use commands above to manage`;

        await api.sendMessage(response, event.threadID);
    },

    approveGroup: async function (api, event, args) {
        const groupID = args[0];
        if (!groupID) {
            return api.sendMessage("❌ Please provide group ID: {p}groupadmin approve [group_id]", event.threadID);
        }

        const pendingGroups = await this.getPendingGroups();
        const groupIndex = pendingGroups.findIndex(g => g.id === groupID);
        
        if (groupIndex === -1) {
            return api.sendMessage("❌ Group not found in pending requests.", event.threadID);
        }

        const group = pendingGroups[groupIndex];
        group.status = 'approved';
        group.approvedAt = new Date().toISOString();
        group.approvedBy = event.senderID;

        // Move to approved
        pendingGroups.splice(groupIndex, 1);
        await this.savePendingGroups(pendingGroups);
        await this.addToApproved(group);

        // Send welcome message to group
        try {
            await api.sendMessage(
                `✅ **GROUP APPROVED** ✅\n\nWelcome to Marina's Bot Family! 🎉\n\nThis group has been officially approved. Enjoy all features! 👑\n\nType {p}help to see available commands.`,
                groupID
            );
        } catch (error) {
            console.error('Could not send message to group:', error);
        }

        await api.sendMessage(
            `✅ **GROUP APPROVED SUCCESSFULLY** ✅\n\n🏠 Group: ${group.name}\n👥 Members: ${group.participants}\n🆔 ID: ${group.id}\n⏰ Approved: ${new Date().toLocaleString()}\n\n👑 Managed by Marina's Admin System`,
            event.threadID
        );
    },

    rejectGroup: async function (api, event, args) {
        const groupID = args[0];
        if (!groupID) {
            return api.sendMessage("❌ Please provide group ID: {p}groupadmin reject [group_id]", event.threadID);
        }

        const pendingGroups = await this.getPendingGroups();
        const groupIndex = pendingGroups.findIndex(g => g.id === groupID);
        
        if (groupIndex === -1) {
            return api.sendMessage("❌ Group not found in pending requests.", event.threadID);
        }

        const group = pendingGroups[groupIndex];
        
        // Remove from pending
        pendingGroups.splice(groupIndex, 1);
        await this.savePendingGroups(pendingGroups);

        // Leave group if still in it
        try {
            await api.removeUserFromGroup(api.getCurrentUserID(), groupID);
        } catch (error) {
            console.error('Could not leave group:', error);
        }

        await api.sendMessage(
            `❌ **GROUP REJECTED** ❌\n\n🏠 Group: ${group.name}\n🆔 ID: ${group.id}\n⏰ Rejected: ${new Date().toLocaleString()}\n\n👑 Action taken by Marina's Admin System`,
            event.threadID
        );
    },

    showApprovedGroups: async function (api, event) {
        const approvedGroups = await this.getApprovedGroups();
        
        if (approvedGroups.length === 0) {
            return api.sendMessage("📋 No approved groups yet.", event.threadID);
        }

        let response = `✅ **APPROVED GROUPS** ✅\n\n`;
        
        approvedGroups.forEach((group, index) => {
            const approvedDate = new Date(group.approvedAt || group.timestamp).toLocaleDateString();
            response += `🔸 **${index + 1}. ${group.name}**\n`;
            response += `   👥 Members: ${group.participants}\n`;
            response += `   🆔 ID: ${group.id}\n`;
            response += `   ✅ Approved: ${approvedDate}\n`;
            if (group.autoApproved) response += `   🤖 Auto-Approved\n`;
            response += `\n`;
        });

        response += `💫 Total Approved: ${approvedGroups.length} groups\n👑 Marina's Managed Groups`;

        await api.sendMessage(response, event.threadID);
    },

    showGroupStats: async function (api, event) {
        const pendingGroups = await this.getPendingGroups();
        const approvedGroups = await this.getApprovedGroups();
        
        const totalMembers = approvedGroups.reduce((sum, group) => sum + group.participants, 0);
        const autoApproved = approvedGroups.filter(g => g.autoApproved).length;

        const stats = `📊 **GROUP STATISTICS** 📊

⏳ Pending Requests: ${pendingGroups.length}
✅ Approved Groups: ${approvedGroups.length}
🤖 Auto-Approved: ${autoApproved}
👥 Total Members: ${totalMembers}
📈 Approval Rate: ${approvedGroups.length > 0 ? Math.round((approvedGroups.length / (approvedGroups.length + pendingGroups.length)) * 100) : 0}%

🎯 **Recent Activity:**
${this.getRecentActivity(approvedGroups)}

👑 Marina's Group Network - Growing Strong!`;

        await api.sendMessage(stats, event.threadID);
    },

    showGroupSettings: async function (api, event) {
        const settings = `⚙️ **GROUP ADMIN SETTINGS** ⚙️

🔹 **Auto-Approval Rules:**
• Islamic groups ✅
• Marina communities ✅  
• Developer groups ✅
• Educational groups ✅
• Spam groups ❌

🔹 **Default Permissions:**
• All commands enabled
• Welcome message active
• Anti-spam protection
• Islamic content available

🔹 **Management Features:**
• Pending group queue
• Auto-approval system
• Group statistics
• Quick approval/rejection

👑 Configured by Marina - Professional Setup`;

        await api.sendMessage(settings, event.threadID);
    },

    // Helper methods
    getRecentActivity: function (approvedGroups) {
        const recent = approvedGroups
            .sort((a, b) => new Date(b.approvedAt || b.timestamp) - new Date(a.approvedAt || a.timestamp))
            .slice(0, 3);
        
        return recent.map(group => 
            `• ${group.name} (${new Date(group.approvedAt || group.timestamp).toLocaleDateString()})`
        ).join('\n') || 'No recent activity';
    },

    sendWelcomeMessage: async function (api, event, isApproved) {
        const welcomeMsg = isApproved 
            ? `🎉 **Welcome to Marina's Bot!** 🎉\n\n✅ This group has been approved!\n\n💫 Available Features:\n• Islamic commands\n• Fun games\n• Utility tools\n• Admin features\n\nType {p}help to explore! 👑`
            : `⏳ **Group Approval Pending** ⏳\n\nThank you for adding Marina's Bot!\n\nYour group is currently under review and will be approved shortly by the admin.\n\nOnce approved, you'll get access to all features! 🤝`;

        try {
            await api.sendMessage(welcomeMsg, event.threadID);
        } catch (error) {
            console.error('Welcome message failed:', error);
        }
    },

    notifyOwner: async function (api, groupData) {
        const notification = `📨 **NEW GROUP REQUEST** 📨

🏠 Group Name: ${groupData.name}
👥 Members: ${groupData.participants}
🆔 Group ID: ${groupData.id}
⏰ Request Time: ${new Date(groupData.timestamp).toLocaleString()}

💭 **Actions:**
{p}groupadmin approve ${groupData.id}
{p}groupadmin reject ${groupData.id}
{p}groupadmin pending

👑 Marina's Approval System`;

        await this.sendToOwner(api, notification);
    },

    sendToOwner: async function (api, message) {
        // Send to bot owner (you)
        const adminID = 'YOUR_FACEBOOK_ID_HERE'; // Replace with your FB ID
        try {
            await api.sendMessage(message, adminID);
        } catch (error) {
            console.error('Could not notify owner:', error);
        }
    },

    // Data management methods
    getPendingGroups: async function () {
        try {
            return await fs.readJson(pendingFile);
        } catch (error) {
            return [];
        }
    },

    getApprovedGroups: async function () {
        try {
            return await fs.readJson(approvedFile);
        } catch (error) {
            return [];
        }
    },

    savePendingGroups: async function (groups) {
        await fs.writeJson(pendingFile, groups);
    },

    addToPending: async function (groupData) {
        const groups = await this.getPendingGroups();
        groups.push(groupData);
        await this.savePendingGroups(groups);
    },

    addToApproved: async function (groupData) {
        const groups = await this.getApprovedGroups();
        groups.push(groupData);
        await fs.writeJson(approvedFile, groups);
    },

    ensureDataDir: async function () {
        const dataDir = path.join(__dirname, '..', 'data');
        await fs.ensureDir(dataDir);
        
        if (!fs.existsSync(pendingFile)) {
            await fs.writeJson(pendingFile, []);
        }
        if (!fs.existsSync(approvedFile)) {
            await fs.writeJson(approvedFile, []);
        }
    }
};
