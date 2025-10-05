const { createCanvas, loadImage } = require('canvas');
const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

module.exports = {
    config: {
        name: "pair",
        version: "2.0.0",
        role: 0,
        author: "Marina Khan",
        category: "fun",
        description: "💕 Create beautiful pair DPs with compatibility percentage",
        guide: {
            en: "{pn} [@mention1 | @mention2] or {pn} [name1 | name2]"
        },
        countDown: 10
    },

    onStart: async function({ api, event, args, usersData }) {
        try {
            let name1, name2, userID1, userID2;

            // Case 1: Reply to message with two mentions
            if (event.messageReply && event.messageReply.mentions) {
                const mentions = Object.keys(event.messageReply.mentions);
                if (mentions.length >= 2) {
                    userID1 = mentions[0];
                    userID2 = mentions[1];
                    const userInfo1 = await usersData.get(userID1);
                    const userInfo2 = await usersData.get(userID2);
                    name1 = userInfo1.name;
                    name2 = userInfo2.name;
                }
            }
            // Case 2: Direct mentions in command
            else if (Object.keys(event.mentions).length >= 2) {
                const mentions = Object.keys(event.mentions);
                userID1 = mentions[0];
                userID2 = mentions[1];
                const userInfo1 = await usersData.get(userID1);
                const userInfo2 = await usersData.get(userID2);
                name1 = userInfo1.name;
                name2 = userInfo2.name;
            }
            // Case 3: Names provided with | separator
            else if (args.join(' ').includes('|')) {
                const names = args.join(' ').split('|').map(n => n.trim());
                if (names.length >= 2) {
                    name1 = names[0];
                    name2 = names[1];
                }
            }
            // Case 4: Two names as separate arguments
            else if (args.length >= 2) {
                name1 = args[0];
                name2 = args[1];
            }
            // Case 5: Default names
            else {
                return api.sendMessage(`💕 **Marina's Pair Compatibility**\n\nUsage:\n• ${this.config.name} [@mention1 | @mention2]\n• ${this.config.name} [name1 | name2]\n\nExamples:\n• pair @user1 @user2\n• pair John | Jane\n• Reply to a message with two mentions`, event.threadID);
            }

            // If we have user IDs, get their profile pictures
            let avatar1, avatar2;
            
            if (userID1) {
                avatar1 = `https://graph.facebook.com/${userID1}/picture?width=400&height=400&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
            }
            if (userID2) {
                avatar2 = `https://graph.facebook.com/${userID2}/picture?width=400&height=400&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
            }

            // Send processing message
            api.sendMessage(`💞 Calculating compatibility between ${name1} and ${name2}...`, event.threadID);

            // Generate pair DP
            const pairPath = await generatePairDP(name1, name2, avatar1, avatar2);
            
            // Calculate compatibility percentage (fun algorithm)
            const compatibility = calculateCompatibility(name1, name2);
            
            // Get compatibility message
            const compMessage = getCompatibilityMessage(compatibility);

            // Send the result with DP
            await api.sendMessage({
                body: `💕 **Marina's Pair Compatibility**\n\n👫 Pair: ${name1} 💞 ${name2}\n📊 Compatibility: ${compatibility}%\n💝 Status: ${compMessage}\n\n✨ Made with love by Marina AI`,
                attachment: fs.createReadStream(pairPath)
            }, event.threadID);

            // Cleanup
            setTimeout(() => {
                if (fs.existsSync(pairPath)) {
                    fs.unlinkSync(pairPath);
                }
            }, 5000);

        } catch (error) {
            console.error("Pair command error:", error);
            api.sendMessage("❌ Pair DP creation failed. Please try again!", event.threadID);
        }
    }
};

// Calculate compatibility percentage
function calculateCompatibility(name1, name2) {
    // Simple fun algorithm based on name lengths and characters
    const combined = (name1 + name2).toLowerCase().replace(/\s/g, '');
    let score = 0;
    
    // Base score from name lengths
    score += Math.min(name1.length, name2.length) * 2;
    score += Math.abs(name1.length - name2.length) * 1.5;
    
    // Character matching bonus
    const uniqueChars = new Set(combined).size;
    score += (combined.length - uniqueChars) * 3;
    
    // Random factor for fun
    const randomFactor = Math.random() * 20 + 70;
    
    // Final calculation
    let finalScore = Math.min(100, Math.max(10, Math.round((score + randomFactor) / 2)));
    
    // Ensure it's not 100% too easily
    if (finalScore > 95) finalScore = 85 + Math.floor(Math.random() * 15);
    
    return finalScore;
}

