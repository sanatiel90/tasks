import jwt from 'jsonwebtoken'
import { promisify } from 'util'
import authConfig from './../../config/auth'

//middelware de autenticacao, é uma funcao
export default async (req, res, next) => {
    //recuperando o Bearer token
    const authHeader = req.headers.authorization

    if(!authHeader){
        return res.status(401).json({ error: 'Token not provided' })
    }

    //separando o Bearer do token, e colocando apenas o token numa var, via desestruturacao; a palavra Bearer nao sera usada
    const [, token] = authHeader.split(' ')

    try {
        /**
         * jwt.verify() geralmente recebe como param o token, a secret e uma funcao callback para manipular o retorno,
           porem nesse caso estamos usando o promisify para evitar o uso desse callback, substituindo ele por uma chamada
           await; o promisify() recebe a funcao q sera retirada o callback, e logo em seguida os demais parametros q devem
           ser preenchidos nessa funcao. O valor retornado pelo verify() é o payload do token, q nesse caso foi inserido o id do user 
         */
        const decoded = await promisify(jwt.verify)(token, authConfig.secret)
        req.userId = decoded.id
        return next()
    } catch (err) {
        return res.status(401).json({ error: 'Token invalid' })
    }

}