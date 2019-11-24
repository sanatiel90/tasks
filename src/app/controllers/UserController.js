import * as Yup from 'yup'
import User from './../models/User'


class UserController {
    async index(req, res) {
        res.json({ msg: 'Ok' })
    }

    async store(req, res) {
        //data validation
        const schema = Yup.object().shape({
            name: Yup.string().required().min(6),
            login: Yup.string().required().min(6),
            email: Yup.string().required().email(),
            password: Yup.string().required().min(6),
        })

        if (!(schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' })
        }

        const { name, email, login, password } = req.body

        const loginExists = await User.findOne({ where: { login } })

        if (loginExists) {
            return res.status(400).json({ error: 'Login already exists' })
        }

        const emailExists = await User.findOne({ where: { email } })

        if (emailExists) {
            return res.status(400).json({ error: 'E-mail already exists' })
        }


        const user = await User.create({
            name,
            login,
            email,
            password
        })

        return res.status(201).json(user)

    }
}

export default new UserController()