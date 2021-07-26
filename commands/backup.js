const {
    createBackup,
    loadBackup,
    deleteBackup,
    fetchBackup,
    backupHas,
    fetchUserBackups
} = require("backup.djs");

module.exports = {
    name: "backup",
    aliases: ["yedek"],
    async execute(client, message, args, Discord, config, Embed, db) {
        message.delete();

        let option = args[0];

        let lang = db.get(`lang_${message.author.id}`);
        if (lang === "tr") {
            if (option === "liste") {
                const embed = new Discord.MessageEmbed().setColor("RANDOM").setTitle("Yedeklerin");

                await fetchUserBackups(message.author.id).then(data => {
                    data.forEach(backup => {
                        embed.addField(
                            `ID: ${backup.ID}`,
                            `Sunucu: **${backup.data.guild.name}**\nOluşturulma Tarihi: **${backup.data.created}**`
                        );
                    });
                });

                return message.channel.send(embed);
            } else if (option === "oluştur") {
                if (!message.member.hasPermission("ADMINISTRATOR"))
                    return message.channel
                        .send(new Embed(`<@${message.author.id}> Bunun için yetkiniz yok :x:`))
                        .then(m => m.delete({ timeout: 5000 }));
                await createBackup(message.guild, message.author.id).then(backupData => {
                    return message.channel
                        .send(
                            new Embed(
                                `**__Yedeği Yüklemek İçin__**\n\`\`\`${config.PREFIX}yedek yükle ${backupData.id}\`\`\`\n\n**__Yedek Bilgisi İçin__**\n\`\`\`${config.PREFIX}yedek bilgi ${backupData.id}\`\`\`\n\n**__Yedeği Silmek İçin__**\n\`\`\`${config.PREFIX}yedek sil ${backupData.id}\`\`\`\n\n**__Yedeklerinize Bakmak İçin__**\n\`\`\`${config.PREFIX}yedek liste\`\`\``,
                                "Yedek Oluşturuldu"
                            )
                        )
                        .then(m => m.delete({ timeout: 30000 }));
                });
            } else if (option === "yükle") {
                if (message.author.id !== message.guild.ownerID)
                    return message.channel
                        .send(new Embed(`<@${message.author.id}> Bunun için yetkiniz yok :x:`))
                        .then(m => m.delete({ timeout: 5000 }));
                let backupid = args[1];
                if (!backupid)
                    return message.channel
                        .send(new Embed(`<@${message.author.id}> Bir yedek ID'si yazmalısın :x:`))
                        .then(m => m.delete({ timeout: 5000 }));

                message.channel
                    .send(
                        new Embed(
                            `<@${message.author.id}> Yedeğin yüklenmesini istiyorsanız **30** saniye içinde bu kanala **evet**, eğer istemiyorsanız **hayır** yazınız.`
                        )
                    )
                    .then(m => m.delete({ timeout: 30000 }));
                const collector = await message.channel.createMessageCollector(
                    m =>
                        m.author.id === message.author.id &&
                        ["evet", "hayır"].includes(m.content.toLowerCase()),
                    {
                        time: 30000,
                        max: 1
                    }
                );

                collector.on("collect", async m => {
                    const confirm = m.content === "evet";
                    collector.stop();
                    if (confirm) {
                        message.author
                            .send(
                                new Embed(
                                    `<@${message.author.id}> Yedek **${message.guild.name}** adlı sunucuya yükleniyor...`
                                )
                            )
                            .then(m => m.delete({ timeout: 60000 }));

                        await loadBackup(backupid, message.guild, {
                            clearGuild: true
                        }).then(data => {
                            if (data === null)
                                return message.channel
                                    .send(
                                        new Embed(
                                            `<@${message.author.id}> Yazdığınız yedek sistemde bulunamadı :x:`
                                        )
                                    )
                                    .then(m => m.delete({ timeout: 5000 }));
                            else if (data !== null)
                                return message.author
                                    .send(
                                        new Embed(
                                            `<@${message.author.id}> Yedek **${message.guild.name}** adlı sunucuya başarıyla yüklendi :white_check_mark:`
                                        )
                                    )
                                    .then(m => m.delete({ timeout: 60000 }));
                        });
                    } else {
                        return message.channel
                            .send(
                                new Embed(
                                    `<@${message.author.id}> Yedeği yükleme işlemi başarıyla iptal edildi :white_check_mark:`
                                )
                            )
                            .then(m => m.delete({ timeout: 5000 }));
                    }
                });

                collector.on("end", (collected, reason) => {
                    if (reason === "time")
                        return message.channel.send(
                            new Embed(
                                `<@${message.author.id}> Yedeği yükleme işlemi **30** saniye geçtiği iptal edildi :x:`
                            )
                        );
                });
            } else if (option === "bilgi") {
                let backupid = args[1];
                if (!backupid)
                    return message.channel
                        .send(new Embed(`<@${message.author.id}> Bir yedek ID'si yazmalısın :x:`))
                        .then(m => m.delete({ timeout: 5000 }));

                await fetchBackup(backupid).then(data => {
                    if (data === null)
                        return message.channel
                            .send(
                                new Embed(
                                    `<@${message.author.id}> Yazdığınız yedek sistemde bulunamadı :x:`
                                )
                            )
                            .then(m => m.delete({ timeout: 5000 }));
                    else if (data !== null) {
                        let roles;
                        roles = data.roles.map(r => r.name).join("\n");

                        let others;
                        others = data.channels.others.map(c => c.name).join("\n  ") || "\n";

                        let categories;
                        categories = data.channels.categories
                            .map(c => `• ${c.name}\n  ${c.children.map(c => c.name).join("\n  ")}`)
                            .join("\n\n");

                        if (roles.length > 1024) {
                            roles = `${roles.slice(0, 300)} ...`;
                        }

                        if (others.length > 1024) {
                            others = `${others.slice(0, 300)} ...`;
                        }

                        if (categories.length > 1024) {
                            categories = `${categories.slice(0, 300)} ...`;
                        }

                        return message.channel
                            .send(
                                new Discord.MessageEmbed()
                                    .setColor("RANDOM")
                                    .setTitle("Yedek Bilgisi")
                                    .addField("Oluşturan", `<@${data.author}>`)
                                    .addField("Oluşturulma Tarihi", data.created)
                                    .addField(
                                        "Kanallar",
                                        `\`\`\`${others} \n\n${categories}\`\`\``,
                                        true
                                    )
                                    .addField("Roller", `\`\`\`${roles}\`\`\``, true)
                            )
                            .then(m => m.delete({ timeout: 30000 }))
                            .catch(err => {});
                    }
                });
            } else if (option === "sil") {
                let backupid = args[1];
                if (!backupid)
                    return message.channel
                        .send(new Embed(`<@${message.author.id}> Bir yedek ID'si yazmalısın :x:`))
                        .then(m => m.delete({ timeout: 5000 }));

                await deleteBackup(backupid, message.author.id).then(data => {
                    if (data === null)
                        return message.channel
                            .send(
                                new Embed(
                                    `<@${message.author.id}> Yazdığınız yedek sistemde bulunamadı :x:`
                                )
                            )
                            .then(m => m.delete({ timeout: 5000 }));
                    else if (data === false)
                        return message.channel
                            .send(
                                new Embed(
                                    `<@${message.author.id}> Yazdığınız yedeği oluşturan kişi siz olmadığınız için silemezsiniz :x:`
                                )
                            )
                            .then(m => m.delete({ timeout: 5000 }));
                    else if (data === true)
                        return message.channel
                            .send(
                                new Embed(
                                    `<@${message.author.id}> Yazdığınız yedek başarıyla silindi :white_check_mark:`
                                )
                            )
                            .then(m => m.delete({ timeout: 5000 }));
                });
            } else if (option === "kontrol") {
                let backupid = args[1];
                if (!backupid)
                    return message.channel
                        .send(new Embed(`<@${message.author.id}> Bir yedek ID'si yazmalısın :x:`))
                        .then(m => m.delete({ timeout: 5000 }));

                let control = backupHas(backupid);

                if (control === true)
                    return message.channel
                        .send(
                            new Embed(
                                `<@${message.author.id}> Yazdığınız yedek sistemde bulunuyor :white_check_mark:`
                            )
                        )
                        .then(m => m.delete({ timeout: 5000 }));
                else if (control === false)
                    return message.channel
                        .send(
                            new Embed(
                                `<@${message.author.id}> Yazdığınız yedek sistemde bulunmuyor :x:`
                            )
                        )
                        .then(m => m.delete({ timeout: 5000 }));
            } else {
                return message.channel
                    .send(
                        new Embed(
                            `**__${config.PREFIX}yedek oluştur__** | **Yedek Oluşturursunuz.**\n**__${config.PREFIX}yedek yükle__** | **Yedek Yüklersiniz.**\n**__${config.PREFIX}yedek sil__** | **Yedek Silersiniz.**\n**__${config.PREFIX}yedek bilgi__** | **Yedek Bilgisi Alırsınız.**\n**__${config.PREFIX}yedek kontrol__** | **Yedek Varmı/Yokmu Kontrol Eder.**\n**__${config.PREFIX}yedek liste__** | **Yedeklerinize Bakarsınız.**`,
                            "Yedek Sistemi"
                        )
                    )
                    .then(m => m.delete({ timeout: 30000 }));
            }
        } else if (lang === "en") {
            if (option === "list") {
                const embed = new Discord.MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle("Your Backups");

                await fetchUserBackups(message.author.id).then(data => {
                    data.forEach(backup => {
                        embed.addField(
                            `ID: ${backup.ID}`,
                            `Guild: **${backup.data.guild.name}**\nCreated: **${backup.data.created}**`
                        );
                    });
                });

                return message.channel.send(embed);
            } else if (option === "create") {
                if (!message.member.hasPermission("ADMINISTRATOR"))
                    return message.channel
                        .send(
                            new Embed(`<@${message.author.id}> You are not authorized for this :x:`)
                        )
                        .then(m => m.delete({ timeout: 5000 }));
                await createBackup(message.guild, message.author.id).then(backupData => {
                    return message.channel
                        .send(
                            new Embed(
                                `**__To Load Backup__**\n\`\`\`${config.PREFIX}backup load ${backupData.id}\`\`\`\n\n**__For Backup Information__**\n\`\`\`${config.PREFIX}backup info ${backupData.id}\`\`\`\n\n**__To Delete the Backup__**\n\`\`\`${config.PREFIX}backup delete ${backupData.id}\`\`\`\n\n**__To See Your Backups__**\n\`\`\`${config.PREFIX}backup list\`\`\``,
                                "Backup Created"
                            )
                        )
                        .then(m => m.delete({ timeout: 30000 }));
                });
            } else if (option === "load") {
                if (message.author.id !== message.guild.ownerID)
                    return message.channel
                        .send(
                            new Embed(`<@${message.author.id}> You are not authorized for this :x:`)
                        )
                        .then(m => m.delete({ timeout: 5000 }));
                let backupid = args[1];
                if (!backupid)
                    return message.channel
                        .send(
                            new Embed(`<@${message.author.id}> You have to write a backup ID :x:`)
                        )
                        .then(m => m.delete({ timeout: 5000 }));

                message.channel
                    .send(
                        new Embed(
                            `<@${message.author.id}> If you want the backup to be loaded, write **yes** to this channel within **30** seconds, if you do not want it, write **no**.`
                        )
                    )
                    .then(m => m.delete({ timeout: 30000 }));
                const collector = await message.channel.createMessageCollector(
                    m =>
                        m.author.id === message.author.id &&
                        ["yes", "no"].includes(m.content.toLowerCase()),
                    {
                        time: 30000,
                        max: 1
                    }
                );

                collector.on("collect", async m => {
                    const confirm = m.content === "yes";
                    collector.stop();
                    if (confirm) {
                        message.author
                            .send(
                                new Embed(
                                    `<@${message.author.id}> Loading backup to server **${message.guild.name}**...`
                                )
                            )
                            .then(m => m.delete({ timeout: 60000 }));

                        await loadBackup(backupid, message.guild, {
                            clearGuild: true
                        }).then(data => {
                            if (data === null)
                                return message.channel
                                    .send(
                                        new Embed(
                                            `<@${message.author.id}> The backup you typed was not found on the system :x:`
                                        )
                                    )
                                    .then(m => m.delete({ timeout: 5000 }));
                            else if (data !== null)
                                return message.channel
                                    .send(
                                        new Embed(
                                            `<@${message.author.id}> Backup successfully loaded to server **${message.guild.name}** :white_check_mark:`
                                        )
                                    )
                                    .then(m => m.delete({ timeout: 60000 }));
                        });
                    } else {
                        return message.channel
                            .send(
                                new Embed(
                                    `<@${message.author.id}> Backup operation aborted successfully :white_check_mark:`
                                )
                            )
                            .then(m => m.delete({ timeout: 5000 }));
                    }
                });

                collector.on("end", (collected, reason) => {
                    if (reason === "time")
                        return message.channel.send(
                            new Embed(
                                `<@${message.author.id}> Backup process canceled after **30** seconds :x:`
                            )
                        );
                });
            } else if (option === "info") {
                let backupid = args[1];
                if (!backupid)
                    return message.channel
                        .send(
                            new Embed(`<@${message.author.id}> You have to write a backup ID :x:`)
                        )
                        .then(m => m.delete({ timeout: 5000 }));

                await fetchBackup(backupid).then(data => {
                    if (data === null)
                        return message.channel
                            .send(
                                new Embed(
                                    `<@${message.author.id}> The backup you typed was not found on the system :x:`
                                )
                            )
                            .then(m => m.delete({ timeout: 5000 }));
                    else if (data !== null) {
                        let roles;
                        roles = data.roles.map(r => r.name).join("\n");

                        let others;
                        others = data.channels.others.map(c => c.name).join("\n  ") || "\n";

                        let categories;
                        categories = data.channels.categories
                            .map(c => `• ${c.name}\n  ${c.children.map(c => c.name).join("\n  ")}`)
                            .join("\n\n");

                        if (roles.length > 1024) {
                            roles = `${roles.slice(0, 300)} ...`;
                        }

                        if (others.length > 1024) {
                            others = `${others.slice(0, 300)} ...`;
                        }

                        if (categories.length > 1024) {
                            categories = `${categories.slice(0, 300)} ...`;
                        }

                        return message.channel
                            .send(
                                new Discord.MessageEmbed()
                                    .setColor("RANDOM")
                                    .setTitle("backup Info")
                                    .addField("Creator", `<@${data.author}>`)
                                    .addField("Created", data.created)
                                    .addField(
                                        "Channels",
                                        `\`\`\`${others} \n\n${categories}\`\`\``,
                                        true
                                    )
                                    .addField("Roles", `\`\`\`${roles}\`\`\``, true)
                            )
                            .then(m => m.delete({ timeout: 30000 }))
                            .catch(err => {});
                    }
                });
            } else if (option === "delete") {
                let backupid = args[1];
                if (!backupid)
                    return message.channel
                        .send(
                            new Embed(`<@${message.author.id}> You have to write a backup ID :x:`)
                        )
                        .then(m => m.delete({ timeout: 5000 }));

                await deleteBackup(backupid, message.author.id).then(data => {
                    if (data === null)
                        return message.channel
                            .send(
                                new Embed(
                                    `<@${message.author.id}> The backup you typed was not found on the system :x:`
                                )
                            )
                            .then(m => m.delete({ timeout: 5000 }));
                    else if (data === false)
                        return message.channel
                            .send(
                                new Embed(
                                    `<@${message.author.id}> You cannot delete the backup you wrote because you are not the person who created it :x:`
                                )
                            )
                            .then(m => m.delete({ timeout: 5000 }));
                    else if (data === true)
                        return message.channel
                            .send(
                                new Embed(
                                    `<@${message.author.id}> The backup you wrote has been successfully deleted :white_check_mark:`
                                )
                            )
                            .then(m => m.delete({ timeout: 5000 }));
                });
            } else if (option === "control") {
                let backupid = args[1];
                if (!backupid)
                    return message.channel
                        .send(
                            new Embed(`<@${message.author.id}> You have to write a backup ID :x:`)
                        )
                        .then(m => m.delete({ timeout: 5000 }));

                let control = backupHas(backupid);

                if (control === true)
                    return message.channel
                        .send(
                            new Embed(
                                `<@${message.author.id}> The backup you wrote is in the system :white_check_mark:`
                            )
                        )
                        .then(m => m.delete({ timeout: 5000 }));
                else if (control === false)
                    return message.channel
                        .send(
                            new Embed(
                                `<@${message.author.id}> The backup you wrote does not exist on the system :x:`
                            )
                        )
                        .then(m => m.delete({ timeout: 5000 }));
            } else {
                return message.channel
                    .send(
                        new Embed(
                            `**__${config.PREFIX}backup create__** | **You Create a Backup.**\n**__${config.PREFIX}backup load__** | **You Load Backup.**\n**__${config.PREFIX}backup delete__** | **You Delete Backup.**\n**__${config.PREFIX}backup info__** | **You Get Backup Information.**\n**__${config.PREFIX}backup control__** | **Checks if there is a spare or not.**\n**__${config.PREFIX}backup list__** | **You'll Look at Your Backups.**`,
                            "Backup System"
                        )
                    )
                    .then(m => m.delete({ timeout: 30000 }));
            }
        }
    }
};
