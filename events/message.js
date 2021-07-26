const config = require(`../config.json`);
const Discord = require("discord.js");
const Embed = require("../utils/Embed");
const db = require("../utils/database");

module.exports = async (client, message) => {
    if (
        message.author.bot ||
        message.channel.type === "dm" ||
        !message.content.startsWith(config.PREFIX)
    )
        return;

    let args = message.content
        .slice(config.PREFIX.length)
        .trim()
        .split(/ +/g);
    let commandName = args.shift().toLocaleLowerCase();

    const command =
        client.commands.get(commandName) ||
        client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!db.get(`lang_${message.author.id}`)) {
        message.channel
            .send(
                new Embed(
                    `:flag_tr: **__TR:__**: Lütfen seçmek istediğiniz dili alttaki emojiler ile belirtiniz.\n:flag_us: **__EN:__** Please indicate the language you want to choose with the emojis below.`
                )
            )
            .then(async function(msg) {
                let emojiList = ["🇹🇷", "🇺🇸"];

                for (const emoji of emojiList) await msg.react(emoji);

                const reactionCollector = msg.createReactionCollector(
                    (reaction, user) =>
                        emojiList.includes(reaction.emoji.name) &&
                        !user.bot &&
                        user.id == message.author.id
                );

                reactionCollector.on("collect", async reaction => {
                    msg.reactions.removeAll();

                    if (reaction.emoji.name === "🇹🇷") {
                        db.set(`lang_${message.author.id}`, "tr");
                        return msg.edit(
                            new Embed(`<@${message.author.id}> **Türkçe** dili başarıyla seçildi.`)
                        );
                    } else if (reaction.emoji.name === "🇺🇸") {
                        db.set(`lang_${message.author.id}`, "en");
                        return msg.edit(
                            new Embed(
                                `<@${message.author.id}> **English** language has been selected successfully :white_check_mark:`
                            )
                        );
                    }
                });
            });
    }
    if (!command) return;
    else {
        if (db.get("bakım") && !config.OWNER.includes(message.author.id))
            return message.channel
                .send(
                    new Embed(
                        `<@${message.author.id}> Şuanda bakımdayım, bakım sebebi: **${db.get(
                            "bakım"
                        )}**`
                    )
                )
                .then(m => m.delete({ timeout: 10000 }));

        if (db.get(`karaliste_${message.author.id}`) && !config.OWNER.includes(message.author.id))
            return message.channel
                .send(
                    new Embed(
                        `<@${
                            message.author.id
                        }> Olamaz! Görünüşe göre kara listeye alınmışsın! Kara liste sebebi: **${db.get(
                            `karaliste_${message.author.id}`
                        )}**`
                    )
                )
                .then(m => m.delete({ timeout: 10000 }));
        command.execute(client, message, args, Discord, config, Embed, db);
    }
};
