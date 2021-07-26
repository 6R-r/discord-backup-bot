module.exports = {
    name: "restart",
    aliases: ["reload", "yenidenbaşlat", "yeniden-başlat", "res", "rs"],
    async execute(client, message, args, Discord, config, Embed, db) {
        let lang = db.get(`lang_${message.author.id}`);
        if (lang === "tr") {
            if (!config.OWNER.includes(message.author.id))
                return message.channel
                    .send(new Embed(`<@${message.author.id}> Bunun için yetkiniz yok :x:`))
                    .then(m => m.delete({ timeout: 5000 }));
            await message.delete();
            await message.channel
                .send(
                    new Embed(
                        `<@${message.author.id}> Bot 5 saniye içinde yeniden başlatılacak :white_check_mark:`
                    )
                )
                .then(m => m.delete({ timeout: 5000 }));
            setTimeout(async () => {
                console.log("Yeniden Başlatılıyor...");
                process.exit();
            }, 5000);
        } else if (lang === "en") {
            if (!config.OWNER.includes(message.author.id))
                return message.channel
                    .send(new Embed(`<@${message.author.id}> You are not authorized for this :x:`))
                    .then(m => m.delete({ timeout: 5000 }));
            await message.delete();
            await message.channel
                .send(
                    new Embed(
                        `<@${message.author.id}> The bot will reboot in 5 seconds :white_check_mark:`
                    )
                )
                .then(m => m.delete({ timeout: 5000 }));
            setTimeout(async () => {
                console.log("Restarting...");
                process.exit();
            }, 5000);
        }
    }
};
