const mongoose = require("mongoose");

module.exports = {
    name: "User",
    plugins: {
        audit: true,
        password: true,
        jwt: true
    },
    schema: {
        name: String,
        email: String
    },
    options: {}
}
