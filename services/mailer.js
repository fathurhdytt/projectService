
const nodemailer = require('nodemailer');

// Inisialisasi SMTP transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.mailersend.net',
    port: 587,
    secure: false, // true untuk menggunakan TLS
    auth: {
        user: 'MS_z3zlqF@trial-z3m5jgry1wz4dpyo.mlsender.net',
        pass: 'WUqLubq61R7rUnzE'
    }
});

// Fungsi untuk mengirim email
const sendEmail = async (to,subject,text) => {
    try {
        // Konfigurasi email
        const mailOptions = {
            from: 'MS_z3zlqF@trial-z3m5jgry1wz4dpyo.mlsender.net',
            to: to,
            subject: subject,
            text: text
        };

        // Mengirim email
        await transporter.sendMail(mailOptions);

        console.log('Email berhasil dikirim!');
        return { success: true, message: 'Email berhasil dikirim!' };
    } catch (error) {
        console.error('Gagal mengirim email:', error);
        return { success: false, message: 'Gagal mengirim email.' };
    }
};

module.exports = {sendEmail};