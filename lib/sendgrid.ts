import sgMail from '@sendgrid/mail';

const apiKey = process.env.SENDGRID_API_KEY;
const fromEmail = process.env.SENDGRID_FROM_EMAIL;

if (apiKey) {
  sgMail.setApiKey(apiKey);
} else {
  console.warn('[SENDGRID] API key not configured');
}

export async function sendVerificationEmail(toEmail: string, firstName: string, code: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (!apiKey || !fromEmail) {
      return {
        success: false,
        error: 'SendGrid credentials not configured'
      };
    }

    const msg = {
      to: toEmail,
      from: fromEmail,
      subject: 'Verify Your Glideway Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Glideway, ${firstName}!</h2>
          <p>Thank you for signing up. Your verification code is:</p>
          <div style="background-color: #f0f0f0; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="letter-spacing: 5px; margin: 0; color: #333;">${code}</h1>
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p style="color: #666; font-size: 12px;">If you did not request this code, please ignore this email.</p>
        </div>
      `,
    };

    const response = await sgMail.send(msg);
    console.log(`[SENDGRID] Verification email sent to ${toEmail}, Message ID: ${response[0].headers['x-message-id']}`);
    
    return {
      success: true,
      messageId: response[0].headers['x-message-id'],
    };
  } catch (error) {
    console.error('[SENDGRID EMAIL ERROR]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

export async function sendPaymentAlertEmail(toEmail: string, firstName: string, amount: number, recipientName: string, timestamp: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (!apiKey || !fromEmail) {
      return {
        success: false,
        error: 'SendGrid credentials not configured'
      };
    }

    const msg = {
      to: toEmail,
      from: fromEmail,
      subject: 'Payment Sent Successfully',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Payment Confirmation</h2>
          <p>Hi ${firstName},</p>
          <p>Your payment has been sent successfully!</p>
          <div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Amount:</strong> $${amount.toFixed(2)}</p>
            <p><strong>Recipient:</strong> ${recipientName}</p>
            <p><strong>Time:</strong> ${timestamp}</p>
          </div>
          <p>Thank you for using Glideway!</p>
        </div>
      `,
    };

    const response = await sgMail.send(msg);
    console.log(`[SENDGRID] Payment alert sent to ${toEmail}`);
    
    return {
      success: true,
      messageId: response[0].headers['x-message-id'],
    };
  } catch (error) {
    console.error('[SENDGRID PAYMENT ALERT ERROR]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send payment alert',
    };
  }
}

export async function sendSettlementCompleteEmail(toEmail: string, firstName: string, amount: number, settlementDate: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (!apiKey || !fromEmail) {
      return {
        success: false,
        error: 'SendGrid credentials not configured'
      };
    }

    const msg = {
      to: toEmail,
      from: fromEmail,
      subject: 'Settlement Complete',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Settlement Complete</h2>
          <p>Hi ${firstName},</p>
          <p>Your payment settlement has been completed!</p>
          <div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Settlement Amount:</strong> $${amount.toFixed(2)}</p>
            <p><strong>Settlement Date:</strong> ${settlementDate}</p>
          </div>
          <p>The funds will be transferred to your account according to your payout schedule.</p>
        </div>
      `,
    };

    const response = await sgMail.send(msg);
    console.log(`[SENDGRID] Settlement email sent to ${toEmail}`);
    
    return {
      success: true,
      messageId: response[0].headers['x-message-id'],
    };
  } catch (error) {
    console.error('[SENDGRID SETTLEMENT ERROR]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send settlement email',
    };
  }
}

export async function sendPayoutNotificationEmail(toEmail: string, firstName: string, amount: number, payoutDate: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (!apiKey || !fromEmail) {
      return {
        success: false,
        error: 'SendGrid credentials not configured'
      };
    }

    const msg = {
      to: toEmail,
      from: fromEmail,
      subject: 'Payout Notification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Payout Initiated</h2>
          <p>Hi ${firstName},</p>
          <p>Your payout has been initiated!</p>
          <div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Payout Amount:</strong> $${amount.toFixed(2)}</p>
            <p><strong>Expected Arrival:</strong> ${payoutDate}</p>
          </div>
          <p>You will receive another confirmation when the funds arrive in your account.</p>
        </div>
      `,
    };

    const response = await sgMail.send(msg);
    console.log(`[SENDGRID] Payout notification sent to ${toEmail}`);
    
    return {
      success: true,
      messageId: response[0].headers['x-message-id'],
    };
  } catch (error) {
    console.error('[SENDGRID PAYOUT ERROR]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send payout notification',
    };
  }
}

export async function sendSecurityAlertEmail(toEmail: string, firstName: string, alertType: string, timestamp: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (!apiKey || !fromEmail) {
      return {
        success: false,
        error: 'SendGrid credentials not configured'
      };
    }

    const msg = {
      to: toEmail,
      from: fromEmail,
      subject: '⚠️ Security Alert - Glideway Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d32f2f;">⚠️ Security Alert</h2>
          <p>Hi ${firstName},</p>
          <p>We detected unusual activity on your Glideway account:</p>
          <div style="background-color: #ffebee; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d32f2f;">
            <p><strong>Alert Type:</strong> ${alertType}</p>
            <p><strong>Time:</strong> ${timestamp}</p>
          </div>
          <p>If this was you, you can ignore this message. If you did not authorize this activity, please secure your account immediately.</p>
          <p style="color: #666; font-size: 12px;">Never share your password or verification codes with anyone.</p>
        </div>
      `,
    };

    const response = await sgMail.send(msg);
    console.log(`[SENDGRID] Security alert sent to ${toEmail}`);
    
    return {
      success: true,
      messageId: response[0].headers['x-message-id'],
    };
  } catch (error) {
    console.error('[SENDGRID SECURITY ALERT ERROR]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send security alert',
    };
  }
}
