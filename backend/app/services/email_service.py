import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional, List
from app.core.config import settings
from app.core.logging import logger


class EmailService:
    def __init__(self):
        self.mock = settings.MOCK_EMAIL
        self.smtp_host = settings.SMTP_HOST
        self.smtp_port = settings.SMTP_PORT
        self.username = settings.SMTP_USERNAME
        self.password = settings.SMTP_PASSWORD
        self.from_email = settings.EMAIL_FROM
        self.notification_recipient = settings.ENQUIRY_NOTIFICATION_EMAIL

    def send_enquiry_notification(
        self,
        reference_id: str,
        name: str,
        mobile: str,
        services: List[str],
        contact_method: str,
        message: Optional[str] = None,
    ) -> bool:
        """Sends an alert email to the business notification address.

        Fails gracefully without raising exceptions.
        """
        subject = f"[Lotus Capital] New Enquiry Received: {reference_id}"
        services_str = ", ".join(services) if services else "None specified"
        clean_msg = message or "No specific message provided"

        body_text = f"""
Hello Lotus Capital Team,

A new customer enquiry has been submitted:

Reference ID: {reference_id}
Customer Name: {name}
Mobile Number: {mobile}
Preferred Contact Method: {contact_method}
Services of Interest: {services_str}
Customer Message: {clean_msg}

Please log into the Lotus Capital Admin Dashboard to review and assign this enquiry.
"""

        body_html = f"""
<!DOCTYPE html>
<html>
<head>
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }}
    .card {{ max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }}
    .header {{ background-color: #0f172a; padding: 20px 24px; color: #ffffff; }}
    .header h2 {{ margin: 0; font-size: 20px; font-weight: 600; }}
    .content {{ padding: 24px; line-height: 1.6; font-size: 14px; }}
    .badge {{ display: inline-block; background-color: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 4px; font-weight: 600; font-size: 12px; }}
    .field {{ margin-bottom: 12px; }}
    .field strong {{ color: #475569; display: inline-block; width: 160px; }}
    .footer {{ background: #f1f5f9; padding: 16px 24px; font-size: 12px; color: #64748b; text-align: center; }}
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2>Lotus Capital — New Customer Enquiry</h2>
    </div>
    <div class="content">
      <div style="margin-bottom: 16px;">
        <span class="badge">{reference_id}</span>
      </div>
      <div class="field"><strong>Customer Name:</strong> {name}</div>
      <div class="field"><strong>Mobile:</strong> {mobile}</div>
      <div class="field"><strong>Contact Method:</strong> {contact_method.title()}</div>
      <div class="field"><strong>Services of Interest:</strong> {services_str}</div>
      <div class="field"><strong>Message:</strong> {clean_msg}</div>
    </div>
    <div class="footer">
      Lotus Capital — Financial Services, Godhra, Gujarat, India.
    </div>
  </div>
</body>
</html>
"""

        if self.mock or not self.username or not self.notification_recipient:
            logger.info(
                f"[MOCK EMAIL] Enquiry notification for {reference_id} to {self.notification_recipient}:\n{body_text}"
            )
            return True

        try:
            msg = MIMEMultipart("alternative")
            msg["From"] = self.from_email
            msg["To"] = self.notification_recipient
            msg["Subject"] = subject
            msg.attach(MIMEText(body_text, "plain"))
            msg.attach(MIMEText(body_html, "html"))

            with smtplib.SMTP(self.smtp_host, self.smtp_port, timeout=10) as server:
                server.starttls()
                server.login(self.username, self.password)
                server.send_message(msg)

            logger.info(f"Enquiry notification email sent successfully for {reference_id}")
            return True
        except Exception as e:
            logger.error(f"Failed to send enquiry notification email for {reference_id}: {str(e)}")
            return False

    def send_customer_acknowledgement(
        self,
        to_email: str,
        customer_name: str,
        reference_id: str,
    ) -> bool:
        """Optional acknowledgement email to the customer if an email was provided."""
        if not to_email:
            return False

        subject = f"Enquiry Received — Lotus Capital (Ref: {reference_id})"
        body_text = f"""
Dear {customer_name},

Thank you for reaching out to Lotus Capital, Godhra.

We have received your enquiry with Reference ID: {reference_id}.
Our team will review your requirements and reach out to you shortly.

Disclaimer: Mutual Fund investments are subject to market risks, read all scheme related documents carefully.

Warm regards,
Lotus Capital
Godhra, Gujarat, India
"""

        body_html = f"""
<!DOCTYPE html>
<html>
<head>
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }}
    .card {{ max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e2e8f0; overflow: hidden; }}
    .header {{ background-color: #0f172a; padding: 20px 24px; color: #ffffff; }}
    .header h2 {{ margin: 0; font-size: 20px; font-weight: 600; }}
    .content {{ padding: 24px; line-height: 1.6; font-size: 14px; }}
    .disclaimer {{ background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; font-size: 12px; color: #92400e; margin: 16px 0; }}
    .footer {{ background: #f1f5f9; padding: 16px 24px; font-size: 12px; color: #64748b; text-align: center; }}
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2>Lotus Capital</h2>
    </div>
    <div class="content">
      <p>Dear <strong>{customer_name}</strong>,</p>
      <p>Thank you for reaching out to Lotus Capital. We have received your consultation enquiry under reference <strong>{reference_id}</strong>.</p>
      <p>Our advisor in Godhra will review your requirements and contact you via your preferred communication channel.</p>
      <div class="disclaimer">
        <strong>Regulatory Notice:</strong> Mutual Fund investments are subject to market risks, read all scheme related documents carefully. Lotus Capital does not guarantee returns on any financial instruments.
      </div>
      <p>Warm regards,<br><strong>Lotus Capital Team</strong><br>Godhra, Gujarat, India</p>
    </div>
    <div class="footer">
      Lotus Capital • Godhra, Gujarat, India
    </div>
  </div>
</body>
</html>
"""

        if self.mock or not self.username:
            logger.info(f"[MOCK EMAIL] Customer acknowledgement to {to_email} for {reference_id}")
            return True

        try:
            msg = MIMEMultipart("alternative")
            msg["From"] = self.from_email
            msg["To"] = to_email
            msg["Subject"] = subject
            msg.attach(MIMEText(body_text, "plain"))
            msg.attach(MIMEText(body_html, "html"))

            with smtplib.SMTP(self.smtp_host, self.smtp_port, timeout=10) as server:
                server.starttls()
                server.login(self.username, self.password)
                server.send_message(msg)

            return True
        except Exception as e:
            logger.error(f"Failed to send customer acknowledgement to {to_email}: {str(e)}")
            return False


email_service = EmailService()
