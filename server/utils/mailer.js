const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // או smtp אחר
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});
 console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Exists" : "Missing");

// function sendMail(to, subject, html) {
//     return transporter.sendMail({
//         from: `"Pudium" <${process.env.EMAIL_USER}>`,
//         to,
//         subject,
//         html
//     });
// // }
    function sendMail(to, subject, html) {
    return transporter.sendMail({
        from: `"Pudium" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
    }).catch(err => {
        console.error("❌ שגיאה בשליחת המייל:", err);
        throw err; // חשוב כדי שהשגיאה תתגלגל הלאה
    });
}



module.exports = { sendMail };
