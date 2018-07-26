module.exports = {
    name: "User",
    plugins: {
        audit: true,
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
