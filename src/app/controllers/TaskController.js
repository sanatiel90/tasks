import * as Yup from 'yup'
import { parseISO, startOfHour, isBefore } from 'date-fns'
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

        /**
         * startOfHour: pega apenas a hora de uma determinada date
         * parseISO: transforma a date enviada num obj JS do tipo date
         */
        const hourStart = startOfHour(parseISO(date_start))

        //isBefore: verifica se horario 1 é anterior ao horario 2 
        if(isBefore(hourStart, new Date())){
            return res.status(400).json({ error: 'Date start cannot be a past date' })
        }

        if(req.body.date_expected){
            
            if(isBefore(hourStart, new Date())){
                return res.status(400).json({ error: 'Date start cannot be a past date' })
            }


        }


    }

}

export default new TaskController()