const nodemailer = require('nodemailer');

// nodemailer ile email göndermek için 3 aşama takip etmemız gerekiyor
const sendEmail = async (options) => {
  // 1) CREATE A TRANSPORTER => createTransport() içerisine birkaç option alır => kullanılacak service - authanticaton etc
  const transporter = nodemailer.createTransport({
    // service: 'Gmail',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_HOST,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // 2) DEFINE THE EMAIL OPTIONS
  const mailOptions = {
    from: 'Efe Karakanlı <zefek10@test.io>',
    to: options.email,
    subject: options.email,
    text: options.message,
  };
  // 3) ACTUALLY SEND EMAIL
  await transporter.sendMail(mailOptions); // this will return a promise so we await it
};

module.exports = sendEmail;
