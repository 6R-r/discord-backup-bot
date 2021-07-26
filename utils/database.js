const fs = require("fs");

if (!fs.existsSync("./db.json", "utf-8")) fs.writeFileSync("./db.json", "{}");

let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));

function set(key, val) {
    data[key] = val;
    fs.writeFileSync("./db.json", JSON.stringify(data, null, 4));
    return val;
}
function del(key) {
    delete data[key];
    fs.writeFileSync("./db.json", JSON.stringify(data, null, 4));
    return true;
}
function get(key) {
    return data[key];
}

module.exports = {
    set,
    del,
    get
};
