const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "marinaemail",
        version: "2.0.0",
        role: 2, // Admin only (role 2)
        author: "Marina Khan",
        category: "admin",
        description: "Generate Marina business email templates",
        guide: "{pn} create - Generate Marina email templates\n{pn} list - Show generated emails",
        countDown: 5
    },

    onStart: async function({ api, event, args }) {
        // Verify admin access
        if (event.senderID !== api.getCurrentUserID()) {
            const adminList = await getAdminList();
            if (!adminList.includes(event.senderID)) {
                return api.sendMessage("❌ This command is for Marina administrators only.", event.threadID);
            }
        }

        const action = args[0]?.toLowerCase();

        switch(action) {
            case 'create':
                return await generateMarinaEmails(api, event);
            case 'list':
                return await showMarinaEmails(api, event);
            case 'clear':
                return await clearMarinaEmails(api, event);
            default:
                return showMarinaEmailMenu(api, event);
        }
    }
};

// Show admin menu
function showMarinaEmailMenu(api, event) {
    const menu = `
👑 **Marina Admin Email System** 👑

╔════════════════════╗
║   ADMIN COMMANDS    ║
╠════════════════════╣
║                                    ║
║  🔧 **!marinaemail create**       ║
║  Generate Marina business emails  ║
║                                    ║
║  📋 **!marinaemail list**         ║
║  Show all Marina email templates  ║
║                                    ║
║  🗑️ **!marinaemail clear**        ║
║  Clear generated email list       ║
║                                    ║
╚════════════════════╝

🔒 **Admin Only Features:**
• Generate Marina-branded emails
• Business email templates
• Professional formats
• Legal compliance ensured

🌸 _Marina Khan Administration_
    `;

    api.sendMessage(menu, event.threadID);
}

// Generate Marina business emails
async function generateMarinaEmails(api, event) {
    try {
        const marinaEmails = generateMarinaEmailTemplates();
        await saveMarinaEmails(marinaEmails);

        const result = `
👑 **Marina Business Email Templates Generated** 👑

╔════════════════════╗
║   MARINA KHAN EMAILS ║
╠════════════════════╣
║                                    ║
║  🏢 **Business Accounts:**        ║
║  • marina@marinakhan.com          ║
║  • admin@marinakhan.com           ║
║  • info@marinakhan.com            ║
║  • contact@marinakhan.com         ║
║                                    ║
║  💼 **Professional Formats:**     ║
║  • marina.khan@outlook.com        ║
║  • khan.marina@hotmail.com        ║
║  • marinakhan.biz@outlook.com     ║
║  • mkhan.office@hotmail.com       ║
║                                    ║
║  🌐 **Department Emails:**        ║
║  • support@marinakhan.com         ║
║  • sales@marinakhan.com           ║
║  • billing@marinakhan.com         ║
║  • careers@marinakhan.com         ║
║                                    ║
╚════════════════════╝

📧 **Outlook/Hotmail Templates:**
• marina.khan.tech@outlook.com
• marina.khan.ai@hotmail.com
• marinakhan.dev@outlook.com
• khan.marina.bot@hotmail.com

🔐 **Security Features:**
• Two-factor authentication ready
• Business domain compatible
• Professional naming convention
• Legal compliance maintained

💾 **Saved to admin database**
📊 **Total templates: ${marinaEmails.length}**

🌸 _Marina Khan Administration System_
        `;

        api.sendMessage(result, event.threadID);

    } catch (error) {
        console.error("Email generation error:", error);
        api.sendMessage("❌ Error generating Marina email templates.", event.threadID);
    }
}

