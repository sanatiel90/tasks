import express from 'express'
import routes from './routes'
import cors from 'cors'
import './database'

class App {
    constructor() {
        this.server = express()
        this.middlewares()
        this.routes()
    }


    middlewares() {
        this.server.use(express.json())
        
        const corsOptions = {
            origin: 'http://localhost:3000',
            optionsSuccessStatus: 200
        }
        
        this.server.use(cors(corsOptions))
    }

    routes() {
        this.server.use(routes)
    }
    
}

export default new App().server