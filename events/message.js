const config = require(`../config.json`);
const Discord = require("discord.js");
const Embed = require("../utils/Embed");
const db = require("../utils/database");
const { MessageButton } = require("discord-buttons");

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
        let trButton = new MessageButton()
            .setLabel("🇹🇷")
            .setID("tr")
            .setStyle("red");

        let enButton = new MessageButton()
            .setLabel("🇺🇸")
            .setID("en")
            .setStyle("blurple");

        return message.channel.send({
            buttons: [trButton, enButton],
            embed: new Embed(
                `:flag_tr: **__TR:__**: Lütfen seçmek istediğiniz dili alttaki butonlar ile belirtiniz.\n:flag_us: **__EN:__** Please indicate the language you want to choose with the buttons below.`
            )
        });
    }
    if (!command) return;
    else {
        let lang = db.get(`lang_${message.author.id}`);

        if (db.get("bakım") && !config.OWNER.includes(message.author.id)) {
            if (lang === "tr") {
                return message.channel
                    .send(
                        new Embed(
                            `<@${message.author.id}> Şuanda bakımdayım, bakım sebebi: **${db.get(
                                "bakım"
                            )}**`
                        )
                    )
                    .then(m =>
                        m.delete({
                            timeout: 10000
                        })
                    );
            } else if (lang === "en") {
                return message.channel
                    .send(
                        new Embed(
                            `<@${
                                message.author.id
                            }> I am currently in maintenance, the reason for maintenance: **${db.get(
                                "bakım"
                            )}**`
                        )
                    )
                    .then(m =>
                        m.delete({
                            timeout: 10000
                        })
                    );
            }
        }
        if (db.get(`karaliste_${message.author.id}`) && !config.OWNER.includes(message.author.id)) {
            if (lang === "tr") {
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
            } else if (lang === "en") {
                return message.channel
                    .send(
                        new Embed(
                            `<@${
                                message.author.id
                            }> I can not be! Looks like you've been blacklisted! Blacklist reason: **${db.get(
                                `karaliste_${message.author.id}`
                            )}**`
                        )
                    )
                    .then(m => m.delete({ timeout: 10000 }));
            }
        }
        command.execute(client, message, args, Discord, config, Embed, db);
    }
};
