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

process.on('unhandledRejection', error => console.log(error));
process.on('uncaughtException', error => console.log(error));

const axios = require("axios");
const fs = require("fs-extra");
const google = require("googleapis").google;
const nodemailer = require("nodemailer");
const { execSync } = require('child_process');
const log = require('./logger/log.js');
const path = require("path");
const moment = require("moment-timezone");

// 🕒 Karachi Time Function
function getKarachiTime() {
    return moment().tz("Asia/Karachi").format("HH:mm:ss DD-MM-YYYY");
}

// 💫 Marina Bot Banner
function showMarinaBanner() {
    const banner = `
╔══════════════════════════════════════╗
║            💖 MARINA BOT 💖          ║
║      Powered by Goat-Bot V2          ║
║                                      ║
║     👤 Developer: Marina Khan       ║
║     🕒 Karachi Time: ${getKarachiTime()}   ║
║     🌐 Language: Urdu/English        ║
║     🚀 Status: Initializing...       ║
╚══════════════════════════════════════╝
    `;
    console.log(banner);
}

// Show banner on startup
showMarinaBanner();
log.info("🌸", "Marina Bot System shuroo ho raha hai...");
log.info("🕒", `Karachi Time: ${getKarachiTime()}`);

process.env.BLUEBIRD_W_FORGOTTEN_RETURN = 0;

function validJSON(pathDir) {
	try {
		if (!fs.existsSync(pathDir))
			throw new Error(`File "${pathDir}" not found`);
		execSync(`npx jsonlint "${pathDir}"`, { stdio: 'pipe' });
		return true;
	}
	catch (err) {
		let msgError = err.message;
		msgError = msgError.split("\n").slice(1).join("\n");
		const indexPos = msgError.indexOf("    at");
		msgError = msgError.slice(0, indexPos != -1 ? indexPos - 1 : msgError.length);
		throw new Error(msgError);
	}
}

const { NODE_ENV } = process.env;
const dirConfig = path.normalize(`${__dirname}/config${['production', 'development'].includes(NODE_ENV) ? '.dev.json' : '.json'}`);
const dirConfigCommands = path.normalize(`${__dirname}/configCommands${['production', 'development'].includes(NODE_ENV) ? '.dev.json' : '.json'}`);
const dirAccount = path.normalize(`${__dirname}/account${['production', 'development'].includes(NODE_ENV) ? '.dev.txt' : '.txt'}`);

for (const pathDir of [dirConfig, dirConfigCommands]) {
	try {
		validJSON(pathDir);
	}
	catch (err) {
		log.error("CONFIG", `Invalid JSON file "${pathDir.replace(__dirname, "")}":\n${err.message.split("\n").map(line => `  ${line}`).join("\n")}\nPlease fix it and restart bot`);
		process.exit(0);
	}
}
const config = require(dirConfig);
if (config.whiteListMode?.whiteListIds && Array.isArray(config.whiteListMode.whiteListIds))
	config.whiteListMode.whiteListIds = config.whiteListMode.whiteListIds.map(id => id.toString());
const configCommands = require(dirConfigCommands);

// 🌸 Enhanced Global Object with Marina Settings
global.GoatBot = {
	startTime: Date.now() - process.uptime() * 1000,
	commands: new Map(),
	eventCommands: new Map(),
	commandFilesPath: [],
	eventCommandsFilesPath: [],
	aliases: new Map(),
	onFirstChat: [],
	onChat: [],
	onEvent: [],
	onReply: new Map(),
	onReaction: new Map(),
	onAnyEvent: [],
	config,
	configCommands,
	envCommands: {},
	envEvents: {},
	envGlobal: {},
	reLoginBot: function () { },
	Listening: null,
	oldListening: [],
	callbackListenTime: {},
	storage5Message: [],
	fcaApi: null,
	botID: null,
	// 💖 Marina Bot Enhancements
	marinaInfo: {
		owner: "Marina Khan",
		version: "2.0.0",
		language: "urdu-english",
		timezone: "Asia/Karachi",
		startupTime: getKarachiTime(),
		signature: "💖 By Marina Khan"
	}
};

