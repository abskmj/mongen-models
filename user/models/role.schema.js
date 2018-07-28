module.exports = {
    name: "Role",
    plugins: {
        timestamps: true,
    },
    schema: {
        name: String,
        slug: String,
        desc: String
    },
    options: {}
}
