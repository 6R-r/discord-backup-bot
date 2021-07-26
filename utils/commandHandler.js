const fs = require("fs");

class commandHandler {
    constructor(client) {
        fs.readdirSync(`./commands`).forEach((file) => {
            let cmd = require(`../commands/${file}`);
            client.commands.set(cmd.name, cmd);
        });
    }
}

module.exports = commandHandler;
