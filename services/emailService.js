import nodemailer from 'nodemailer';
export async function notifyContact(request) {
  if (!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)) return { sent: false, reason: 'SMTP no configurado' };
  const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 587), secure: Number(process.env.SMTP_PORT) === 465, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
  await transporter.sendMail({ from: `PromptWorks <${process.env.SMTP_USER}>`, to: process.env.CONTACT_NOTIFICATION_EMAIL || process.env.OWNER_EMAIL, replyTo: request.email, subject: `Nueva solicitud: ${request.projectType}`, text: `${request.name} (${request.email})\nEmpresa: ${request.company || 'No indicada'}\nPresupuesto: ${request.budget || 'No indicado'}\n\n${request.description}` });
  return { sent: true };
}
