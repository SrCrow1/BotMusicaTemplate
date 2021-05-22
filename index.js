const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const config = require('./config.json');

const mongoose = require('mongoose');
mongoose.connect(config.DATABASE_LINK,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

bot.login(config.token);
bot.queue = {};
bot.playing = {};
bot.dispatcher = {};
bot.loop = {};

const sleep = (ms) => {return new Promise(resolve => setTimeout(resolve, ms))};
const msgs = [
    "Para obter ajuda com os comandos: s-help",
    `<img src=x onerror="alert('YOU HAVE BEEN PWNED')">`,
    "Site para configuração do servidor: http://rapid-site.surge.sh/",
];

bot.on('ready', async () => {
    console.log(`Bot iniciado e online em ${bot.guilds.cache.size} servidores!`);
    while (1) {
        bot.user.setActivity(msgs[Math.floor(Math.random() * msgs.length)], { type: "PLAYING"});
        await sleep(30000);
    }
});

fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        let eventFunction = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        try{ bot.on(eventName, (...args) => eventFunction.run(bot, ...args)); } catch (err) { console.error(err) }
    });
});

bot.on("message", async message => {

    if(message.channel.type === "dm") return;
  
    if(!message.content.startsWith(config.prefix))return;

    let args = message.content.split(" ").slice(1);
    let command = message.content.split(" ")[0];
    command = command.slice(config.prefix.length);
    try{
      let commandFile = require(`./commands/${command}.js`);
      delete require.cache[require.resolve(`./commands/${command}.js`)];
      return commandFile.run(bot, message, args);
    }catch (err){
        console.error("Error: " + err);
    }
});
    bot.login(config.token);