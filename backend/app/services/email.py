import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Dict, Any
from ..core.config import settings

logger = logging.getLogger("lotus_capital.notifications")

def send_enquiry_notification_email(enquiry_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Sends an email notification to the Lotus Capital proprietor when a new
    lead/enquiry is submitted on the website.

    If SMTP_HOST is not configured (e.g. during local testing or in sandbox),
    logs the formatted notification to the system logger.
    """
    enquiry_id = enquiry_data.get("enquiry_id", "N/A")
    full_name = enquiry_data.get("full_name", "")
    mobile = enquiry_data.get("mobile", "")
    email = enquiry_data.get("email") or "Not provided"
    service = enquiry_data.get("service", "General Enquiry")
    service_detail = enquiry_data.get("service_detail") or []
    detail_str = ", ".join(service_detail) if service_detail else "General inquiry"
    contact_method = enquiry_data.get("contact_method", "phone")
    message = enquiry_data.get("message") or "No message provided"
    source_path = enquiry_data.get("source_path", "/")

    subject = f"🔔 New Website Enquiry [{enquiry_id}]: {full_name} ({service})"

    plain_body = f"""New Enquiry Received — Lotus Capital

Reference ID: {enquiry_id}
Client Name:  {full_name}
Mobile:       {mobile}
Email:        {email}
Service:      {service}
Categories:   {detail_str}
Contact Via:  {contact_method}
Source Page:  {source_path}

Message:
{message}

---
Lotus Capital — Partnering Wealth Creation
Godhra, Gujarat | Phone: +91 93288 52555
"""

    html_body = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {{ font-family: 'Segoe UI', Arial, sans-serif; background-color: #F3F5F7; margin: 0; padding: 24px; color: #1F2933; }}
    .container {{ max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; border: 1px solid #D7D9DC; overflow: hidden; }}
    .header {{ background-color: #123D67; color: #FFFFFF; padding: 24px; }}
    .header h1 {{ margin: 0; font-size: 20px; font-weight: 600; }}
    .badge {{ display: inline-block; background-color: #E92332; color: #FFFFFF; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 999px; margin-top: 8px; }}
    .content {{ padding: 24px; }}
    .table {{ width: 100%; border-collapse: collapse; margin-top: 16px; margin-bottom: 24px; }}
    .table td {{ padding: 10px 12px; border-bottom: 1px solid #E5E8EB; font-size: 14px; }}
    .table td.label {{ color: #5B6770; font-weight: 600; width: 35%; }}
    .table td.value {{ color: #1F2933; font-weight: 500; }}
    .message-box {{ background-color: #F4F7FA; border-left: 3px solid #123D67; padding: 14px; border-radius: 6px; font-size: 14px; line-height: 1.5; }}
    .footer {{ background-color: #071B30; color: #D7D9DC; padding: 16px 24px; font-size: 12px; text-align: center; }}
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Lotus Capital — New Consultation Lead</h1>
      <span class="badge">Reference ID: {enquiry_id}</span>
    </div>
    <div class="content">
      <p style="margin-top:0; font-size:15px; color:#123D67; font-weight:600;">
        A new financial consultation request was submitted on the website:
      </p>
      <table class="table">
        <tr><td class="label">Client Name:</td><td class="value"><strong>{full_name}</strong></td></tr>
        <tr><td class="label">Mobile Number:</td><td class="value"><a href="tel:{mobile}" style="color:#123D67; text-decoration:none; font-weight:600;">{mobile}</a></td></tr>
        <tr><td class="label">Email Address:</td><td class="value">{email}</td></tr>
        <tr><td class="label">Selected Service:</td><td class="value" style="color:#C81B29; font-weight:600;">{service}</td></tr>
        <tr><td class="label">Categories:</td><td class="value"><strong>{detail_str}</strong></td></tr>
        <tr><td class="label">Preferred Contact:</td><td class="value" style="text-transform:capitalize;">{contact_method}</td></tr>
        <tr><td class="label">Source Route:</td><td class="value"><code>{source_path}</code></td></tr>
      </table>
      <div style="font-size:13px; font-weight:600; color:#5B6770; margin-bottom:6px;">Client Query / Message:</div>
      <div class="message-box">{message}</div>
    </div>
    <div class="footer">
      Lotus Capital • Godhra, Gujarat • +91 93288 52555 • lotuscapitalinfo@gmail.com
    </div>
  </div>
</body>
</html>
"""

    if not settings.SMTP_HOST:
        logger.info(
            f"[EMAIL DISPATCH LOG] To: {settings.NOTIFICATION_EMAIL_TO} | Subject: {subject} | Lead: {full_name} ({mobile})"
        )
        return {
            "status": "success",
            "mode": "logged",
            "recipient": settings.NOTIFICATION_EMAIL_TO,
            "subject": subject
        }

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = settings.NOTIFICATION_EMAIL_FROM
        msg["To"] = settings.NOTIFICATION_EMAIL_TO
        msg.attach(MIMEText(plain_body, "plain", "utf-8"))
        msg.attach(MIMEText(html_body, "html", "utf-8"))

        server = smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10)
        if settings.SMTP_TLS:
            server.starttls()
        if settings.SMTP_USER and settings.SMTP_PASSWORD:
            server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)

        server.sendmail(settings.NOTIFICATION_EMAIL_FROM, [settings.NOTIFICATION_EMAIL_TO], msg.as_string())
        server.quit()
        logger.info(f"Email notification successfully sent for enquiry {enquiry_id}")
        return {"status": "success", "mode": "smtp", "recipient": settings.NOTIFICATION_EMAIL_TO}
    except Exception as exc:
        logger.warning(f"Failed to send SMTP email notification for {enquiry_id}: {exc}")
        return {"status": "error", "error": str(exc), "recipient": settings.NOTIFICATION_EMAIL_TO}

