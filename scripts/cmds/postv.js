const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

const postsDatabase = path.join(__dirname, '..', 'data', 'fb_posts.json');
const scheduledPosts = path.join(__dirname, '..', 'data', 'scheduled_posts.json');

module.exports = {
    config: {
        name: "fbpost",
        version: "1.0",
        author: "Marina",
        countDown: 10,
        role: 1,
        description: {
            en: "Create and manage Facebook posts with images, text, and scheduling"
        },
        category: "social",
        guide: {
            en: "{p}fbpost create [text]\n{p}fbpost image [text] | [image_url]\n{p}fbpost schedule [time] [text]\n{p}fbpost list\n{p}fbpost delete [id]"
        }
    },

    onStart: async function ({ api, event, args }) {
        await this.ensureDataDir();
        
        const action = args[0];
        
        if (!action) {
            const helpMessage = `📢 **MARINA FACEBOOK POST MANAGER** 📢

👑 **Professional Facebook Posting System**

🎯 **Commands:**
• {p}fbpost create [text] - Create text post
• {p}fbpost image [text] | [image_url] - Create post with image
• {p}fbpost schedule [time] [text] - Schedule post
• {p}fbpost list - View all posts
• {p}fbpost delete [id] - Delete post
• {p}fbpost templates - Show post templates
• {p}fbpost auto [type] - Auto-generate post

💡 **Post Types:**
• islamic - Islamic content
• motivational - Inspirational quotes
• tech - Technology updates
• fun - Entertainment posts
• news - News updates
• marina - Marina special posts

🚀 **Create engaging Facebook posts easily!**`;

            await api.sendMessage(helpMessage, event.threadID);
            return;
        }

        try {
            switch (action) {
                case 'create':
                    await this.createTextPost(api, event, args.slice(1));
                    break;
                case 'image':
                    await this.createImagePost(api, event, args.slice(1));
                    break;
                case 'schedule':
                    await this.schedulePost(api, event, args.slice(1));
                    break;
                case 'list':
                    await this.listPosts(api, event);
                    break;
                case 'delete':
                    await this.deletePost(api, event, args.slice(1));
                    break;
                case 'templates':
                    await this.showTemplates(api, event);
                    break;
                case 'auto':
                    await this.autoGeneratePost(api, event, args.slice(1));
                    break;
                default:
                    await api.sendMessage("❌ Invalid command. Use: create, image, schedule, list, delete, templates, auto", event.threadID);
            }
        } catch (error) {
            console.error('FB Post Error:', error);
            await api.sendMessage("❌ Error processing Facebook post request.", event.threadID);
        }
    },

    createTextPost: async function (api, event, args) {
        const text = args.join(' ');
        if (!text) {
            return api.sendMessage("❌ Please provide text for your post.\nUsage: {p}fbpost create [your post text]", event.threadID);
        }

        const postData = {
            id: Date.now().toString(),
            type: 'text',
            content: text,
            createdBy: event.senderID,
            timestamp: new Date().toISOString(),
            status: 'draft'
        };

        await this.savePost(postData);
        
        const preview = this.formatPostPreview(postData);
        await api.sendMessage(`📝 **POST CREATED SUCCESSFULLY** 📝\n\n${preview}\n\n✅ Ready to publish! Use {p}fbpost list to see all posts.`, event.threadID);
    },

    createImagePost: async function (api, event, args) {
        const input = args.join(' ');
        const [text, imageUrl] = input.split('|').map(item => item.trim());
        
        if (!text || !imageUrl) {
            return api.sendMessage("❌ Use: {p}fbpost image [text] | [image_url]\nExample: {p}fbpost image Beautiful sunset | https://example.com/sunset.jpg", event.threadID);
        }

        // Validate image URL
        if (!this.isValidUrl(imageUrl)) {
            return api.sendMessage("❌ Please provide a valid image URL.", event.threadID);
        }

        const postData = {
            id: Date.now().toString(),
            type: 'image',
            content: text,
            imageUrl: imageUrl,
            createdBy: event.senderID,
            timestamp: new Date().toISOString(),
            status: 'draft'
        };

        await this.savePost(postData);
        
        try {
            // Download and preview image
            const imageStream = await this.getImageStream(imageUrl);
            const preview = this.formatPostPreview(postData);
            
            await api.sendMessage({
                body: `🖼️ **IMAGE POST CREATED** 🖼️\n\n${preview}\n\n✅ Ready to publish with image!`,
                attachment: imageStream
            }, event.threadID);
        } catch (error) {
            await api.sendMessage(`📝 **POST CREATED** 📝\n\nPost created but couldn't load image preview.\n\nContent: ${text}`, event.threadID);
        }
    },

    schedulePost: async function (api, event, args) {
        const time = args[0];
        const text = args.slice(1).join(' ');
        
        if (!time || !text) {
            return api.sendMessage("❌ Use: {p}fbpost schedule [time] [text]\nExample: {p}fbpost schedule 14:30 Hello everyone!", event.threadID);
        }

        const scheduledData = {
            id: Date.now().toString(),
            type: 'scheduled',
            content: text,
            scheduledTime: time,
            createdBy: event.senderID,
            timestamp: new Date().toISOString(),
            status: 'scheduled'
        };

        await this.saveScheduledPost(scheduledData);
        await api.sendMessage(`⏰ **POST SCHEDULED** ⏰\n\nTime: ${time}\nContent: ${text}\n\n✅ Post scheduled successfully!`, event.threadID);
    },

    listPosts: async function (api, event) {
        const posts = await this.getPosts();
        const scheduled = await this.getScheduledPosts();
        
        if (posts.length === 0 && scheduled.length === 0) {
            return api.sendMessage("📭 No posts created yet.\nUse {p}fbpost create [text] to make your first post!", event.threadID);
        }

        let response = "📋 **YOUR FACEBOOK POSTS** 📋\n\n";

        if (posts.length > 0) {
            response += "📝 **DRAFT POSTS:**\n";
            posts.forEach((post, index) => {
                response += `${index + 1}. ${post.content.substring(0, 50)}...\n   🆔 ${post.id} | 📅 ${new Date(post.timestamp).toLocaleDateString()}\n\n`;
            });
        }

        if (scheduled.length > 0) {
            response += "⏰ **SCHEDULED POSTS:**\n";
            scheduled.forEach((post, index) => {
                response += `${index + 1}. ${post.content.substring(0, 50)}...\n   🕐 ${post.scheduledTime} | 🆔 ${post.id}\n\n`;
            });
        }

        response += "💫 Use {p}fbpost delete [id] to remove posts\n👑 Managed by Marina's Post System";

        await api.sendMessage(response, event.threadID);
    },

    deletePost: async function (api, event, args) {
        const postId = args[0];
        if (!postId) {
            return api.sendMessage("❌ Please provide post ID: {p}fbpost delete [post_id]", event.threadID);
        }

        const posts = await this.getPosts();
        const scheduled = await this.getScheduledPosts();
        
        const allPosts = [...posts, ...scheduled];
        const postIndex = allPosts.findIndex(post => post.id === postId);
        
        if (postIndex === -1) {
            return api.sendMessage("❌ Post not found. Use {p}fbpost list to see available posts.", event.threadID);
        }

        // Remove from appropriate array
        if (postIndex < posts.length) {
            posts.splice(postIndex, 1);
            await this.saveAllPosts(posts);
        } else {
            scheduled.splice(postIndex - posts.length, 1);
            await this.saveAllScheduledPosts(scheduled);
        }

        await api.sendMessage(`🗑️ **POST DELETED** 🗑️\n\nPost ID: ${postId}\n✅ Successfully removed from your posts list.`, event.threadID);
    },

    showTemplates: async function (api, event) {
        const templates = `🎨 **FACEBOOK POST TEMPLATES** 🎨

🕌 **ISLAMIC POSTS:**
"Subhanallah! Beautiful reminder for today 🌟
#Islamic #Reminder #Quran"

"JazakAllah Khair for all the blessings 🤲
#Alhamdulillah #Islamic #Gratitude"

💫 **MOTIVATIONAL:**
"Keep going! Your efforts will pay off soon 🚀
#Motivation #Success #HardWork"

"Believe in yourself and you're halfway there 💪
#Inspiration #PositiveVibes"

👑 **MARINA SPECIALS:**
"Marina's bot making life easier! 💻
#Marina #Tech #Innovation"

"Coded with love by Marina ❤️
#Developer #Programming #Marina"

🎉 **FUN POSTS:**
"Having a great day! Hope you are too 😄
#Fun #Happy #GoodVibes"

"Life is better when you're laughing! 😂
#Humor #Funny #EnjoyLife"

📰 **NEWS STYLE:**
"Breaking: Exciting updates coming soon! 📢
#News #Update #Announcement"

💡 **Use these templates as inspiration for your posts!**`;

        await api.sendMessage(templates, event.threadID);
    },

    autoGeneratePost: async function (api, event, args) {
        const type = args[0] || 'islamic';
        
        const autoPosts = {
            islamic: [
                "Subhanallah! What a beautiful day to remember Allah 🌟\nMay your day be filled with blessings and peace. 🤲\n#Islamic #Reminder #Blessings",
                "Masha Allah! Every moment is a blessing from Allah 💫\nLet's make the most of today with good deeds and prayers. 🕌\n#Islam #Quran #Blessed",
                "Allahu Akbar! The greatness of Allah is beyond our imagination ⚡\nTake a moment to appreciate the wonders around us. 🌍\n#Allah #Islamic #Faith"
            ],
            motivational: [
                "Your future is created by what you do today, not tomorrow 🚀\nKeep pushing forward! 💪\n#Motivation #Success #Goals",
                "Dream big, work hard, stay focused 💫\nSuccess is coming your way! 🌟\n#Inspiration #HardWork #Dreams",
                "Every expert was once a beginner 📚\nDon't be afraid to start! 🎯\n#Learning #Growth #Progress"
            ],
            tech: [
                "Technology is best when it brings people together 💻\nInnovation at its finest! 🔥\n#Tech #Innovation #Future",
                "Coding is not just about writing code, it's about solving problems 🛠️\nKeep learning, keep growing! 📈\n#Programming #Development #Marina",
                "The future is digital, and we're building it today 🌐\nEmbrace the tech revolution! ⚡\n#Digital #Tech #Future"
            ],
            marina: [
                "Marina's bot system working flawlessly! 👑\nMaking your digital experience better every day 💝\n#Marina #Bot #Technology",
                "Powered by Marina's coding expertise 💻\nDelivering quality and innovation! 🚀\n#Developer #Marina #Innovation",
                "Marina's creation - built with passion and precision 🔧\nYour reliable digital assistant! 🤖\n#Marina #Tech #Assistant"
            ]
        };

        const posts = autoPosts[type] || autoPosts.islamic;
        const randomPost = posts[Math.floor(Math.random() * posts.length)];
        
        const postData = {
            id: Date.now().toString(),
            type: 'auto',
            content: randomPost,
            createdBy: event.senderID,
            timestamp: new Date().toISOString(),
            status: 'draft'
        };

        await this.savePost(postData);
        
        await api.sendMessage(`🤖 **AUTO-GENERATED POST** 🤖\n\n${randomPost}\n\n✅ Post saved to your drafts!\n💫 Type: ${type}\n👑 Generated by Marina's AI`, event.threadID);
    },

    // Helper Methods
    formatPostPreview: function (postData) {
        return `📝 ${postData.content}\n\n📊 Type: ${postData.type}\n🆔 ID: ${postData.id}\n📅 Created: ${new Date(postData.timestamp).toLocaleString()}`;
    },

    isValidUrl: function (string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    },

    getImageStream: async function (url) {
        const response = await axios.get(url, { responseType: 'stream' });
        return response.data;
    },

    // Data Management Methods
    getPosts: async function () {
        try {
            return await fs.readJson(postsDatabase);
        } catch (error) {
            return [];
        }
    },

    getScheduledPosts: async function () {
        try {
            return await fs.readJson(scheduledPosts);
        } catch (error) {
            return [];
        }
    },

    savePost: async function (postData) {
        const posts = await this.getPosts();
        posts.push(postData);
        await fs.writeJson(postsDatabase, posts);
    },

    saveScheduledPost: async function (postData) {
        const posts = await this.getScheduledPosts();
        posts.push(postData);
        await fs.writeJson(scheduledPosts, posts);
    },

    saveAllPosts: async function (posts) {
        await fs.writeJson(postsDatabase, posts);
    },

    saveAllScheduledPosts: async function (posts) {
        await fs.writeJson(scheduledPosts, posts);
    },

    ensureDataDir: async function () {
        const dataDir = path.join(__dirname, '..', 'data');
        await fs.ensureDir(dataDir);
        
        if (!fs.existsSync(postsDatabase)) {
            await fs.writeJson(postsDatabase, []);
        }
        if (!fs.existsSync(scheduledPosts)) {
            await fs.writeJson(scheduledPosts, []);
        }
    }
};
