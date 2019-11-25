import { Router } from 'express'
import authMiddleware from './app/middlewares/auth'
import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'

const routes = Router()

routes.post('/users', UserController.store)
routes.post('/sessions', SessionController.store)

routes.use(authMiddleware)

routes.get('/users', UserController.index)
routes.put('/users/:id', UserController.update)
routes.delete('/users/:id', UserController.delete)

export default routes