import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !fromPhone) {
  console.warn('[TWILIO] Missing environment variables');
}

const client = twilio(accountSid, authToken);

export async function sendVerificationSMS(toPhone: string, code: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (!accountSid || !authToken || !fromPhone) {
      return {
        success: false,
        error: 'Twilio credentials not configured'
      };
    }

    const message = await client.messages.create({
      body: `Your Glideway verification code is: ${code}. Do not share this code with anyone.`,
      from: fromPhone,
      to: toPhone,
    });

    console.log(`[TWILIO SMS] Successfully sent to ${toPhone}, Message ID: ${message.sid}`);
    
    return {
      success: true,
      messageId: message.sid,
    };
  } catch (error) {
    console.error('[TWILIO SMS ERROR]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send SMS',
    };
  }
}

export async function sendSecurityAlertSMS(toPhone: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (!accountSid || !authToken || !fromPhone) {
      return {
        success: false,
        error: 'Twilio credentials not configured'
      };
    }

    const smsMessage = await client.messages.create({
      body: message,
      from: fromPhone,
      to: toPhone,
    });

    console.log(`[TWILIO SECURITY ALERT] Sent to ${toPhone}, Message ID: ${smsMessage.sid}`);
    
    return {
      success: true,
      messageId: smsMessage.sid,
    };
  } catch (error) {
    console.error('[TWILIO SECURITY ALERT ERROR]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send security alert',
    };
  }
}

export async function sendPayoutNotificationSMS(toPhone: string, amount: number, date: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    if (!accountSid || !authToken || !fromPhone) {
      return {
        success: false,
        error: 'Twilio credentials not configured'
      };
    }

    const message = await client.messages.create({
      body: `Your Glideway payout of $${amount.toFixed(2)} has been initiated and will arrive by ${date}.`,
      from: fromPhone,
      to: toPhone,
    });

    console.log(`[TWILIO PAYOUT] Sent to ${toPhone}, Message ID: ${message.sid}`);
    
    return {
      success: true,
      messageId: message.sid,
    };
  } catch (error) {
    console.error('[TWILIO PAYOUT ERROR]', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send payout notification',
    };
  }
}
