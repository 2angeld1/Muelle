interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendMail = async ({ to, subject, html }: SendMailOptions) => {
  try {
    const apiKey = process.env.SMTP_PASS; // Utilizamos la llave proporcionada
    const senderEmail = process.env.SMTP_FROM || 'no-reply@nexoexport.com';

    if (!apiKey) {
      throw new Error('API Key de Brevo no encontrada (SMTP_PASS)');
    }

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        sender: { name: 'NexoExport', email: senderEmail },
        to: [{ email: to }],
        subject: subject,
        htmlContent: html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Brevo API Error:', data);
      throw new Error(data.message || 'Error al enviar correo con Brevo API');
    }

    console.log('Message sent via Brevo API:', data.messageId);
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};
