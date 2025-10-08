const sharp = require('sharp');

module.exports = {
    command: 'filter',
    description: '🎨 Apply Photo Filters',
    execute: async (args, event, time) => {
        const filterName = args[0]?.toLowerCase();
        const attachments = event.messageReply?.attachments || event.attachments;
        
        if (!attachments || attachments.length === 0) {
            return '❌ Koi image nahi mili. Image ke sath command bhejein.';
        }

        const imageUrl = attachments[0].url;
        let imageBuffer;

        try {
            const response = await global.utils.getStreamFromURL(imageUrl);
            imageBuffer = await global.utils.getBufferFromStream(response);
        } catch (error) {
            return '❌ Image download mein masla aya.';
        }

        let processedImage;
        let urduMessage = '';

        switch (filterName) {
            case 'vintage':
                processedImage = await sharp(imageBuffer)
                    .modulate({ brightness: 0.9, saturation: 0.7 })
                    .gamma(1.1)
                    .sharpen(0.5)
                    .toBuffer();
                urduMessage = '✅ Vintage filter lag gaya';
                break;

            case 'retro':
                processedImage = await sharp(imageBuffer)
                    .modulate({ brightness: 1.1, saturation: 0.6 })
                    .linear(1.1, 0)
                    .toBuffer();
                urduMessage = '✅ Retro style apply ho gaya';
                break;

            case 'noir':
                processedImage = await sharp(imageBuffer)
                    .grayscale()
                    .linear(1.3, 0)
                    .toBuffer();
                urduMessage = '✅ Film noir effect lag gaya';
                break;

            case 'dramatic':
                processedImage = await sharp(imageBuffer)
                    .linear(1.4, -(128 * 0.4))
                    .modulate({ saturation: 1.2 })
                    .toBuffer();
                urduMessage = '✅ Dramatic effect apply ho gaya';
                break;

            case 'cinematic':
                processedImage = await sharp(imageBuffer)
                    .modulate({ brightness: 0.95, saturation: 1.1 })
                    .gamma(0.9)
                    .toBuffer();
                urduMessage = '✅ Cinematic look mil gaya';
                break;

            case 'warm':
                processedImage = await sharp(imageBuffer)
                    .modulate({ brightness: 1.05 })
                    .tint({ r: 255, g: 240, b: 200 })
                    .toBuffer();
                urduMessage = '✅ Warm tones add ho gaye';
                break;

            case 'cool':
                processedImage = await sharp(imageBuffer)
                    .modulate({ brightness: 1.05 })
                    .tint({ r: 200, g: 220, b: 255 })
                    .toBuffer();
                urduMessage = '✅ Cool blue tones apply ho gaye';
                break;

            default:
                return `❌ Filter "${filterName}" nahi mila.\n` +
                       `🎨 Available: vintage, retro, noir, dramatic, cinematic, warm, cool`;
        }

        await event.reply({
            body: `${urduMessage}\n🕒 Time: ${time}`,
            attachment: processedImage
        });

        return null;
    }
};