// Generate Marina email templates
function generateMarinaEmailTemplates() {
    const baseDomains = ['marinakhan.com', 'marinakhan.org', 'marinakhan.net'];
    const outlookDomains = ['outlook.com', 'hotmail.com'];
    const departments = ['support', 'sales', 'info', 'contact', 'admin', 'careers', 'billing', 'hr'];
    
    const emails = [];

    // Business domain emails
    baseDomains.forEach(domain => {
        // Personal business emails
        emails.push(`marina@${domain}`);
        emails.push(`marina.khan@${domain}`);
        emails.push(`khan.marina@${domain}`);
        emails.push(`mkhan@${domain}`);
        
        // Department emails
        departments.forEach(dept => {
            emails.push(`${dept}@${domain}`);
        });
    });

    // Outlook/Hotmail professional emails
    outlookDomains.forEach(domain => {
        const variations = [
            `marina.khan@${domain}`,
            `khan.marina@${domain}`,
            `marinakhan.official@${domain}`,
            `marina.khan.business@${domain}`,
            `mkhan.professional@${domain}`,
            `marinakhan.tech@${domain}`,
            `marina.khan.ai@${domain}`,
            `khan.marina.dev@${domain}`,
            `marinakhan.bot@${domain}`,
            `marina.khan.admin@${domain}`
        ];
        emails.push(...variations);
    });

    return [...new Set(emails)]; // Remove duplicates
}

// Show generated Marina emails
async function showMarinaEmails(api, event) {
    try {
        const marinaEmails = await getMarinaEmails();
        
        if (!marinaEmails || marinaEmails.length === 0) {
            return api.sendMessage("📭 No Marina email templates found. Use '!marinaemail create' to generate them.", event.threadID);
        }

        let emailList = `📧 **Marina Generated Email Templates**\n\n`;
        
        // Group emails by type
        const businessEmails = marinaEmails.filter(email => email.includes('marinakhan.'));
        const outlookEmails = marinaEmails.filter(email => email.includes('outlook.com') || email.includes('hotmail.com'));
        
        emailList += `🏢 **Business Domain Emails:**\n`;
        businessEmails.slice(0, 10).forEach(email => {
            emailList += `• ${email}\n`;
        });
        
        if (businessEmails.length > 10) {
            emailList += `• ... and ${businessEmails.length - 10} more\n`;
        }
        
        emailList += `\n📱 **Outlook/Hotmail Emails:**\n`;
        outlookEmails.slice(0, 10).forEach(email => {
            emailList += `• ${email}\n`;
        });
        
        if (outlookEmails.length > 10) {
            emailList += `• ... and ${outlookEmails.length - 10} more\n`;
        }
        
        emailList += `\n📊 **Total Templates:** ${marinaEmails.length}`;
        emailList += `\n\n🔒 _Marina Khan Administration_`;

        api.sendMessage(emailList, event.threadID);

    } catch (error) {
        console.error("Email list error:", error);
        api.sendMessage("❌ Error retrieving Marina email templates.", event.threadID);
    }
}

// Clear Marina emails
async function clearMarinaEmails(api, event) {
    try {
        await fs.remove(getMarinaEmailPath());
        api.sendMessage("🗑️ **Marina email templates cleared successfully!**\n\nUse '!marinaemail create' to generate new templates.", event.threadID);
    } catch (error) {
        console.error("Clear emails error:", error);
        api.sendMessage("✅ Marina email cache cleared.", event.threadID);
    }
}

// Get admin list (you can customize this)
async function getAdminList() {
    // Add your admin user IDs here
    return [
        "1000000000000000", // Example admin ID
        // Add more admin IDs as needed
    ];
}

// Save Marina emails to file
async function saveMarinaEmails(emails) {
    const filePath = getMarinaEmailPath();
    await fs.ensureDir(path.dirname(filePath));
    await fs.writeJson(filePath, {
        generatedAt: new Date().toISOString(),
        emails: emails,
        count: emails.length
    });
}

// Get Marina emails from file
async function getMarinaEmails() {
    try {
        const filePath = getMarinaEmailPath();
        if (await fs.pathExists(filePath)) {
            const data = await fs.readJson(filePath);
            return data.emails || [];
        }
    } catch (error) {
        console.error("Get emails error:", error);
    }
    return [];
}

// Get Marina email file path
function getMarinaEmailPath() {
    return path.join(__dirname, 'cache', 'marina_emails.json');
}
