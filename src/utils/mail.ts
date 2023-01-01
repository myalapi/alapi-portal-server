import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

const hostname = "smtp.zoho.in";
const username = "support@alapi.co";
const password = "Support@2022";

export function mailOptions(
  from: String,
  to: String,
  subject: String,
  text: String,
  headers: Object,
  html: String
): Mail.Options {
  return {
    from: from,
    to: to,
    subject: subject,
    text: text,
    html: html,
    headers: headers,
  } as Mail.Options;
}

export async function mail(mailOptions: Mail.Options) {
  const transporter = nodemailer.createTransport({
    host: hostname,
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: username,
      pass: password,
    },
    logger: true,
  });
  const info = await transporter.sendMail(mailOptions);
  console.log(info.response);
}
