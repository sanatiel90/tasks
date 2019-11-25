import { Router } from 'express'

const routes = Router()
import UserController from './app/controllers/UserController'

routes.get('/users', UserController.index)
routes.post('/users', UserController.store)
routes.put('/users/:id', UserController.update)
routes.delete('/users/:id', UserController.delete)

export default routes