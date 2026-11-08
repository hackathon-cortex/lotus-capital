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
        """
        Sends an alert email to the business notification address.
        Fails gracefully without raising exceptions so enquiry submission is never blocked.
        """
        subject = f"[Lotus Capital] New Enquiry Received: {reference_id}"
        body_text = f"""
Hello Lotus Capital Team,

A new customer enquiry has been submitted:

Reference ID: {reference_id}
Customer Name: {name}
Mobile Number: {mobile}
Preferred Contact Method: {contact_method}
Services of Interest: {', '.join(services) if services else 'None specified'}
Customer Message: {message or 'No specific message provided'}

Please log into the Lotus Capital Admin Dashboard to review and assign this enquiry.
"""

        if self.mock or not self.username or not self.notification_recipient:
            logger.info(
                f"[MOCK EMAIL] Enquiry notification for {reference_id} to {self.notification_recipient}:\n{body_text}"
            )
            return True

        try:
            msg = MIMEMultipart()
            msg["From"] = self.from_email
            msg["To"] = self.notification_recipient
            msg["Subject"] = subject
            msg.attach(MIMEText(body_text, "plain"))

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
        if self.mock or not self.username:
            logger.info(f"[MOCK EMAIL] Customer acknowledgement to {to_email} for {reference_id}")
            return True

        try:
            msg = MIMEMultipart()
            msg["From"] = self.from_email
            msg["To"] = to_email
            msg["Subject"] = subject
            msg.attach(MIMEText(body_text, "plain"))

            with smtplib.SMTP(self.smtp_host, self.smtp_port, timeout=10) as server:
                server.starttls()
                server.login(self.username, self.password)
                server.send_message(msg)

            return True
        except Exception as e:
            logger.error(f"Failed to send customer acknowledgement to {to_email}: {str(e)}")
            return False


email_service = EmailService()

