import Sequelize, { Model } from 'sequelize'
import bcrypt from 'bcryptjs'


class User extends Model {
    static init(sequelize) {
        super.init(
            {
                name: Sequelize.STRING,
                login: Sequelize.STRING,
                email: Sequelize.STRING,
                password: Sequelize.VIRTUAL,
                password_hash: Sequelize.STRING,
                admin: Sequelize.BOOLEAN,
                disabled_at: Sequelize.DATE,
            },
            {
                sequelize
            }

        )

        this.addHook('beforeCreate', async user => {
            if (user.password) {
                user.password_hash = await bcrypt.hash(user.password, 8)
            }
        })

        return this
    }

    passwordValid(password) {
        return bcrypt.compare(password, this.password_hash)
    }



}

export default User