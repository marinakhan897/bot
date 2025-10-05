const { findUid } = global.utils;
const moment = require("moment-timezone");

module.exports = {
	config: {
		name: "info",
		version: "1.4",
		author: "NTKhang",
		countDown: 5,
		role: 1,
		description: {
	"request":"",
    "fs-extra":"",
    "axios":""
		},
		category: "box chat",
		guide: {
  }
}
module.exports.run = async function({ api,event,args,client,Users,Threads,__GLOBAL,Currencies }) {
const axios = global.nodemodule["axios"];
const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];
const time = process.uptime(),
		hours = Math.floor(time / (60 * 60)),
		minutes = Math.floor((time % (60 * 60)) / 60),
		seconds = Math.floor(time % 60);
const moment = require("moment-timezone");
var juswa = moment.tz("Asia/Dhaka").format("『D/MM/YYYY』 【HH:mm:ss】");
var link =                                     
["https://imgur.com/a/FXhpXW0"];
var callback = () => api.sendMessage({body:`𝙈𝘼𝙍𝙄𝙉𝘼 𝐀𝐃𝐌𝐈𝐍 𝐀𝐍𝐃 𝐁𝐎𝐓 𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐓𝐈𝐎𝐍 
(𝙈𝘼𝙍𝙄𝙉𝘼𝙆𝙃𝘼𝙉)

☄️Bot Name︎︎︎☄️  ${global.config.BOTNAME}

🔥Bot Admin🔥☞︎︎︎☜︎︎︎✰ 𝙢𝙖𝙧𝙞𝙣𝙖 �🥀

🙈bot andmin owner facebook id link🙈➪ https://www.facebook 💞🕊️

👋For Any Kind Of Help Contact On Telegram  Username 👉 𝙢𝙖𝙧𝙞𝙣𝙖 😇

✧══════•❁❀❁•══════✧

🌸Bot Prefix🌸☞︎︎︎☜︎︎︎✰ ${global.config.PREFIX}

♥️Bot Owner♥️ ☞︎︎︎𝙢𝙖𝙧𝙞𝙣𝙖☜︎︎︎✰ 

🥳UPTIME🥳

🌪️Today is🌪️ ☞︎︎︎☜︎︎︎✰ ${juswa} 

⚡Bot is running⚡ ${hours}:${minutes}:${seconds}.

✅Thanks for using ${global.config.BOTNAME} Bot🖤


🦢🍒•••ꞪɛᏒɛ ɪʂ ɮ❍┼ ❍ωɳɜɽ ɳaʍɜ•••🌷💞
┏━🕊️━━°❀•°:🎀🧸💙🧸🎀:°•❀°━━💞━┓
🌸✦✧✰🍒.        𝙢𝙖𝙧𝙞𝙣𝙖           🌿✰.✧✦🌸
┗━🕊️━━°❀•°:🎀🧸💙🧸🎀:°•❀°━━💞━┛


`,attachment: fs.createReadStream(__dirname + "/cache/juswa.jpg")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/juswa.jpg")); 
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname+"/cache/juswa.jpg")).on("close",() => callback());
   };
