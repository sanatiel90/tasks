import Sequelize from 'sequelize'
import databaseConfig from './../config/database'
import User from './../app/models/User'

const models = [User]

class Database {
    constructor() {
        this.init()
    }

    init() {
        //creates the connection 
        this.connection = new Sequelize(databaseConfig)
        //load the models
        models.map(model => model.init(this.connection))

    }

}

export default new Database()