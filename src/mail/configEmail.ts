import dotenv from 'dotenv'

dotenv.config()

export const emailData = {
    user: process.env.USER_EMAIL,
    password: process.env.USER_PASSWORD,
    smtp: process.env.SMTP_SSL
}