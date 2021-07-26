module.exports = {
    name: "karaliste",
    aliases: ["kara-liste", "blacklist", "black-list"],
    execute(client, message, args, Discord, config, Embed, db) {
        message.delete();

        let lang = db.get(`lang_${message.author.id}`);
        if (lang === "tr") {
            if (!config.OWNER.includes(message.author.id))
                return message.channel
                    .send(new Embed(`<@${message.author.id}> Bunun için yetkiniz yok :x:`))
                    .then(m => m.delete({ timeout: 5000 }));
            if (args[0] === "ekle") {
                if (!args[1])
                    return message.channel
                        .send(
                            new Embed(
                                `<@${message.author.id}> Kara listeye alınacak kişinin ID'sini yazmalısın :x:`
                            )
                        )
                        .then(m => m.delete({ timeout: 5000 }));
                if (!args[2])
                    return message.channel
                        .send(
                            new Embed(`<@${message.author.id}> Kara liste sebebini yazmalısın :x:`)
                        )
                        .then(m => m.delete({ timeout: 5000 }));
                if (db.get(`karaliste_${args[1]}`))
                    return message.channel
                        .send(
                            new Embed(
                                `<@${message.author.id}> Bu kişi zaten daha önce kara listeye alınmış :x:`
                            )
                        )
                        .then(m => m.delete({ timeout: 5000 }));

                db.set(`karaliste_${args[1]}`, args[2]);
                return message.channel
                    .send(
                        new Embed(
                            `<@${message.author.id}> | <@${args[1]}> Kişisi başarıyla kara listeye alındı :white_check_mark:`
                        )
                    )
                    .then(m => m.delete({ timeout: 5000 }));
            } else if (args[0] === "çıkar") {
                if (!args[1])
                    return message.channel
                        .send(
                            new Embed(
                                `<@${message.author.id}> Kara listeden çıkarılacak kişinin ID'sini yazmalısın :x:`
                            )
                        )
                        .then(m => m.delete({ timeout: 5000 }));

                if (!db.get(`karaliste_${args[1]}`))
                    return message.channel
                        .send(
                            new Embed(
                                `<@${message.author.id}> Bu kişi zaten daha önce kara listeye alınmamış :x:`
                            )
                        )
                        .then(m => m.delete({ timeout: 5000 }));

                db.del(`karaliste_${args[1]}`);
                return message.channel
                    .send(
                        new Embed(
                            `<@${message.author.id}> | <@${args[1]}> Kişisi başarıyla kara listeten çıkarıldı :white_check_mark:`
                        )
                    )
                    .then(m => m.delete({ timeout: 5000 }));
            } else {
                return message.channel
                    .send(
                        new Embed(
                            `**__${config.PREFIX}karaliste ekle <Kişi ID> <Sebep>__** | **Belirtilen kişiyi bottan yasaklarsınız.**\n**__${config.PREFIX}karaliste çıkar <Kişi ID>__** | **Belirtilen kişinin yasağını bottan kaldırırsınız.**`,
                            "Kara Liste Sistemi"
                        )
                    )
                    .then(m => m.delete({ timeout: 30000 }));
            }
        } else if (lang === "en") {
            if (!config.OWNER.includes(message.author.id))
                return message.channel
                    .send(new Embed(`<@${message.author.id}> You are not authorized for this :x:`))
                    .then(m => m.delete({ timeout: 5000 }));
            if (args[0] === "add") {
                if (!args[1])
                    return message.channel
                        .send(
                            new Embed(
                                `<@${message.author.id}> You have to write the ID of the person to be blacklisted :x:`
                            )
                        )
                        .then(m => m.delete({ timeout: 5000 }));
                if (!args[2])
                    return message.channel
                        .send(
                            new Embed(
                                `<@${message.author.id}> You should write the reason for the blacklist :x:`
                            )
                        )
                        .then(m => m.delete({ timeout: 5000 }));
                if (db.get(`karaliste_${args[1]}`))
                    return message.channel
                        .send(
                            new Embed(
                                `<@${message.author.id}> This person has already been blacklisted :x:`
                            )
                        )
                        .then(m => m.delete({ timeout: 5000 }));

                db.set(`karaliste_${args[1]}`, args[2]);
                return message.channel
                    .send(
                        new Embed(
                            `<@${message.author.id}> | <@${args[1]}> Contact successfully blacklisted :white_check_mark:`
                        )
                    )
                    .then(m => m.delete({ timeout: 5000 }));
            } else if (args[0] === "remove") {
                if (!args[1])
                    return message.channel
                        .send(
                            new Embed(
                                `<@${message.author.id}> You must write the ID of the person to be removed from the blacklist :x:`
                            )
                        )
                        .then(m => m.delete({ timeout: 5000 }));

                if (!db.get(`karaliste_${args[1]}`))
                    return message.channel
                        .send(
                            new Embed(
                                `<@${message.author.id}> This person has not been blacklisted before :x:`
                            )
                        )
                        .then(m => m.delete({ timeout: 5000 }));

                db.del(`karaliste_${args[1]}`);
                return message.channel
                    .send(
                        new Embed(
                            `<@${message.author.id}> | <@${args[1]}> The person was successfully blacklisted :white_check_mark:`
                        )
                    )
                    .then(m => m.delete({ timeout: 5000 }));
            } else {
                return message.channel
                    .send(
                        new Embed(
                            `**__${config.PREFIX}blacklist add <User ID> <Reason>__** | **You ban the specified person from the bot.**\n**__${config.PREFIX}blacklist remove <User ID>__** | **You unban the specified person from the bot.**`,
                            "Black List System"
                        )
                    )
                    .then(m => m.delete({ timeout: 30000 }));
            }
        }
    }
};