global.db = {
	allThreadData: [],
	allUserData: [],
	allDashBoardData: [],
	allGlobalData: [],
	threadModel: null,
	userModel: null,
	dashboardModel: null,
	globalModel: null,
	threadsData: null,
	usersData: null,
	dashBoardData: null,
	globalData: null,
	receivedTheFirstMessage: {}
};

global.client = {
	dirConfig,
	dirConfigCommands,
	dirAccount,
	countDown: {},
	cache: {},
	database: {
		creatingThreadData: [],
		creatingUserData: [],
		creatingDashBoardData: [],
		creatingGlobalData: []
	},
	commandBanned: configCommands.commandBanned,
	// 🌸 Marina Client Enhancements
	marinaClient: {
		startupTime: getKarachiTime(),
		owner: "Marina Khan",
		status: "initializing"
	}
};

const utils = require("./utils.js");
global.utils = utils;
const { colors } = utils;

global.temp = {
	createThreadData: [],
	createUserData: [],
	createThreadDataError: [],
	filesOfGoogleDrive: {
		arraybuffer: {},
		stream: {},
		fileNames: {}
	},
	contentScripts: {
		cmds: {},
		events: {}
	}
};

// 🔧 Enhanced Config Watcher with Urdu Logs
const watchAndReloadConfig = (dir, type, prop, logName) => {
	let lastModified = fs.statSync(dir).mtimeMs;
	let isFirstModified = true;

	fs.watch(dir, (eventType) => {
		if (eventType === type) {
			const oldConfig = global.GoatBot[prop];

			setTimeout(() => {
				try {
					if (isFirstModified) {
						isFirstModified = false;
						return;
					}
					if (lastModified === fs.statSync(dir).mtimeMs) {
						return;
					}
					global.GoatBot[prop] = JSON.parse(fs.readFileSync(dir, 'utf-8'));
					log.success(logName, `✅ Config reloaded: ${dir.replace(process.cwd(), "")}`);
					log.info("🔄", `Config update at: ${getKarachiTime()}`);
				}
				catch (err) {
					log.warn(logName, `❌ Config reload failed: ${dir.replace(process.cwd(), "")}`);
					global.GoatBot[prop] = oldConfig;
				}
				finally {
					lastModified = fs.statSync(dir).mtimeMs;
				}
			}, 200);
		}
	});
};

watchAndReloadConfig(dirConfigCommands, 'change', 'configCommands', 'CONFIG COMMANDS');
watchAndReloadConfig(dirConfig, 'change', 'config', 'CONFIG');

global.GoatBot.envGlobal = global.GoatBot.configCommands.envGlobal;
global.GoatBot.envCommands = global.GoatBot.configCommands.envCommands;
global.GoatBot.envEvents = global.GoatBot.configCommands.envEvents;

// ———————————————— LOAD LANGUAGE ———————————————— //
const getText = global.utils.getText;

