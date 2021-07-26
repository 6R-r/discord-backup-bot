module.exports = {
    name: "eval",
    aliases: [],
    execute(client, message, args, Discord, config, Embed, db) {
        message.delete();
        let lang = db.get(`lang_${message.author.id}`);
        if (lang === "tr") {
            if (!config.OWNER.includes(message.author.id))
                return message.channel
                    .send(new Embed(`<@${message.author.id}> Bunun için yetkiniz yok :x:`))
                    .then(m => m.delete({ timeout: 5000 }));

            let girilen = args.join(" ");
            if (!girilen)
                return message.channel
                    .send(new Embed(`<@${message.author.id}> Girilecek kodu yazmalısın :x:`))
                    .then(m => m.delete({ timeout: 5000 }));

            let sonuc = eval(girilen);

            let types = ["string", "float", "boolean", "number"];
            try {
                if (types.includes(typeof sonuc)) {
                    return message.channel
                        .send(
                            new Embed(
                                `**__Girilen__**\n` +
                                    "```js\n" +
                                    girilen +
                                    "\n```" +
                                    "\n**__Sonuç__**\n" +
                                    "```js\n" +
                                    sonuc +
                                    "\n```" +
                                    "\n**__Uzunluk:__** " +
                                    girilen.length +
                                    " | **__Tip:__** " +
                                    typeof sonuc
                            )
                        )
                        .then(m => m.delete({ timeout: 30000 }));
                } else {
                    return message.channel
                        .send(
                            new Embed(
                                `**__Girilen__**\n` +
                                    "```js\n" +
                                    girilen +
                                    "\n```" +
                                    "\n**__Sonuç__**\n" +
                                    "```js\n" +
                                    "İşlem Başarılı." +
                                    "\n```" +
                                    "\n**__Uzunluk:__** " +
                                    girilen.length +
                                    " | **__Tip__:** " +
                                    typeof sonuc
                            )
                        )
                        .then(m => m.delete({ timeout: 30000 }));
                }
            } catch (err) {
                return message.channel
                    .send(
                        new Embed(
                            `**__Girilen__**\n` +
                                "```js\n" +
                                girilen +
                                "\n```" +
                                "\n**__Sonuç__**\n" +
                                "```js\n" +
                                err +
                                "\n```" +
                                "\n**__Uzunluk:__** " +
                                girilen.length +
                                " | **__Tip:__** " +
                                typeof sonuc
                        )
                    )
                    .then(m => m.delete({ timeout: 30000 }));
            }
        } else if (lang === "en") {
            if (!config.OWNER.includes(message.author.id))
                return message.channel
                    .send(new Embed(`<@${message.author.id}> You are not authorized for this :x:`))
                    .then(m => m.delete({ timeout: 5000 }));

            let girilen = args.join(" ");
            if (!girilen)
                return message.channel
                    .send(
                        new Embed(`<@${message.author.id}> You have to write the code to enter :x:`)
                    )
                    .then(m => m.delete({ timeout: 5000 }));

            let sonuc = eval(girilen);

            let types = ["string", "float", "boolean", "number"];
            try {
                if (types.includes(typeof sonuc)) {
                    return message.channel
                        .send(
                            new Embed(
                                `**__Entered__**\n` +
                                    "```js\n" +
                                    girilen +
                                    "\n```" +
                                    "\n**__Result__**\n" +
                                    "```js\n" +
                                    sonuc +
                                    "\n```" +
                                    "\n**__Length:__** " +
                                    girilen.length +
                                    " | **__Type:__** " +
                                    typeof sonuc
                            )
                        )
                        .then(m => m.delete({ timeout: 30000 }));
                } else {
                    return message.channel
                        .send(
                            new Embed(
                                `**__Entered__**\n` +
                                    "```js\n" +
                                    girilen +
                                    "\n```" +
                                    "\n**__Result__**\n" +
                                    "```js\n" +
                                    "Transaction Successful." +
                                    "\n```" +
                                    "\n**__Length:__** " +
                                    girilen.length +
                                    " | **__Type__:** " +
                                    typeof sonuc
                            )
                        )
                        .then(m => m.delete({ timeout: 30000 }));
                }
            } catch (err) {
                return message.channel
                    .send(
                        new Embed(
                            `**__Entered__**\n` +
                                "```js\n" +
                                girilen +
                                "\n```" +
                                "\n**__Result__**\n" +
                                "```js\n" +
                                err +
                                "\n```" +
                                "\n**__Length:__** " +
                                girilen.length +
                                " | **__Type:__** " +
                                typeof sonuc
                        )
                    )
                    .then(m => m.delete({ timeout: 30000 }));
            }
        }
    }
};
