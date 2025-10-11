import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import current_app
import os
from datetime import datetime, timedelta
from app.config.email_config import EmailConfig

class EmailService:
    def __init__(self):
        self.smtp_server = EmailConfig.SMTP_SERVER
        self.smtp_port = EmailConfig.SMTP_PORT
        self.sender_email = EmailConfig.SENDER_EMAIL
        self.sender_password = EmailConfig.SENDER_PASSWORD
        self.sender_name = EmailConfig.SENDER_NAME

    def send_password_reset_email(self, recipient_email, reset_token, user_name="Admin"):
        """Send password reset email with reset link"""
        try:
            # Create reset link
            reset_link = f"{current_app.config.get('FRONTEND_URL', 'http://localhost:3000')}/admin/reset-password?token={reset_token}"
            
            # Create email content
            subject = "Password Reset Request - SmartBlood Admin"
            
            html_content = self._create_password_reset_html(user_name, reset_link)
            text_content = self._create_password_reset_text(user_name, reset_link)
            
            # Create message
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = f"{self.sender_name} <{self.sender_email}>"
            message["To"] = recipient_email
            
            # Add both text and HTML parts
            text_part = MIMEText(text_content, "plain")
            html_part = MIMEText(html_content, "html")
            
            message.attach(text_part)
            message.attach(html_part)
            
            # Send email
            context = ssl.create_default_context()
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls(context=context)
                server.login(self.sender_email, self.sender_password)
                server.sendmail(self.sender_email, recipient_email, message.as_string())
            
            current_app.logger.info(f"Password reset email sent to {recipient_email}")
            return True
            
        except Exception as e:
            current_app.logger.error(f"Failed to send password reset email to {recipient_email}: {str(e)}")
            return False

    def _create_password_reset_html(self, user_name, reset_link):
        """Create HTML email template for password reset"""
        return f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset - SmartBlood Admin</title>
            <style>
                body {{
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f4f4f4;
                }}
                .container {{
                    background-color: #ffffff;
                    border-radius: 10px;
                    padding: 30px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }}
                .header {{
                    text-align: center;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid #e74c3c;
                }}
                .logo {{
                    font-size: 28px;
                    font-weight: bold;
                    color: #e74c3c;
                    margin-bottom: 10px;
                }}
                .subtitle {{
                    color: #666;
                    font-size: 14px;
                }}
                .content {{
                    margin-bottom: 30px;
                }}
                .reset-button {{
                    display: inline-block;
                    background-color: #e74c3c;
                    color: white;
                    padding: 15px 30px;
                    text-decoration: none;
                    border-radius: 5px;
                    font-weight: bold;
                    text-align: center;
                    margin: 20px 0;
                    transition: background-color 0.3s;
                }}
                .reset-button:hover {{
                    background-color: #c0392b;
                }}
                .reset-link {{
                    word-break: break-all;
                    background-color: #f8f9fa;
                    padding: 10px;
                    border-radius: 5px;
                    font-family: monospace;
                    font-size: 12px;
                    margin: 15px 0;
                }}
                .footer {{
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                    font-size: 12px;
                    color: #666;
                    text-align: center;
                }}
                .warning {{
                    background-color: #fff3cd;
                    border: 1px solid #ffeaa7;
                    color: #856404;
                    padding: 15px;
                    border-radius: 5px;
                    margin: 20px 0;
                }}
                .info {{
                    background-color: #d1ecf1;
                    border: 1px solid #bee5eb;
                    color: #0c5460;
                    padding: 15px;
                    border-radius: 5px;
                    margin: 20px 0;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">🩸 SmartBlood Admin</div>
                    <div class="subtitle">Kerala's Blood Donation Network</div>
                </div>
                
                <div class="content">
                    <h2>Password Reset Request</h2>
                    <p>Hello {user_name},</p>
                    
                    <p>We received a request to reset your password for your SmartBlood Admin account. If you made this request, please click the button below to reset your password:</p>
                    
                    <div style="text-align: center;">
                        <a href="{reset_link}" class="reset-button">Reset My Password</a>
                    </div>
                    
                    <div class="info">
                        <strong>Alternative Method:</strong> If the button doesn't work, copy and paste the following link into your browser:
                        <div class="reset-link">{reset_link}</div>
                    </div>
                    
                    <div class="warning">
                        <strong>⚠️ Important Security Information:</strong>
                        <ul>
                            <li>This link will expire in 15 minutes for security reasons</li>
                            <li>If you didn't request this password reset, please ignore this email</li>
                            <li>Your password will not be changed until you click the link above</li>
                        </ul>
                    </div>
                    
                    <p>If you have any questions or need assistance, please contact our support team.</p>
                </div>
                
                <div class="footer">
                    <p>This email was sent from SmartBlood Admin Panel</p>
                    <p>© 2024 SmartBlood. All rights reserved.</p>
                    <p>Kerala, India</p>
                </div>
            </div>
        </body>
        </html>
        """

    def _create_password_reset_text(self, user_name, reset_link):
        """Create plain text email template for password reset"""
        return f"""
Password Reset Request - SmartBlood Admin

Hello {user_name},

We received a request to reset your password for your SmartBlood Admin account. If you made this request, please use the following link to reset your password:

{reset_link}

IMPORTANT SECURITY INFORMATION:
- This link will expire in 15 minutes for security reasons
- If you didn't request this password reset, please ignore this email
- Your password will not be changed until you click the link above

If you have any questions or need assistance, please contact our support team.

This email was sent from SmartBlood Admin Panel
© 2024 SmartBlood. All rights reserved.
Kerala, India
        """

    def send_otp_email(self, recipient_email, otp, user_name="Admin"):
        """Send OTP via email for password reset"""
        try:
            subject = "Password Reset OTP - SmartBlood Admin"
            
            html_content = self._create_otp_html(user_name, otp)
            text_content = self._create_otp_text(user_name, otp)
            
            # Create message
            message = MIMEMultipart("alternative")
            message["Subject"] = subject
            message["From"] = f"{self.sender_name} <{self.sender_email}>"
            message["To"] = recipient_email
            
            # Add both text and HTML parts
            text_part = MIMEText(text_content, "plain")
            html_part = MIMEText(html_content, "html")
            
            message.attach(text_part)
            message.attach(html_part)
            
            # Send email
            context = ssl.create_default_context()
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls(context=context)
                server.login(self.sender_email, self.sender_password)
                server.sendmail(self.sender_email, recipient_email, message.as_string())
            
            current_app.logger.info(f"OTP email sent to {recipient_email}")
            return True
            
        except Exception as e:
            current_app.logger.error(f"Failed to send OTP email to {recipient_email}: {str(e)}")
            return False

    def _create_otp_html(self, user_name, otp):
        """Create HTML email template for OTP"""
        return f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset OTP - SmartBlood Admin</title>
            <style>
                body {{
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f4f4f4;
                }}
                .container {{
                    background-color: #ffffff;
                    border-radius: 10px;
                    padding: 30px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }}
                .header {{
                    text-align: center;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid #e74c3c;
                }}
                .logo {{
                    font-size: 28px;
                    font-weight: bold;
                    color: #e74c3c;
                    margin-bottom: 10px;
                }}
                .otp-code {{
                    background-color: #f8f9fa;
                    border: 2px solid #e74c3c;
                    border-radius: 10px;
                    padding: 20px;
                    text-align: center;
                    font-size: 32px;
                    font-weight: bold;
                    color: #e74c3c;
                    letter-spacing: 5px;
                    margin: 20px 0;
                }}
                .warning {{
                    background-color: #fff3cd;
                    border: 1px solid #ffeaa7;
                    color: #856404;
                    padding: 15px;
                    border-radius: 5px;
                    margin: 20px 0;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">🩸 SmartBlood Admin</div>
                </div>
                
                <div class="content">
                    <h2>Password Reset OTP</h2>
                    <p>Hello {user_name},</p>
                    
                    <p>Use the following OTP to reset your password:</p>
                    
                    <div class="otp-code">{otp}</div>
                    
                    <div class="warning">
                        <strong>⚠️ Important:</strong>
                        <ul>
                            <li>This OTP will expire in 15 minutes</li>
                            <li>Do not share this OTP with anyone</li>
                            <li>If you didn't request this, please ignore this email</li>
                        </ul>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """

    def _create_otp_text(self, user_name, otp):
        """Create plain text email template for OTP"""
        return f"""
Password Reset OTP - SmartBlood Admin

Hello {user_name},

Use the following OTP to reset your password:

{otp}

IMPORTANT:
- This OTP will expire in 15 minutes
- Do not share this OTP with anyone
- If you didn't request this, please ignore this email

SmartBlood Admin Panel
        """

# Create global instance
email_service = EmailService()
