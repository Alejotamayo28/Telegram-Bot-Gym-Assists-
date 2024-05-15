import nodemailer from 'nodemailer'
import { emailData } from './configEmail'

export const transporter = nodemailer.createTransport({
    host: emailData.smtp,
    port: 465,
    secure: true,
    auth: {
        user: emailData.user,
        pass: emailData.password,
    }
})

transporter.verify().then(() => {
    console.log('Ready for send emails')
})

