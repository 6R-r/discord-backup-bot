const fs = require("fs");

class commandHandler {
    constructor(client) {
        fs.readdirSync(`./events`).forEach((file) => {
            let event = require(`../events/${file}`);
            let eventName = file.split(".")[0];
            client.on(eventName, event.bind(null, client));
        });
    }
}

module.exports = commandHandler;
