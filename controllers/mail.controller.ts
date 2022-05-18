import nodemailer from 'nodemailer';
import config from 'config';

export const sendMail =async(email:string,subject:string,text:string)=>{
    const {auth_user,auth_password,host,port,secure,service,from_email_address} = config.get('App.mail');
    try {
        const transporter = nodemailer.createTransport({
            host,
            service,
            port,
            secure,
            auth: {
                user: auth_user,
                pass: auth_password,
            },
        });

        await transporter.sendMail({
            from: from_email_address,
            to: email,
            subject,
            text,
        });
    } catch (error) {
        console.log(error, "email not sent");
    }
}