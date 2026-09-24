import nodemailer from 'nodemailer'

const escape = (s: unknown) => String(s ?? '').replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

// Returns false (never throws) when SMTP is not configured or sending fails, so inquiries are always saved first.
export async function sendMail(subject: string, rows: [string, unknown][], replyTo?: string) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM, INQUIRY_NOTIFICATION_EMAIL } = process.env
  if (!SMTP_HOST || !SMTP_FROM || !INQUIRY_NOTIFICATION_EMAIL) return false
  try {
    const port = Number(SMTP_PORT || 587)
    const transport = nodemailer.createTransport({ host: SMTP_HOST, port, secure: port === 465, auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASSWORD } : undefined })
    await transport.sendMail({
      from: SMTP_FROM,
      to: INQUIRY_NOTIFICATION_EMAIL,
      replyTo,
      subject,
      text: rows.map(([k, v]) => `${k}: ${v ?? ''}`).join('\n'),
      html: `<table cellpadding="6">${rows.map(([k, v]) => `<tr><th align="left">${escape(k)}</th><td>${escape(v).replace(/\n/g, '<br>')}</td></tr>`).join('')}</table>`,
    })
    return true
  } catch (error) {
    console.error('Inquiry email failed:', (error as Error).message)
    return false
  }
}
