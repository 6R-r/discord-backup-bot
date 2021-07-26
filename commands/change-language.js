module.exports = {
    name: "change-language",
    aliases: ["changelanguage", "dil-değiştir", "dildeğiştir"],
    async execute(client, message, args, Discord, config, Embed, db) {
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
};
