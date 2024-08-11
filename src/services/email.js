const nodemailer = require('nodemailer');

class EmailManager {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            secure: false, 
            auth: {
                user: "rafaelsantagata11@gmail.com",
                pass: "gxjz pkkw ynyb kirc"
            },
            tls: {
                rejectUnauthorized: false 
            }
        });
    }

    async enviarCorreoCompra(email, first_name, ticket) {
        try {
            const mailOptions = {
                from: "Compra realizada <rafaelsantagata11@gmail.com>",
                to: email,
                subject: 'Confirmación de compra',
                html: `
                    <h1>Confirmación de compra</h1>
                    <p>Gracias por tu compra, ${first_name}!</p>
                    <p>El número de tu orden es: ${ticket}</p>
                `
            };

            await this.transporter.sendMail(mailOptions);
            console.log('Correo de compra enviado exitosamente');
        } catch (error) {
            console.error('Error al enviar el correo electrónico:', error);
        }
    }
}

module.exports = EmailManager;


