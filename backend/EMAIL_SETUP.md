# Email Setup Guide for SmartBlood Admin

This guide will help you set up email functionality for the admin forgot password feature.

## Prerequisites

1. A Gmail account (or any SMTP-compatible email service)
2. Python environment with required packages

## Gmail Setup (Recommended)

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification if not already enabled

### Step 2: Generate App Password
1. Go to [App Passwords](https://myaccount.google.com/apppasswords)
2. Select "Mail" as the app
3. Select "Other" as the device and enter "SmartBlood Admin"
4. Copy the generated 16-character password

### Step 3: Set Environment Variables
Create a `.env` file in the backend directory with:

```env
# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=your-16-character-app-password
SENDER_NAME=SmartBlood Admin

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## Alternative Email Services

### Outlook/Hotmail
```env
SMTP_SERVER=smtp-mail.outlook.com
SMTP_PORT=587
SENDER_EMAIL=your-email@outlook.com
SENDER_PASSWORD=your-password
```

### Yahoo Mail
```env
SMTP_SERVER=smtp.mail.yahoo.com
SMTP_PORT=587
SENDER_EMAIL=your-email@yahoo.com
SENDER_PASSWORD=your-app-password
```

## Testing Email Setup

Run the test script to verify your email configuration:

```bash
cd backend
python test_email.py
```

## Features

### Email Templates
- **OTP Email**: Clean, professional HTML template with OTP code
- **Password Reset Email**: Complete reset link with security information
- **Responsive Design**: Works on desktop and mobile devices

### Security Features
- OTP expires in 15 minutes
- Secure password reset process
- Professional email branding
- Clear security warnings

### Email Content
- Professional SmartBlood branding
- Clear instructions for users
- Security warnings and best practices
- Responsive HTML design

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Check your email and password
   - For Gmail, use App Password, not regular password
   - Ensure 2FA is enabled

2. **Connection Refused**
   - Check SMTP server and port
   - Verify firewall settings
   - Try different port (465 for SSL)

3. **Emails Not Received**
   - Check spam/junk folder
   - Verify recipient email address
   - Check email service limits

### Debug Mode
Enable debug logging by setting:
```env
FLASK_DEBUG=True
```

## Production Considerations

1. **Environment Variables**: Use secure environment variable management
2. **Rate Limiting**: Implement rate limiting for forgot password requests
3. **Email Queuing**: Use background task queues for email sending
4. **Monitoring**: Set up email delivery monitoring
5. **Backup SMTP**: Configure backup email service

## Support

If you encounter issues:
1. Check the logs in the Flask application
2. Verify your email configuration
3. Test with the provided test script
4. Check your email service provider's documentation


