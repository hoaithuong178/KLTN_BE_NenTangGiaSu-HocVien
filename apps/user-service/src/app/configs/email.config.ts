import nodemailer from 'nodemailer';
import Email from 'email-templates';
import path from 'path';

const { GMAIL_USER, GMAIL_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASSWORD,
  },
});

const dirname = `${__dirname}/assets`;

console.log(dirname);

const emailTemplates = async (
  template: string,
  receiver: string,
  subject: string,
  locals: any
) => {
  try {
    const email = new Email({
      message: {
        from: `Admin <${GMAIL_USER}>`,
        subject,
      },
      send: true,
      preview: false,
      transport: transporter,
      views: {
        options: {
          extension: 'ejs',
        },
      },
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(dirname, 'templates'),
        },
      },
    });

    await email.send({
      template: path.join(dirname, 'templates', 'emails', template),
      message: { to: receiver },
      locals,
    });
  } catch (error) {
    console.log(error);
  }
};

const sendEmail = async ({
  receiver,
  locals,
  subject,
  template,
}: {
  receiver: string;
  locals: any;
  subject: string;
  template: string;
}) => {
  await emailTemplates(template, receiver, subject, locals);
};

export default sendEmail;
