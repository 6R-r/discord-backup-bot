module.exports = {
    name: "bakım",
    aliases: ["maintenance"],
    execute(client, message, args, Discord, config, Embed, db) {
        message.delete();
        let lang = db.get(`lang_${message.author.id}`);
        if (lang === "tr") {
            if (!config.OWNER.includes(message.author.id))
                return message.channel
                    .send(new Embed(`<@${message.author.id}> Bunun için yetkiniz yok :x:`))
                    .then(m => m.delete({ timeout: 5000 }));

            if (args[0] === "aç") {
                if (db.get("bakım"))
                    return message.channel
                        .send(
                            new Embed(
                                `<@${message.author.id}> Bakım modu zaten daha önce açılmış :x:`
                            )
                        )
                        .then(m => m.delete({ timeout: 5000 }));
                if (!args[1])
                    return message.channel
                        .send(new Embed(`<@${message.author.id}> Bakım sebebini yazmalısın :x:`))
                        .then(m => m.delete({ timeout: 5000 }));
                db.set("bakım", args[1]);
                return message.channel
                    .send(
                        new Embed(
                            `<@${message.author.id}> Bakım modu başarıyla açıldı :white_check_mark:`
                        )
                    )
                    .then(m => m.delete({ timeout: 5000 }));
            } else if (args[0] === "kapat") {
                if (!db.get("bakım"))
                    return message.channel
                        .send(
                            new Embed(
                                `<@${message.author.id}> Bakım modu zaten daha önce açılmamış :x:`
                            )
                        )
                        .then(m => m.delete({ timeout: 5000 }));
                db.del("bakım");
                return message.channel
                    .send(
                        new Embed(
                            `<@${message.author.id}> Bakım modu başarıyla kapatıldı :white_check_mark:`
                        )
                    )
                    .then(m => m.delete({ timeout: 5000 }));
            } else {
                return message.channel
                    .send(
                        new Embed(
                            `**__${config.PREFIX}bakım aç <Sebep>__** | **Bakım modunu açarsınız.**\n**__${config.PREFIX}bakım kapat__** | **Bakım modunu kapatırsınız.**`,
                            "Bakım Sistemi"
                        )
                    )
                    .then(m => m.delete({ timeout: 30000 }));
            }
        } else if (lang === "en") {
            if (!config.OWNER.includes(message.author.id))
                return message.channel
                    .send(new Embed(`<@${message.author.id}> You are not authorized for this :x:`))
                    .then(m => m.delete({ timeout: 5000 }));

            if (args[0] === "on") {
                if (db.get("bakım"))
                    return message.channel
                        .send(
                            new Embed(
                                `<@${message.author.id}> Maintenance mode has already been opened :x:`
                            )
                        )
                        .then(m => m.delete({ timeout: 5000 }));
                if (!args[1])
                    return message.channel
                        .send(
                            new Embed(
                                `<@${message.author.id}> You should write the reason for maintenance :x:`
                            )
                        )
                        .then(m => m.delete({ timeout: 5000 }));
                db.set("bakım", args[1]);
                return message.channel
                    .send(
                        new Embed(
                            `<@${message.author.id}> Maintenance mode successfully opened :white_check_mark:`
                        )
                    )
                    .then(m => m.delete({ timeout: 5000 }));
            } else if (args[0] === "off") {
                if (!db.get("bakım"))
                    return message.channel
                        .send(
                            new Embed(
                                `<@${message.author.id}> Maintenance mode has not already been turned on :x:`
                            )
                        )
                        .then(m => m.delete({ timeout: 5000 }));
                db.del("bakım");
                return message.channel
                    .send(
                        new Embed(
                            `<@${message.author.id}> Maintenance mode turned off successfully :white_check_mark:`
                        )
                    )
                    .then(m => m.delete({ timeout: 5000 }));
            } else {
                return message.channel
                    .send(
                        new Embed(
                            `**__${config.PREFIX}maintenance on <Reason>__** | **You turn on maintenance mode.**\n**__${config.PREFIX}maintenance off__** | **You turn off maintenance mode.**`,
                            "Maintenance System"
                        )
                    )
                    .then(m => m.delete({ timeout: 30000 }));
            }
        }
    }
};
