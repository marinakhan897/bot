const sharp = require('sharp');
const log = require('../../logger/log.js');

module.exports = {
    command: 'edit',
    description: '🖼️ Advanced Photo Editing Commands',
    execute: async (args, event, time) => {
        try {
            const operation = args[0]?.toLowerCase();
            const value = args[1];
            
            // Get image from message
            const attachments = event.messageReply?.attachments || event.attachments;
            if (!attachments || attachments.length === 0) {
                return '❌ Koi image nahi mili. Image ke sath command bhejein.';
            }

            const imageUrl = attachments[0].url;
            let imageBuffer;

            // Download image
            try {
                const response = await global.utils.getStreamFromURL(imageUrl);
                imageBuffer = await global.utils.getBufferFromStream(response);
            } catch (error) {
                return '❌ Image download mein masla aya.';
            }

            let processedImage;
            let urduMessage = '';

            // 🎨 Photo Operations
            switch (operation) {
                case 'brightness':
                    processedImage = await sharp(imageBuffer)
                        .modulate({ brightness: parseFloat(value) })
                        .toBuffer();
                    urduMessage = `✅ Brightness ${value}% adjust ho gayi`;
                    break;

                case 'contrast':
                    processedImage = await sharp(imageBuffer)
                        .linear(parseFloat(value), 0)
                        .toBuffer();
                    urduMessage = `✅ Contrast ${value}% set ho gaya`;
                    break;

                case 'saturation':
                    processedImage = await sharp(imageBuffer)
                        .modulate({ saturation: parseFloat(value) })
                        .toBuffer();
                    urduMessage = `✅ Saturation ${value}% adjust ho gayi`;
                    break;

                case 'exposure':
                    processedImage = await sharp(imageBuffer)
                        .linear(parseFloat(value), -(128 * (parseFloat(value) - 1)))
                        .toBuffer();
                    urduMessage = `✅ Exposure ${value} adjust ho gayi`;
                    break;

                case 'blur':
                    processedImage = await sharp(imageBuffer)
                        .blur(parseFloat(value))
                        .toBuffer();
                    urduMessage = `✅ Blur ${value}px lag gaya`;
                    break;

                case 'sharpen':
                    processedImage = await sharp(imageBuffer)
                        .sharpen(parseFloat(value))
                        .toBuffer();
                    urduMessage = `✅ Sharpness ${value}% increase ho gayi`;
                    break;

                case 'rotate':
                    processedImage = await sharp(imageBuffer)
                        .rotate(parseFloat(value))
                        .toBuffer();
                    urduMessage = `✅ Image ${value} degrees ghoom gayi`;
                    break;

                case 'flip':
                    processedImage = await sharp(imageBuffer)
                        .flip()
                        .toBuffer();
                    urduMessage = '✅ Image flip ho gayi';
                    break;

                case 'flop':
                    processedImage = await sharp(imageBuffer)
                        .flop()
                        .toBuffer();
                    urduMessage = '✅ Image horizontal flip ho gayi';
                    break;

                case 'grayscale':
                    processedImage = await sharp(imageBuffer)
                        .grayscale()
                        .toBuffer();
                    urduMessage = '✅ Black & white effect lag gaya';
                    break;

                case 'sepia':
                    processedImage = await sharp(imageBuffer)
                        .tint({ r: 112, g: 66, b: 20 })
                        .toBuffer();
                    urduMessage = '✅ Sepia filter lag gaya';
                    break;

                case 'invert':
                    processedImage = await sharp(imageBuffer)
                        .negate()
                        .toBuffer();
                    urduMessage = '✅ Colors invert ho gaye';
                    break;

                case 'vintage':
                    processedImage = await sharp(imageBuffer)
                        .modulate({ brightness: 0.9, saturation: 0.8 })
                        .gamma(1.2)
                        .toBuffer();
                    urduMessage = '✅ Vintage filter lag gaya';
                    break;

                case 'resize':
                    const [width, height] = value.split('x').map(Number);
                    processedImage = await sharp(imageBuffer)
                        .resize(width, height)
                        .toBuffer();
                    urduMessage = `✅ Size change ho gaya: ${width}x${height}`;
                    break;

                default:
                    return `❌ Unknown operation: ${operation}\n` +
                           `📝 Usage: !edit <operation> <value> [image]\n` +
                           `🎨 Operations: brightness, contrast, saturation, blur, etc.`;
            }

            // Send processed image
            await event.reply({
                body: `${urduMessage}\n🕒 Time: ${time}`,
                attachment: processedImage
            });

            return null; // Already sent image

        } catch (error) {
            log.error(`Photo edit error: ${error.message}`);
            return `❌ Photo edit mein masla aya: ${error.message}`;
        }
    }
};
