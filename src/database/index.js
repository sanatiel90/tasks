import Sequelize from 'sequelize'
import databaseConfig from './../config/database'
import User from './../app/models/User'
import Task from './../app/models/Task'

const models = [User, Task]

class Database {
    constructor() {
        this.init()
    }

    init() {
        //cria nova conexao com os dados de databaseConfig
        this.connection = new Sequelize(databaseConfig)
        //carrega os models
        models.map(model => model.init(this.connection))
        //executa o metodo associate() caso o model o possua; passa os models da connection como param
        models.map(model => model.associate && model.associate(this.connection.models))
    }

}

export default new Database()