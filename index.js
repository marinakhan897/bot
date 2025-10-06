/**
 * @author NTKhang
 * ! The source code is written by NTKhang, please don't change the author's name everywhere. Thank you for using
 * ! Official source code: https://github.com/ntkhang03/Goat-Bot-V2
 * ! If you do not download the source code from the above address, you are using an unknown version and at risk of having your account hacked
 *
 * English:
 * ! Please do not change the below code, it is very important for the project.
 * It is my motivation to maintain and develop the project for free.
 * ! If you change it, you will be banned forever
 * Thank you for using
 *
 * Vietnamese:
 * ! Vui lòng không thay đổi mã bên dưới, nó rất quan trọng đối với dự án.
 * Nó là động lực để tôi duy trì và phát triển dự án miễn phí.
 * ! Nếu thay đổi nó, bạn sẽ bị cấm vĩnh viễn
 * Cảm ơn bạn đã sử dụng
 */

// ==================================================
// 🚀 INTELLIGENT ENHANCEMENTS BY MARINA KHAN
// 🌸 Urdu/English | Karachi Time | Smart Features
// ==================================================

const { spawn } = require("child_process");
const log = require("./logger/log.js");
const moment = require("moment-timezone");

// 🕒 Karachi Time Setup
function getKarachiTime() {
    return moment().tz("Asia/Karachi").format("HH:mm:ss DD-MM-YYYY");
}

// 💫 Smart Startup Banner
function showMarinaBanner() {
    const banner = `
╔══════════════════════════════════════╗
║            💖 MARINA BOT 💖          ║
║         Powered by Goat-Bot V2       ║
║                                      ║
║     👤 Developer: Marina Khan       ║
║     🕒 Karachi Time: ${getKarachiTime()}   ║
║     🌐 Language: Urdu/English        ║
║                                      ║
║     📞 Contact: Marina Khan         ║
╚══════════════════════════════════════╝
    `;
    console.log(banner);
}

// 🚀 Enhanced Project Starter
function startProject() {
    // Show Marina's Custom Banner
    showMarinaBanner();
    
    // Urdu/English Startup Message
    log.info("🚀 Bot shuroo ho raha hai... (Starting bot...)");
    log.info("💖 By Marina Khan | Karachi Time: " + getKarachiTime());

    const child = spawn("node", ["Goat.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    child.on("close", (code) => {
        if (code == 2) {
            log.info("🔄 Bot dobara start ho raha hai... (Restarting...)");
            log.info("⏰ Karachi Time: " + getKarachiTime());
            startProject();
        } else if (code !== 0) {
            log.warn("⚠️ Bot band hua with code: " + code);
            log.info("🕒 Last update: " + getKarachiTime());
        }
    });

    // 🛡️ Error Handling with Urdu Messages
    child.on("error", (err) => {
        log.error("❌ Masla aya hai: " + err.message);
        log.info("💫 5 seconds mein dobara try karo...");
        setTimeout(startProject, 5000);
    });
}

// 🎯 Process Event Handlers with Urdu Support
process.on('SIGINT', () => {
    log.info("🛑 Bot band kiya ja raha hai... (Shutting down...)");
    log.info("💝 Shukriya! - Marina Khan");
    process.exit(0);
});

process.on('SIGTERM', () => {
    log.info("📴 Termination signal mila...");
    log.info("🌙 Allah Hafiz - Marina Khan");
    process.exit(0);
});

// 🚀 Start the Enhanced Bot
log.info("💫 Marina Bot System Initializing...");
log.info("🕒 System Time: " + getKarachiTime());
startProject();
