import * as Yup from 'yup'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import authConfig from './../../config/auth'

class SessionController{
    async store(req, res){
        const schema = Yup.object().shape({
            login: Yup.string().required(),
            password: Yup.string().required()
        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({ error: 'Validation fails' })
        }

        const { login, password } = req.body

        const user = await User.findOne({ where: { login } })

        if(!user){
            return res.status(400).json({ error: 'User not found' })
        }

        if (!(await user.passwordValid(password))){
            return res.status(400).json({ error: 'Password does not match' })
        }

        const { id, name } = user;

        return res.json({
            user: {
                id, 
                name,
                login,  
            },
            //sign(): payload ; secret; options{}
            token: jwt.sign({ id }, authConfig.secret, {
                expiresIn: authConfig.expiresIn
            }) 
        })

    }

}

export default new SessionController()