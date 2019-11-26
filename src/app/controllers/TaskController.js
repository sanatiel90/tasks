import * as Yup from 'yup'
import { parseISO, startOfHour, isBefore } from 'date-fns'
import { zonedTimeToUtc } from "date-fns-tz";
import Task from './../models/Task'

class TaskController {

    async store(req, res) {
        const schema = Yup.object().shape({
            title: Yup.string().required().min(6),
            desc: Yup.string().required().min(6),
            date_start: Yup.date().required(),
            date_expected: Yup.date(),
            date_finish: Yup.date()
        })

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Validation fails' })
        }

        const { title, desc, date_start, date_expected, date_finish } = req.body

        const currentDate = zonedTimeToUtc(new Date(), 'America/Sao_Paulo')
        /** 
         * startOfHour: pega apenas a hora de uma determinada date
         * parseISO: transforma a date enviada num obj JS do tipo date
         */
        const znDateStart = zonedTimeToUtc(parseISO(date_start), 'America/Sao_Paulo')
        const dateStartHourStart = startOfHour(znDateStart)

        //isBefore: verifica se horario 1 é anterior ao horario 2 
        //verifica data inicio
        if (isBefore(dateStartHourStart, currentDate)) {
            return res.status(400).json({ error: 'Date start cannot be a past date' })
        }

        //verifica data prevista, caso exista
        if (date_expected) {
            const dateExpHourStart = startOfHour(parseISO(date_expected))
            if (isBefore(dateExpHourStart, currentDate)) {
                return res.status(400).json({ error: 'Date expected cannot be a past date' })
            }
            if (isBefore(dateExpHourStart, dateStartHourStart)) {
                return res.status(400).json({ error: 'Date expected cannot be before the date start' })
            }
        }

        //verifica data finalizada, caso exista
        if (date_finish) {
            const dateFinHourStart = startOfHour(parseISO(date_finish))
            if (isBefore(dateFinHourStart, currentDate)) {
                return res.status(400).json({ error: 'Date finish cannot be a past date' })
            }
            if (isBefore(dateFinHourStart, dateStartHourStart)) {
                return res.status(400).json({ error: 'Date finish cannot be before the date start' })
            }
        }

        console.log(currentDate)
        console.log('body: ' + date_start)
        console.log('zone: ' + znDateStart)


        const task = await Task.create({
            title,
            desc,
            date_start: znDateStart,
            date_expected,
            date_finish,
            user_id: req.userId
        })

        return res.json(task)

    }

}

export default new TaskController()