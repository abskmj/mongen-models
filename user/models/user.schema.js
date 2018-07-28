module.exports = {
    name: "User",
    plugins: {
        timestamps: true,
        password: true,
        jwt: {
            secret : 'changed'
        },
        role: true
    },
    schema: {
        name: String,
        email: String
    },
    options: {}
}
