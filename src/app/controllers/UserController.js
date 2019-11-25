import * as Yup from 'yup'
import User from './../models/User'


class UserController {
    async index(req, res) {
        const users = await User.findAll( { where: { disabled_at: null } })
        
        return res.json(users)
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

    async update(req, res) {
        //data validation
        const schema = Yup.object().shape({
            name: Yup.string().required().min(6),
            login: Yup.string().required().min(6),
            email: Yup.string().required().email(),
            oldPassword: Yup.string().min(6),
            password: Yup.string().min(6)
                .when('oldPassword', (oldPassword, field) =>
                    oldPassword ? field.required() : field
                ),
            confirmPassword: Yup.string().when('password', (password, field) =>
                password ? field.required().oneOf([Yup.ref('passoword')]) : field
            )
        })

        if (!(schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' })
        }

        //get the logged user
        const user = await User.findByPk(req.userId)
        
        const { email, login, password } = req.body

        //verify if new login is already being used
        if(user.login !== login){
            const loginExists = await User.findOne({ where: { login } })
            if (loginExists) {
                return res.status(400).json({ error: 'Login already exists' })
            }
        }

        //verify if new email is already being used
        if(user.email !== email){
            const emailExists = await User.findOne({ where: { email } })
            if (emailExists) {
                return res.status(400).json({ error: 'E-mail already exists' })
            }    
        }    

        //in case of password change, verify if oldPassword matches
        if(oldPassword && !(await user.passwordValid(password))){
            return res.status(400).json({ error: 'OldPassword does not match' })
        }

        const { id, name, admin } = await user.update(req.body)

        return res.json({
            id,
            name,
            login,
            email,
            admin
        })
    }

    async delete(req, res) {
        
        //get logged user
        const userLogged = await User.findByPk(req.userId)
        
        //only admin users may remove users
        if (!userLogged.admin){
            return res.status(401).json({ error: 'You does not have permission to remove users' })
        }
        
        const user = await User.findByPk(req.params.id)

        if(!user){
            return res.status(400).json({ error: 'User does not exists' })
        }

        user.disabled_at = new Date()
        await user.save()

        return res.json(user)
    }
}

export default new UserController()