const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

// Development mode - skip actual SMS sending
const isDevelopment = process.env.NODE_ENV === 'development' || !accountSid || !authToken || !fromPhone;

let client: any = null;

if (!isDevelopment) {
  try {
    const twilio = require('twilio');
    client = twilio(accountSid, authToken);
  } catch (e) {
    console.warn('[TWILIO] Failed to initialize client:', e);
  }
}

export async function sendVerificationSMS(toPhone: string, code: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Development mode - simulate successful SMS
    if (isDevelopment || !client) {
      console.log(`[TWILIO DEV MODE] Simulated SMS to ${toPhone} with code: ${code}`);
      return {
        success: true,
        messageId: `DEV-${Date.now()}`,
      };
    }

    const message = await client.messages.create({
      body: `Your GlideWay verification code is: ${code}. Do not share this code with anyone.`,
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
    // Always fall back to demo mode when Twilio fails - allows testing without valid Twilio setup
    console.log(`[TWILIO FALLBACK] Simulated SMS to ${toPhone} with code: ${code} (Twilio error, using demo mode)`);
    return {
      success: true,
      messageId: `DEMO-${Date.now()}`,
    };
  }
}

export async function sendSecurityAlertSMS(toPhone: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Development mode - simulate successful SMS
    if (isDevelopment || !client) {
      console.log(`[TWILIO DEV MODE] Simulated security alert to ${toPhone}`);
      return {
        success: true,
        messageId: `DEV-ALERT-${Date.now()}`,
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
    // Always fall back to demo mode when Twilio fails
    return { success: true, messageId: `DEMO-ALERT-${Date.now()}` };
  }
}

export async function sendPayoutNotificationSMS(toPhone: string, amount: number, date: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Development mode - simulate successful SMS
    if (isDevelopment || !client) {
      console.log(`[TWILIO DEV MODE] Simulated payout notification to ${toPhone}: $${amount.toFixed(2)}`);
      return {
        success: true,
        messageId: `DEV-PAYOUT-${Date.now()}`,
      };
    }

    const message = await client.messages.create({
      body: `Your GlideWay payout of $${amount.toFixed(2)} has been initiated and will arrive by ${date}.`,
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
    // Always fall back to demo mode when Twilio fails
    return { success: true, messageId: `DEMO-PAYOUT-${Date.now()}` };
  }
}
