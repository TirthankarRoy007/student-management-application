import * as brevo from "@getbrevo/brevo";
import { getResetPasswordEmailTemplate } from "../templates/reset-password.js";

class EmailService {
  private apiInstance: brevo.TransactionalEmailsApi;

  constructor() {
    this.apiInstance = new brevo.TransactionalEmailsApi();
    // Configure API key authorization: apiKey
    if (process.env.BREVO_API_KEY) {
      this.apiInstance.setApiKey(
        brevo.TransactionalEmailsApiApiKeys.apiKey,
        process.env.BREVO_API_KEY
      );
    } else {
      console.warn("⚠️ BREVO_API_KEY is not set. Emails will not be sent.");
    }
  }

  async sendResetPasswordEmail(
    toEmail: string,
    userName: string,
    resetUrl: string
  ) {
    if (!process.env.BREVO_API_KEY) {
      console.warn("Skipping email send: Missing BREVO_API_KEY");
      return;
    }

    const sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = "Reset Your Password - School Management System";
    sendSmtpEmail.htmlContent = getResetPasswordEmailTemplate(
      resetUrl,
      userName
    );
    sendSmtpEmail.sender = {
      name: process.env.BREVO_SENDER_NAME || "School Support",
      email: process.env.BREVO_SENDER_EMAIL || "no-reply@school.com",
    };
    sendSmtpEmail.to = [{ email: toEmail, name: userName }];

    try {
      const data = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log(`📧 Reset password email sent to ${toEmail}. MessageId: ${data.body.messageId}`);
    } catch (error) {
      console.error("❌ Error sending reset password email:", error);
      console.log("⚠️  Email sending failed. Here is the reset URL for local testing:");
      console.log(resetUrl);
      // Suppress error for local dev so we can still test the flow
      // throw new Error("Failed to send email"); 
    }
  }
}

export default new EmailService();
