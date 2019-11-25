import * as Yup from 'yup'
import Task from './../models/Task'

class TaskController {

    async store(req, res){
        const schema = Yup.object().shape({
            title: Yup.string().required(),
            desc: Yup.string().required(),
            date_start: Yup.date().required(), 
            date_expected: Yup.date(),
            date_finish: Yup.date()
        })

        if(!(await schema.isValid(req.body))){
            return res.status(400).json({ error: 'Validation fails' })
        }

        
    }

}

export default new TaskController()