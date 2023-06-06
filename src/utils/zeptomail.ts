import logger from "../logger";

var { SendMailClient } = require("zeptomail");

const url = process.env.ZEPTOMAIL_URL;
const token = process.env.ZEPTOMAIL_TOKEN;

let client = new SendMailClient({ url, token });

export async function sendZeptoMail(mailOptions: any) {
  try {
    const res = await client.sendMail({
      bounce_address: process.env.ZEPTOMAIL_BOUNCE_ADDRESS,
      from: {
        address: mailOptions.from,
        name: process.env.ZEPTOMAIL_NAME,
      },
      to: [
        {
          email_address: {
            address: mailOptions.to,
          },
        },
      ],
      subject: mailOptions.subject,
      htmlbody: mailOptions.html,
    });
    logger.log({
      level: "info",
      message: `Sent mail: ${res.message}`,
    });
    return true;
  } catch (error: any) {
    logger.log({
      level: "error",
      message: `Error mail: ${error.message}`,
    });
    return false;
  }
}