// Get compatibility message
function getCompatibilityMessage(percentage) {
    if (percentage >= 90) return "Perfect Match! 💖";
    if (percentage >= 80) return "Great Compatibility! 💕";
    if (percentage >= 70) return "Good Match! 💝";
    if (percentage >= 60) return "Potential Couple! 💞";
    if (percentage >= 50) return "Maybe... 🤔";
    if (percentage >= 40) return "Needs Work 💫";
    if (percentage >= 30) return "Challenging 💔";
    return "Not Compatible 😢";
}

// Generate beautiful pair DP
async function generatePairDP(name1, name2, avatar1 = null, avatar2 = null) {
    const width = 800;
    const height = 400;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#ff9a9e');
    gradient.addColorStop(0.5, '#fad0c4');
    gradient.addColorStop(1, '#fbc2eb');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    try {
        // Load profile pictures or use default avatars
        let img1, img2;
        
        if (avatar1) {
            const response1 = await axios.get(avatar1, { responseType: 'arraybuffer' });
            img1 = await loadImage(Buffer.from(response1.data));
        } else {
            // Default avatar for name1
            img1 = await createDefaultAvatar(name1.charAt(0).toUpperCase());
        }
        
        if (avatar2) {
            const response2 = await axios.get(avatar2, { responseType: 'arraybuffer' });
            img2 = await loadImage(Buffer.from(response2.data));
        } else {
            // Default avatar for name2
            img2 = await createDefaultAvatar(name2.charAt(0).toUpperCase());
        }

        // Draw circular profile pictures
        const avatarSize = 120;
        const avatarY = height / 2 - avatarSize / 2;
        
        // First avatar (left)
        ctx.save();
        ctx.beginPath();
        ctx.arc(180, height / 2, avatarSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img1, 180 - avatarSize / 2, avatarY, avatarSize, avatarSize);
        ctx.restore();

        // Second avatar (right)
        ctx.save();
        ctx.beginPath();
        ctx.arc(width - 180, height / 2, avatarSize / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img2, width - 180 - avatarSize / 2, avatarY, avatarSize, avatarSize);
        ctx.restore();

        // Add heart between avatars
        ctx.fillStyle = '#ff4d6d';
        ctx.beginPath();
        ctx.arc(width / 2, height / 2, 30, 0, Math.PI * 2);
        ctx.fill();
        
        // Heart shape
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('💖', width / 2, height / 2);

    } catch (error) {
        console.log("Using default avatars due to error:", error.message);
        // Continue with default avatars
    }

    // Add names
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#ff4d6d';
    ctx.lineWidth = 3;
    ctx.textAlign = 'center';

    // Name 1
    ctx.font = 'bold 28px Arial';
    ctx.strokeText(name1, 180, height - 60);
    ctx.fillText(name1, 180, height - 60);

    // Name 2
    ctx.font = 'bold 28px Arial';
    ctx.strokeText(name2, width - 180, height - 60);
    ctx.fillText(name2, width - 180, height - 60);

    // Add pair text
    ctx.font = 'bold 36px Arial';
    ctx.fillStyle = '#ff4d6d';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeText(`${name1.split(' ')[0]} 💞 ${name2.split(' ')[0]}`, width / 2, 50);
    ctx.fillText(`${name1.split(' ')[0]} 💞 ${name2.split(' ')[0]}`, width / 2, 50);

    // Add decorative elements
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.lineWidth = 2;
    
    // Top decoration
    ctx.beginPath();
    ctx.moveTo(width / 2 - 100, 80);
    ctx.lineTo(width / 2 - 50, 85);
    ctx.lineTo(width / 2 + 50, 85);
    ctx.lineTo(width / 2 + 100, 80);
    ctx.stroke();

    // Bottom decoration
    ctx.beginPath();
    ctx.moveTo(width / 2 - 100, height - 80);
    ctx.lineTo(width / 2 - 50, height - 85);
    ctx.lineTo(width / 2 + 50, height - 85);
    ctx.lineTo(width / 2 + 100, height - 80);
    ctx.stroke();

    // Save image
    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const outputPath = path.join(tempDir, `pair_${Date.now()}.png`);
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);
    
    return outputPath;
}

// Create default avatar with initial
async function createDefaultAvatar(initial) {
    const canvas = createCanvas(200, 200);
    const ctx = canvas.getContext('2d');
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 200, 200);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(1, '#764ba2');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 200, 200);
    
    // Initial
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 80px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initial, 100, 100);
    
    return canvas;
}
