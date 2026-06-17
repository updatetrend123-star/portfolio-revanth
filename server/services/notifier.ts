import nodemailer from 'nodemailer';

interface NotificationPayload {
  id?: string;
  name: string;
  email: string;
  message: string;
}

export async function alertNewMessage(payload: NotificationPayload) {
  const targetEmail = process.env.NOTIFICATION_EMAIL || 'updatetrend123@gmail.com';
  const { id, name, email, message } = payload;

  console.log(`\n============== [CLOUD TRIGGER ACTIVATED] ==============`);
  console.log(`Event Type: providers/cloud.firestore/eventTypes/document.create`);
  console.log(`Resource: databases/default/documents/messages/${id || 'new_doc'}`);
  console.log(`Sender: ${name} <${email}>`);
  console.log(`Message Body: "${message}"`);
  console.log(`=======================================================\n`);

  // Build high-polish HTML template for the email
  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #0d1213; color: #f5f5dc; border-radius: 24px; border: 1px solid rgba(255,255,255,0.05);">
      <div style="text-align: center; margin-bottom: 40px;">
        <div style="display: inline-block; width: 64px; height: 64px; border-radius: 20px; background-color: #a7aa63; color: #0d1213; text-align: center; line-height: 64px; font-size: 28px; font-weight: 900; margin-bottom: 16px; box-shadow: 0 10px 30px rgba(167,170,99,0.3);">
          ✉
        </div>
        <h1 style="font-size: 24px; font-weight: 900; margin: 0; color: #a7aa63; text-transform: uppercase; letter-spacing: 2px;">New Contact Payload</h1>
        <p style="font-size: 14px; color: rgba(245,245,220,0.4); margin: 8px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">Nexus Trigger Node</p>
      </div>

      <div style="background-color: rgba(255,255,255,0.02); border-radius: 16px; padding: 24px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 30px;">
        <div style="margin-bottom: 20px;">
          <span style="font-size: 10px; font-weight: 900; color: #a7aa63; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 6px;">Sender Identity</span>
          <span style="font-size: 18px; font-weight: 700; color: #f5f5dc;">${name}</span>
        </div>
        
        <div style="margin-bottom: 20px;">
          <span style="font-size: 10px; font-weight: 900; color: #a7aa63; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 6px;">Digital Mail</span>
          <span style="font-size: 16px; font-weight: 500; color: rgba(245,245,220,0.8);">${email}</span>
        </div>

        <div>
          <span style="font-size: 10px; font-weight: 900; color: #a7aa63; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 6px;">The Message</span>
          <div style="font-size: 15px; line-height: 1.6; color: rgba(245,245,220,0.7); background-color: rgba(0,0,0,0.2); padding: 16px; border-radius: 12px; white-space: pre-wrap; border: 1px solid rgba(255,255,255,0.02);">${message}</div>
        </div>
      </div>

      <div style="text-align: center; font-size: 11px; color: rgba(245,245,220,0.2); border-top: 1px solid rgba(255,255,255,0.05); padding-top: 24px;">
        Firestore Message Ref ID: <code style="font-family: monospace; color: #a7aa63; background-color: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px;">${id || 'N/A'}</code>
        <br style="margin-bottom: 8px;" />
        System auto-dispatched alerts from Cloud Run Environment.
      </div>
    </div>
  `;

  // Check if SMTP is configured
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = parseInt(process.env.SMTP_PORT || '587');

  if (smtpUser && smtpPass) {
    console.log(`[SMTP] Credentials detected. Initializing transporter for ${smtpHost}:${smtpPort}`);
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      const info = await transporter.sendMail({
        from: `"Portfolio Nexus" <${smtpUser}>`,
        to: targetEmail,
        subject: `⚠️ [Portfolio Nexus] New Contact Message from ${name}`,
        text: `New Contact Submission from:\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\nDocument Ref: ${id || 'N/A'}`,
        html: htmlContent
      });

      console.log(`[SMTP] Email sent successfully! MessageId: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('[SMTP] Critical Error sending email via SMTP:', error);
      return { success: false, error: String(error) };
    }
  } else {
    console.log(`[SMTP] Credentials info not set. Gracefully bypassing real SMTP transmission.`);
    console.log(`[SMTP] Formatted notification payload logged above successfully.`);
    return { success: true, simulated: true };
  }
}
