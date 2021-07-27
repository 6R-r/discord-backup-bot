const Embed = require("../utils/Embed");
const db = require("../utils/database");

module.exports = (client, button) => {
    if (button.id === "tr") {
        button.channel.send(
            new Embed(
                `<@${button.clicker.id}> **Türkçe** dili başarıyla seçildi :white_check_mark:`
            )
        );
        db.set(`lang_${button.clicker.id}`, "tr");
    } else if (button.id === "en") {
        button.channel.send(
            new Embed(
                `<@${button.clicker.id}> **English** language has been selected successfully :white_check_mark:`
            )
        );
        db.set(`lang_${button.clicker.id}`, "en");
    }
    button.defer();
};
