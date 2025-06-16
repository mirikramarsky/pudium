const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // או smtp אחר
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

function sendMail(to, subject, html) {
    return transporter.sendMail({
        from: `"Pudium" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
    });
}

module.exports = { sendMail };
