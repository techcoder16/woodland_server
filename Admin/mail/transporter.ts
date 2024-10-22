import { createTransport } from "nodemailer";

import nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: process.env.NODE_MAILER_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.NODE_MAILER_EMAIL,
      pass:  process.env.NODE_MAILER_PASS,
    },
  });

  
  transporter.verify((error,success)=>{

    if (error){
        console.log(error);
    }
    else
    {

        console.log("Mail Server is running!")

    }
  });
// NODE_MAILER_PASS = "wqrk hyua gstx vcqv"
// NODE_MAILER_EMAIL = "abbasi.work22@gmail.com"
// NODE_MAILER_HOST = "smtp.gmail.com"

module.exports = transporter

export function sendMail(mainOptions: { from: string; to: any; subject: string; html: any; }) {
    throw new Error("Function not implemented.");
}
