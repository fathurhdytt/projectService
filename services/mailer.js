const nodemailer = require('nodemailer');

// Inisialisasi SMTP transporter untuk Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'arifhida1647@gmail.com',
        pass: 'zvco cvwa qxak iloo'
    }
});

// Fungsi untuk mengirim email
const sendEmail = async (to, subject, text) => {
    try {
        // Konfigurasi email
        const mailOptions = {
            from: 'arifhida1647@gmail.com',
            to: to,
            subject: subject,
            text: text
        };

        // Mengirim email
        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Email berhasil dikirim!' };
    } catch (error) {
        console.error('Gagal mengirim email:', error);
        return { success: false, message: 'Gagal mengirim email.' };
    }
};

module.exports = { sendEmail };
