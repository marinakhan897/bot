const ytdl = require('ytdl-core');
const instagramGetUrl = require('instagram-url-direct');
const tiktokScraper = require('tiktok-scraper');

module.exports = {
    command: 'download',
    description: '📥 Download from Social Media',
    execute: async (args, event, time) => {
        const platform = args[0]?.toLowerCase();
        const url = args[1];

        if (!url) {
            return '❌ URL diye bina. Usage: !download <platform> <url>';
        }

        let urduMessage = '';
        let downloadUrl = '';

        try {
            switch (platform) {
                case 'youtube':
                    if (!ytdl.validateURL(url)) {
                        return '❌ Invalid YouTube URL';
                    }
                    
                    const info = await ytdl.getInfo(url);
                    const format = ytdl.chooseFormat(info.formats, { quality: 'highest' });
                    downloadUrl = format.url;
                    urduMessage = '✅ YouTube video download ready';
                    break;

                case 'instagram':
                    const instaData = await instagramGetUrl(url);
                    if (instaData.url_list && instaData.url_list.length > 0) {
                        downloadUrl = instaData.url_list[0];
                        urduMessage = '✅ Instagram content download ready';
                    } else {
                        return '❌ Instagram se download nahi ho saka';
                    }
                    break;

                case 'tiktok':
                    const videoMeta = await tiktokScraper.getVideoMeta(url);
                    downloadUrl = videoMeta.collector[0].videoUrl;
                    urduMessage = '✅ TikTok video download ready';
                    break;

                case 'audio':
                    if (ytdl.validateURL(url)) {
                        const audioInfo = await ytdl.getInfo(url);
                        const audioFormat = ytdl.chooseFormat(audioInfo.formats, { 
                            quality: 'highestaudio',
                            filter: 'audioonly'
                        });
                        downloadUrl = audioFormat.url;
                        urduMessage = '✅ Audio download ready';
                    } else {
                        return '❌ YouTube URL for audio only';
                    }
                    break;

                default:
                    return `❌ Platform "${platform}" support nahi hai.\n` +
                           `📱 Available: youtube, instagram, tiktok, audio`;
            }

            if (downloadUrl) {
                await event.reply({
                    body: `${urduMessage}\n🕒 Time: ${time}`,
                    attachment: await global.utils.getStreamFromURL(downloadUrl)
                });
                return null;
            } else {
                return '❌ Download URL nahi mila';
            }

        } catch (error) {
            return `❌ Download error: ${error.message}`;
        }
    }
};
