const Discord = require("discord.js");

class Embed {
    constructor(description, title = "", color = "RANDOM", timestamp = "", footer = "") {
        const messageEmbed = new Discord.MessageEmbed().setColor(color).setDescription(description);

        if (timestamp === true) messageEmbed.setTimestamp();
        if (title !== "") messageEmbed.setTitle(title);
        if (footer !== "") messageEmbed.setFooter(footer);

        return messageEmbed;
    }
}

module.exports = Embed;
