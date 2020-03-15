const nodemailer = require('nodemailer');

const enviarNotificacion = async() => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'lf.elgueta@gmail.com',
                pass: 'INgenier0123#'
            }
        });
    
        const bodyMail = [
            {
            "_id": "5e5f9c3ff127834f0cc52427",
            "Lugar": "Chile",
            "Contagiados": 1,
            "Decesos": 0,
            "Actualizado": "2020-03-04T12:14:39.266Z",
            "__v": 0
            },
            {
            "_id": "5e65a50068df483de8d1b877",
            "Lugar": "Chile",
            "Contagiados": 5,
            "Decesos": 0,
            "Actualizado": "2020-03-09T01:57:52.865Z",
            "__v": 0
            }
        ];

        const mailOptions = {
            from: 'Remitente',
            to: 'lf.elgueta@gmail.com',
            subject: 'Resultado actualización COVID-19',
            text: JSON.stringify(bodyMail)
        };
    
        await transporter.sendMail(mailOptions);
        
    } catch (error) {
        console.log(error);
    }
}

enviarNotificacion();