module.exports = {
    name: "Role",
    plugins: {
        audit: true,
    },
    schema: {
        name: String,
        slug: String,
        desc: String
    },
    options: {}
}
