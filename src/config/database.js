module.exports = {
    dialect: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: 'postgres',
    database: 'tasks',
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true
    }
}