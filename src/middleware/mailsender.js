import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendMail = async (to, subject, authCode) => {
  const googleTransport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: process.env.GOOLE_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: process.env.GOOGLE_ACCESS_TOKEN,
        expires: 3600,
      },
    }),
    mailOptions = {
      from: `Title Academy ${process.env.GOOLE_USER}`,
      to,
      subject,
      //TODO:html 문구수정(도메인 주소 수정)
      html: `<p>Please click on the following link</p>
       <p><a href="http://ec2-15-165-191-71.ap-northeast-2.compute.amazonaws.com/verify?authCode=${authCode}">http://ec2-15-165-191-71.ap-northeast-2.compute.amazonaws.com/verify?authCode=${authCode}</a></p>`,
    };

  try {
    await googleTransport.sendMail(mailOptions);

    googleTransport.close();
    console.log(`mail have sent to ${to}`);
  } catch (error) {
    console.error(error);
  }
};
