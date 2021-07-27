const { MessageButton } = require("discord-buttons");

module.exports = {
    name: "change-language",
    aliases: ["changelanguage", "dil-değiştir", "dildeğiştir"],
    async execute(client, message, args, Discord, config, Embed, db) {
        message.delete();
       
        let trButton = new MessageButton()
            .setLabel("🇹🇷")
            .setID("tr")
            .setStyle("red");

        let enButton = new MessageButton()
            .setLabel("🇺🇸")
            .setID("en")
            .setStyle("blurple");

        message.channel.send({
            buttons: [trButton, enButton],
            embed: new Embed(
                `:flag_tr: **__TR:__**: Lütfen seçmek istediğiniz dili alttaki butonlar ile belirtiniz.\n:flag_us: **__EN:__** Please indicate the language you want to choose with the buttons below.`
            )
        });
        
    }
};
