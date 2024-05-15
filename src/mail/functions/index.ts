import { emailData } from "../configEmail"
import { transporter } from "../mailer"

export const sendEmailClient = async (to: string, subject: string, text: string) => {
    await transporter.sendMail({
        from: `"Testing"<${emailData.user}`,
        to,
        subject,
        text,
    })
}

export const emailTextClient = (Data: any) => {
    return `El cliente ha sido creado satisfactoriamente
    Hi, welcome to my app, it is an alpha, be patient
    im doing my best to get it done`
}

export const sendClientEmail = async (data: any) => {
    await sendEmailClient(data.email, 'Bienvenido :)', emailTextClient(data))
}