// ———————————————— AUTO RESTART ———————————————— //
if (config.autoRestart) {
	const time = config.autoRestart.time;
	if (!isNaN(time) && time > 0) {
		utils.log.info("AUTO RESTART", `🔄 Bot ${utils.convertTime(time, true)} baad restart hoga`);
		setTimeout(() => {
			utils.log.info("AUTO RESTART", "🔄 Restarting Marina Bot...");
			log.info("💝", "Shukriya! - Marina Khan");
			process.exit(2);
		}, time);
	}
	else if (typeof time == "string" && time.match(/^((((\d+,)+\d+|(\d+(\/|-|#)\d+)|\d+L?|\*(\/\d+)?|L(-\d+)?|\?|[A-Z]{3}(-[A-Z]{3})?) ?){5,7})$/gmi)) {
		utils.log.info("AUTO RESTART", `⏰ Auto restart scheduled: ${time}`);
		const cron = require("node-cron");
		cron.schedule(time, () => {
			utils.log.info("AUTO RESTART", "🔄 Marina Bot restarting...");
			process.exit(2);
		});
	}
}

(async () => {
	// ———————————————— SETUP MAIL ———————————————— //
	const { gmailAccount } = config.credentials;
	const { email, clientId, clientSecret, refreshToken } = gmailAccount;
	const OAuth2 = google.auth.OAuth2;
	const OAuth2_client = new OAuth2(clientId, clientSecret);
	OAuth2_client.setCredentials({ refresh_token: refreshToken });
	let accessToken;
	try {
		accessToken = await OAuth2_client.getAccessToken();
		log.info("📧", "Gmail service connected successfully");
	}
	catch (err) {
		log.error("❌", "Gmail service connection failed");
		throw new Error(getText("Goat", "googleApiTokenExpired"));
	}
	const transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		service: 'Gmail',
		auth: {
			type: 'OAuth2',
			user: email,
			clientId,
			clientSecret,
			refreshToken,
			accessToken
		}
	});

	async function sendMail({ to, subject, text, html, attachments }) {
		const transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			service: 'Gmail',
			auth: {
				type: 'OAuth2',
				user: email,
				clientId,
				clientSecret,
				refreshToken,
				accessToken
			}
		});
		const mailOptions = {
			from: email,
			to,
			subject: `💖 Marina Bot: ${subject}`,
			text,
			html,
			attachments
		};
		const info = await transporter.sendMail(mailOptions);
		return info;
	}

	global.utils.sendMail = sendMail;
	global.utils.transporter = transporter;

	// ———————————————— CHECK VERSION ———————————————— //
	try {
		const { data: { version } } = await axios.get("https://raw.githubusercontent.com/ntkhang03/Goat-Bot-V2/main/package.json");
		const currentVersion = require("./package.json").version;
		if (compareVersion(version, currentVersion) === 1) {
			utils.log.master("NEW VERSION", `📦 New version available! Current: ${colors.gray(currentVersion)}, New: ${colors.hex("#eb6a07", version)}`);
			log.info("💡", "Run 'node update' for latest features");
		} else {
			log.info("✅", "Marina Bot is up to date!");
		}
	} catch (error) {
		log.warn("⚠️", "Version check failed - continuing startup...");
	}
	
	// —————————— CHECK FOLDER GOOGLE DRIVE —————————— //
	const parentIdGoogleDrive = await utils.drive.checkAndCreateParentFolder("MarinaBot");
	utils.drive.parentID = parentIdGoogleDrive;
	log.info("☁️", "Google Drive service initialized");
	
	// ———————————————————— LOGIN ———————————————————— //
	log.info("🔐", "Marina Bot login process shuroo...");
	log.info("🕒", `Login time: ${getKarachiTime()}`);
	require(`./bot/login/login${NODE_ENV === 'development' ? '.dev.js' : '.js'}`);
})();

function compareVersion(version1, version2) {
	const v1 = version1.split(".");
	const v2 = version2.split(".");
	for (let i = 0; i < 3; i++) {
		if (parseInt(v1[i]) > parseInt(v2[i]))
			return 1;
		if (parseInt(v1[i]) < parseInt(v2[i]))
			return -1;
	}
	return 0;
}

// 🛡️ Enhanced Process Handlers with Urdu Messages
process.on('SIGINT', () => {
	log.info("🛑", "Marina Bot band kiya ja raha hai...");
	log.info("💝", "Shukriya! - Marina Khan");
	log.info("🕒", `Shutdown time: ${getKarachiTime()}`);
	process.exit(0);
});

process.on('SIGTERM', () => {
	log.info("📴", "Termination signal received...");
	log.info("🌙", "Allah Hafiz - Marina Khan");
	process.exit(0);
});

// ✅ Agar handler.js scrypt/cmd mein hai to:
const CommandHandler = require('./scrypt/cmd/handler');

// Initialize command handler
const commandHandler = new CommandHandler();

// In your message event handler
module.exports = {
    config: {
        name: "marina",
        version: "2.0",
        author: "Marina Khan",
        countDown: 5,
        role: 0,
        shortDescription: "Multi-functional Bot",
        longDescription: "Advanced bot with 5000+ commands",
        category: "system",
        guide: "{pn} [command]"
    },
    
    onStart: async function({ api, event, args }) {
        await commandHandler.handleMessage({ body: `!${args.join(' ')}` }, event);
    },
    
    onChat: async function({ api, event }) {
        if (event.body?.startsWith('!')) {
            await commandHandler.handleMessage(event, event);
        }
    }
};
