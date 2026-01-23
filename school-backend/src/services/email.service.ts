import * as brevo from "@getbrevo/brevo";
import { getResetPasswordEmailTemplate } from "../templates/reset-password.js";
import { getWelcomeEmailTemplate } from "../templates/welcome-email.js";

class EmailService {
  private getApiInstance() {
    const apiKey = process.env.BREVO_API_KEY?.trim();
    if (!apiKey) {
      return null;
    }
    const apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey);
    return apiInstance;
  }

  async sendWelcomeEmail(toEmail: string, userName: string) {
    const apiInstance = this.getApiInstance();
    if (!apiInstance) {
      return;
    }

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    const loginUrl = process.env.FRONTEND_URL || "https://student-management-application-y4fd.onrender.com/login";
    const senderEmail = (process.env.BREVO_SENDER_EMAIL || "no-reply@school.com").trim();
    const senderName = process.env.BREVO_SENDER_NAME || "School Support";

    sendSmtpEmail.subject = "Welcome to School Management System!";
    sendSmtpEmail.htmlContent = getWelcomeEmailTemplate(userName, loginUrl);
    sendSmtpEmail.sender = {
      name: senderName,
      email: senderEmail,
    };
    sendSmtpEmail.to = [{ email: toEmail, name: userName }];

    try {
      await apiInstance.sendTransacEmail(sendSmtpEmail);
    } catch (error) {
      console.error("Error sending welcome email:", error);
    }
  }

  async sendResetPasswordEmail(
    toEmail: string,
    userName: string,
    resetUrl: string
  ) {
    const apiInstance = this.getApiInstance();
    if (!apiInstance) {
      return;
    }

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    const senderEmail = (process.env.BREVO_SENDER_EMAIL || "no-reply@school.com").trim();
    const senderName = process.env.BREVO_SENDER_NAME || "School Support";

    sendSmtpEmail.subject = "Reset Your Password - School Management System";
    sendSmtpEmail.htmlContent = getResetPasswordEmailTemplate(
      resetUrl,
      userName
    );
    sendSmtpEmail.sender = {
      name: senderName,
      email: senderEmail,
    };
    sendSmtpEmail.to = [{ email: toEmail, name: userName }];

    try {
      const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log(`Reset password email sent to ${toEmail}. MessageId: ${data.body.messageId}`);
    } catch (error) {
      console.error("Error sending reset password email:", error);
      console.log("Email sending failed. Here is the reset URL for local testing:");
      console.log(resetUrl);
    }
  }
}

export default new EmailService();
