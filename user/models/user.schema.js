const mongoose = require("mongoose");

module.exports = {
    name: "User",
    plugins: {
        password: true
    },
    schema: {
        name: String,
        email: String
    },
    options: {
        timestamps: true
    }
}
