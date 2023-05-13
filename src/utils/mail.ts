import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import logger from "../logger";

const hostname = process.env.ZOHO_HOST;
const username = process.env.ZOHO_MAIL;
const password = process.env.ZOHO_PASSWORD;

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
  logger.log({
    level: "info",
    message: `Sent mail: ${info.response}`,
  });
}
