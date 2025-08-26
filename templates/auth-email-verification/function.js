import { Client, Users } from 'node-appwrite';

/**
 * Email Verification Function Template
 * Sends custom email verification with branded templates
 * 
 * Environment Variables Required:
 * - APPWRITE_API_KEY: Your Appwrite API key
 * - SMTP_HOST: SMTP server host
 * - SMTP_PORT: SMTP server port
 * - SMTP_USER: SMTP username
 * - SMTP_PASS: SMTP password
 * - FROM_EMAIL: Sender email address
 * - BRAND_NAME: Your application name
 */

export default async ({ req, res, log, error }) => {
  try {
    const { userId, email, verificationUrl } = JSON.parse(req.body);

    if (!userId || !email || !verificationUrl) {
      return res.json({
        success: false,
        error: 'Missing required parameters: userId, email, verificationUrl'
      }, 400);
    }

    // Initialize Appwrite client
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
      .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const users = new Users(client);

    // Get user details
    const user = await users.get(userId);
    
    // Create branded email template
    const emailTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset=\"utf-8\">
        <title>Verify Your Email - ${process.env.BRAND_NAME || 'Your App'}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class=\"container\">
          <div class=\"header\">
            <h1>${process.env.BRAND_NAME || 'Your App'}</h1>
            <p>Welcome aboard! Let's verify your email address.</p>
          </div>
          <div class=\"content\">
            <h2>Hi ${user.name || 'there'}!</h2>
            <p>Thanks for signing up! To complete your registration and start using ${process.env.BRAND_NAME || 'our app'}, please verify your email address by clicking the button below:</p>
            
            <div style=\"text-align: center;\">
              <a href=\"${verificationUrl}\" class=\"button\">Verify Email Address</a>
            </div>
            
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style=\"word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;\">${verificationUrl}</p>
            
            <p><strong>This link will expire in 24 hours for security reasons.</strong></p>
            
            <p>If you didn't create an account with us, please ignore this email.</p>
          </div>
          <div class=\"footer\">
            <p>© ${new Date().getFullYear()} ${process.env.BRAND_NAME || 'Your App'}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email using your preferred email service
    // This example uses a generic SMTP approach
    const nodemailer = require('nodemailer');
    
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: `\"${process.env.BRAND_NAME || 'Your App'}\" <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: `Verify your email address - ${process.env.BRAND_NAME || 'Your App'}`,
      html: emailTemplate
    });

    log(`Verification email sent to ${email} for user ${userId}`);

    return res.json({
      success: true,
      message: 'Verification email sent successfully',
      userId: userId,
      email: email
    });

  } catch (err) {
    error(`Failed to send verification email: ${err.message}`);
    
    return res.json({
      success: false,
      error: err.message
    }, 500);
  }
};