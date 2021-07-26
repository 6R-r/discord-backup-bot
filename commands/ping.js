module.exports = {
    name: "ping",
    aliases: ["ms", "gecikme"],
    execute(client, message, args, Discord, config, Embed, db) {
        message.delete();
        let lang = db.get(`lang_${message.author.id}`);
        if (lang === "tr") {
            return message.channel
                .send(new Embed(`<@${message.author.id}> Pingim: **${client.ws.ping}ms**`))
                .then(m => m.delete({ timeout: 5000 }));
        } else if (lang === "en") {
            return message.channel
                .send(new Embed(`<@${message.author.id}> My ping is: **${client.ws.ping}ms**`))
                .then(m => m.delete({ timeout: 5000 }));
        }
    }
};
