module.exports = {
    name: "yardım",
    aliases: ["help"],
    execute(client, message, args, Discord, config, Embed, db) {
        message.delete();
        let lang = db.get(`lang_${message.author.id}`);
        if (lang === "tr") {
            return message.channel
                .send(
                    new Embed(
                        `**__${config.PREFIX}yedek__** | **Yedek sistemi hakkında bilgi alırsınız.**\n**__${config.PREFIX}ping__** | **Botun pingini öğrenirsiniz.**\n**__${config.PREFIX}yenidenbaşlat__** | **Sahibim botu yeniden başlatır.**\n**__${config.PREFIX}eval__** | **Sahibim botta kod dener.**\n**__${config.PREFIX}bakım__** | **Sahibim botta bakım modunu açar/kapar.**\n**__${config.PREFIX}karaliste__** | **Sahibim istediği kişiyi bottan yasaklar.**\n**__${config.PREFIX}dil-değiştir__** | **Botun dilini değiştirirsiniz.**`,
                        "Yardım Menüsü"
                    )
                )
                .then(m => m.delete({ timeout: 30000 }));
        } else if (lang === "en") {
            return message.channel.send(
                new Embed(
                    `**__${config.PREFIX}backup__** | **You get information about the backup system.**\n**__${config.PREFIX}ping__** | **You can find out the ping of the bot.**\n**__${config.PREFIX}restart__** | **My owner restarts the bot.**\n**__${config.PREFIX}eval__** | **My owner tries code on bot.**\n**__${config.PREFIX}maintenance__** | **My owner turns maintenance mode on/off on the bot.**\n**__${config.PREFIX}blacklist__** | **My owner bans anyone he wants from the bot.**\n**__${config.PREFIX}change-language__** | **You change the language of the bot.**`,
                    "Help Menu"
                )
            );
        }
    }
};
