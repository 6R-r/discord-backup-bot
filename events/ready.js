module.exports = async client => {
    client.user.setPresence({
        status: "idle"
    });

    console.log("Bot Online!");
};
