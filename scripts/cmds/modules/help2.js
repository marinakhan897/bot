module.exports = {
    command: 'help2',
    description: '📚 Show All Available Commands',
    execute: async (args, event, time) => {
        const commandHandler = require('../handler');
        const handler = new commandHandler();
        const commands = handler.getCommandList();

        const categories = {
            '📸 Photo Editing': ['edit', 'filter', 'effect'],
            '🎬 Video Editing': ['video', 'convert'],
            '🎯 Logo Making': ['logo', 'brand'],
            '🖼️ Banner Creation': ['banner', 'cover'],
            '📥 Downloads': ['download', 'get'],
            '🤖 AI Generation': ['ai', 'generate'],
            '🔧 Utilities': ['help', 'status', 'info']
        };

        let helpMessage = `💖 **MARINA BOT HELP** 💖\n` +
                         `🕒 Karachi Time: ${time}\n\n`;

        for (const [category, cmds] of Object.entries(categories)) {
            const availableCmds = cmds.filter(cmd => commands.includes(cmd));
            if (availableCmds.length > 0) {
                helpMessage += `${category}:\n` +
                             `┣ ${availableCmds.map(cmd => `!${cmd}`).join(', ')}\n\n`;
            }
        }

        helpMessage += `📝 **Usage Examples:**\n` +
                      `┣ !edit brightness +50 [image]\n` +
                      `┣ !logo modern "Your Brand"\n` +
                      `┣ !download youtube [url]\n` +
                      `┣ !banner youtube "Channel Name"\n` +
                      `┗ !filter vintage [image]\n\n` +
                      `🌐 **Developer:** Marina Khan\n` +
                      `🕒 **System Time:** ${time}`;

        return helpMessage;
    }
};
