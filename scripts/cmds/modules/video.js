const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');

module.exports = {
    command: 'video',
    description: '🎬 Advanced Video Editing',
    execute: async (args, event, time) => {
        const operation = args[0]?.toLowerCase();
        const attachments = event.messageReply?.attachments || event.attachments;
        
        if (!attachments || attachments.length === 0) {
            return '❌ Koi video nahi mili. Video ke sath command bhejein.';
        }

        const videoUrl = attachments[0].url;
        let urduMessage = '';

        try {
            const tempInput = path.join(__dirname, '../../temp/input_video.mp4');
            const tempOutput = path.join(__dirname, '../../temp/output_video.mp4');

            // Download video
            const response = await global.utils.getStreamFromURL(videoUrl);
            const buffer = await global.utils.getBufferFromStream(response);
            fs.writeFileSync(tempInput, buffer);

            return new Promise((resolve, reject) => {
                let command = ffmpeg(tempInput);

                switch (operation) {
                    case 'trim':
                        const duration = args[1]; // 0:00-1:30 format
                        const [start, end] = duration.split('-');
                        command.setStartTime(start).setDuration(end);
                        urduMessage = `✅ Video trimmed: ${duration}`;
                        break;

                    case 'speed':
                        const speed = parseFloat(args[1]);
                        command.videoFilter(`setpts=${1/speed}*PTS`).audioFilter(`atempo=${speed}`);
                        urduMessage = `✅ Speed changed to ${speed}x`;
                        break;

                    case 'reverse':
                        command.videoFilter('reverse').audioFilter('areverse');
                        urduMessage = '✅ Video reversed ho gayi';
                        break;

                    case 'mute':
                        command.noAudio();
                        urduMessage = '✅ Audio remove ho gaya';
                        break;

                    case 'volume':
                        const volume = args[1];
                        command.audioFilters(`volume=${volume}`);
                        urduMessage = `✅ Volume set to ${volume}`;
                        break;

                    case 'rotate':
                        const degrees = args[1];
                        command.videoFilter(`rotate=${degrees}*PI/180`);
                        urduMessage = `✅ Rotated ${degrees} degrees`;
                        break;

                    default:
                        fs.unlinkSync(tempInput);
                        resolve(`❌ Video operation "${operation}" nahi mila.\n` +
                               `🎬 Available: trim, speed, reverse, mute, volume, rotate`);
                        return;
                }

                command.output(tempOutput)
                    .on('end', async () => {
                        try {
                            const outputBuffer = fs.readFileSync(tempOutput);
                            
                            await event.reply({
                                body: `${urduMessage}\n🕒 Time: ${time}`,
                                attachment: outputBuffer
                            });

                            // Cleanup
                            fs.unlinkSync(tempInput);
                            fs.unlinkSync(tempOutput);
                            
                            resolve(null);
                        } catch (error) {
                            reject(error);
                        }
                    })
                    .on('error', (error) => {
                        fs.unlinkSync(tempInput);
                        if (fs.existsSync(tempOutput)) fs.unlinkSync(tempOutput);
                        reject(error);
                    })
                    .run();
            });

        } catch (error) {
            return `❌ Video processing error: ${error.message}`;
        }
    }
};
