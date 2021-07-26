const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
client.commands = new Discord.Collection();

new (require(`./utils/commandHandler`))(client);
new (require(`./utils/eventHandler`))(client);

client.login(config.TOKEN);
