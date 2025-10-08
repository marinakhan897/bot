/**
 * @author NTKhang + Marina Khan
 * Enhanced by Marina Khan with Urdu/English support
 */

const { spawn } = require("child_process");
const log = require("./logger/log.js");
const moment = require("moment-timezone");

// 🕒 Improved Karachi Time Function
function getKarachiTime() {
    try {
        return moment().tz("Asia/Karachi").format("HH:mm:ss DD-MM-YYYY");
    } catch (error) {
        log.error("Timezone error: " + error.message);
        return moment().format("HH:mm:ss DD-MM-YYYY");
    }
}

// 💫 Fixed Banner Function
function showMarinaBanner() {
    const time = getKarachiTime();
    const banner = `
╔══════════════════════════════════════╗
║            💖 MARINA BOT 💖          ║
║         Powered by Goat-Bot V2       ║
║                                      ║
║     👤 Developer: Marina Khan       ║
║     🕒 Karachi Time: ${time}   ║
║     🌐 Language: Urdu/English        ║
║                                      ║
║     📞 Contact: Marina Khan         ║
╚══════════════════════════════════════╝
    `;
    console.log(banner);
}

// 🚀 Enhanced Project Starter with Error Handling
function startProject() {
    try {
        showMarinaBanner();
        
        log.info("🚀 Bot shuroo ho raha hai... (Starting bot...)");
        log.info("💖 By Marina Khan | Karachi Time: " + getKarachiTime());

        const child = spawn("node", ["Goat.js"], {
            cwd: __dirname,
            stdio: "inherit",
            shell: true
        });

        child.on("close", (code) => {
            if (code === 2) {
                log.info("🔄 Bot dobara start ho raha hai... (Restarting...)");
                startProject();
            } else if (code !== 0) {
                log.warn("⚠️ Bot band hua with code: " + code);
            }
        });

        child.on("error", (err) => {
            log.error("❌ Masla aya hai: " + err.message);
            setTimeout(startProject, 5000);
        });

    } catch (error) {
        log.error("Startup error: " + error.message);
        setTimeout(startProject, 5000);
    }
}

// 🛡️ Better Process Handling
process.on('SIGINT', () => {
    log.info("🛑 Bot band kiya ja raha hai... (Shutting down...)");
    process.exit(0);
});

process.on('uncaughtException', (error) => {
    log.error("❌ Unexpected error: " + error.message);
});

// 🚀 Start the Bot
startProject();
