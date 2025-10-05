const fs = require('fs-extra');
const path = require('path');

const postsFile = path.join(__dirname, '..', 'data', 'scheduled_posts.json');

module.exports = {
    config: {
        name: "advancedpost",
        version: "2.0",
        author: "Marina",
        countDown: 5,
        role: 1,
        description: {
            en: "Advanced post system with scheduling and templates"
        },
        category: "utility",
        guide: {
            en: "{p}post [type] [content] | [schedule]"
        }
    },

    onStart: async function ({ api, event, args }) {
        await this.ensureDataDir();
        
        const action = args[0];
        
        if (!action) {
            const helpMessage = `📢 **ADVANCED POST SYSTEM** 📢

🎯 **Commands:**
• {p}post create [type] [content]
• {p}post schedule [time] [content]
• {p}post list
• {p}post delete [id]

🌈 **Post Types:**
• Islamic - 🕌 Islamic messages & reminders
• Motivational - 💪 Inspirational quotes
• Tech - 💻 Technology updates
• Fun - 🎉 Entertainment posts
• News - 📰 Latest news
• Marina - 👑 Marina specials

💡 **Examples:**
{p}post create islamic "Subhanallah, beautiful day!"
{p}post create motivational "Never give up!"
{p}post create fun "Let's have fun today! 🎮"`;

            await api.sendMessage(helpMessage, event.threadID);
            return;
        }

        if (action === 'create') {
            await this.handleCreatePost(api, event, args.slice(1));
        } else if (action === 'list') {
            await this.handleListPosts(api, event);
        } else {
            await api.sendMessage("❌ Invalid action. Use 'create', 'list', or 'delete'.", event.threadID);
        }
    },

    handleCreatePost: async function (api, event, args) {
        const type = args[0];
        const content = args.slice(1).join(' ');
        
        if (!type || !content) {
            return api.sendMessage("❌ Use: post create [type] [content]", event.threadID);
        }

        const post = await this.generatePost(type, content, event.senderID);
        await api.sendMessage(post, event.threadID);
    },

    generatePost: async function (type, content, senderID) {
        const templates = {
            islamic: {
                title: "🕌 ISLAMIC REMINDER 🕌",
                border: "═",
                footer: "🤲 May Allah accept our deeds"
            },
            motivational: {
                title: "💫 MOTIVATIONAL QUOTE 💫",
                border: "☆",
                footer: "🌟 Keep shining bright"
            },
            tech: {
                title: "💻 TECH UPDATE 💻",
                border: "⌨",
                footer: "🚀 Powered by Marina"
            },
            fun: {
                title: "🎉 FUN TIME 🎉",
                border: "★",
                footer: "😄 Enjoy every moment"
            },
            news: {
                title: "📰 LATEST NEWS 📰",
                border: "📰",
                footer: "🕐 Stay informed"
            },
            marina: {
                title: "👑 MARINA SPECIAL 👑",
                border: "✨",
                footer: "💝 Created with love by Marina"
            }
        };

        const template = templates[type] || templates.motivational;
        const border = template.border.repeat(20);
        
        return `${template.title}\n${border}\n\n${content}\n\n${border}\n${template.footer}`;
    },

    handleListPosts: async function (api, event) {
        try {
            const posts = await fs.readJson(postsFile);
            if (Object.keys(posts).length === 0) {
                return api.sendMessage("📝 No scheduled posts found.", event.threadID);
            }

            let list = "📋 **SCHEDULED POSTS** 📋\n\n";
            Object.entries(posts).forEach(([id, post], index) => {
                list += `${index + 1}. ${post.type.toUpperCase()} - ${post.content.slice(0, 50)}...\n`;
            });

            await api.sendMessage(list, event.threadID);
        } catch (error) {
            await api.sendMessage("❌ Error reading posts data.", event.threadID);
        }
    },

    ensureDataDir: async function () {
        const dataDir = path.join(__dirname, '..', 'data');
        await fs.ensureDir(dataDir);
        if (!fs.existsSync(postsFile)) {
            await fs.writeJson(postsFile, {});
        }
    }
};
