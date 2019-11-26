import { Router } from 'express'
import authMiddleware from './app/middlewares/auth'
import UserController from './app/controllers/UserController'
import SessionController from './app/controllers/SessionController'
import TaskController from './app/controllers/TaskController'

const routes = Router()

routes.post('/users', UserController.store)
routes.post('/sessions', SessionController.store)

routes.use(authMiddleware)

routes.get('/users', UserController.index)
routes.put('/users/:id', UserController.update)
routes.delete('/users/:id', UserController.delete)

routes.get('/tasks', TaskController.index)
routes.post('/tasks', TaskController.store)

export default routes