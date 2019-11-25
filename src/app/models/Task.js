import Sequelize, { Model } from 'sequelize'

class Task extends Model{
    static init(sequelize){
        super.init({
            title: Sequelize.STRING,
            desc: Sequelize.STRING,
            date_start: Sequelize.DATE,
            date_expected: Sequelize.DATE,
            date_finish: Sequelize.DATE
        }, 
        {
            sequelize
        })
    }

    static associate(models){
        this.belongsTo(models.User, { foreignKey: 'user_id', as: 'users' })
    }

}

export default Task