// Email Templates for Ekika Experiences

export const emailTemplates = {
  // Booking Confirmation Email
  bookingConfirmation: (booking) => ({
    subject: `Booking Confirmation - ${booking.experience_title}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 300;
            letter-spacing: 1px;
        }
        .content {
            padding: 40px;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
        }
        .section {
            margin: 30px 0;
            padding: 20px;
            background-color: #f9f9f9;
            border-left: 4px solid #667eea;
            border-radius: 4px;
        }
        .section h2 {
            margin-top: 0;
            color: #667eea;
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: 600;
            color: #666;
        }
        .detail-value {
            color: #333;
            text-align: right;
        }
        .price-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 4px;
            text-align: center;
            margin: 20px 0;
        }
        .total-price {
            font-size: 32px;
            font-weight: bold;
            margin: 10px 0;
        }
        .cta-button {
            display: inline-block;
            background-color: #667eea;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: 600;
            margin: 20px 0;
            transition: background-color 0.3s;
        }
        .cta-button:hover {
            background-color: #764ba2;
        }
        .footer {
            background-color: #f4f4f4;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #eee;
        }
        .booking-id {
            background-color: #f0f0f0;
            padding: 10px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 14px;
            word-break: break-all;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Booking Confirmed ✓</h1>
        </div>
        
        <div class="content">
            <div class="greeting">
                Hi ${booking.guest_name},
            </div>
            
            <p>Thank you for booking with us! Your experience is confirmed and we're excited to have you. Here are your booking details:</p>
            
            <div class="section">
                <h2>Experience Details</h2>
                <div class="detail-row">
                    <span class="detail-label">Experience:</span>
                    <span class="detail-value">${booking.experience_title}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">${new Date(booking.preferred_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Guests:</span>
                    <span class="detail-value">${booking.guest_count} ${booking.guest_count === 1 ? 'person' : 'people'}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Price per person:</span>
                    <span class="detail-value">${(booking.unit_price_cents / 100).toFixed(2)} ${booking.currency}</span>
                </div>
            </div>

            <div class="section">
                <h2>Your Information</h2>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${booking.email}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Phone:</span>
                    <span class="detail-value">${booking.phone}</span>
                </div>
                ${booking.special_requests ? `
                <div class="detail-row">
                    <span class="detail-label">Special Requests:</span>
                    <span class="detail-value">${booking.special_requests}</span>
                </div>
                ` : ''}
            </div>

            <div class="price-section">
                <div>Total Amount</div>
                <div class="total-price">${(booking.total_cents / 100).toFixed(2)} ${booking.currency}</div>
                <div style="font-size: 14px; opacity: 0.9;">Payment Status: ${booking.payment_status}</div>
            </div>

            <div class="section">
                <h2>Booking Reference</h2>
                <div class="booking-id">${booking.id}</div>
                <p style="margin-top: 10px; margin-bottom: 0; font-size: 12px; color: #666;">Keep this reference for your records</p>
            </div>

            <center>
                <a href="#" class="cta-button">View Booking Details</a>
            </center>

            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
                If you need to make changes or have any questions, please contact us or reply to this email.
            </p>
        </div>

        <div class="footer">
            <p>&copy; 2026 Ekika Experiences. All rights reserved.</p>
            <p>Questions? <a href="mailto:support@ekika.com" style="color: #667eea; text-decoration: none;">Contact us</a></p>
        </div>
    </div>
</body>
</html>
    `,
  }),

  // Payment Confirmation Email
  paymentConfirmation: (booking, payment) => ({
    subject: `Payment Received - ${booking.experience_title}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 300;
            letter-spacing: 1px;
        }
        .content {
            padding: 40px;
        }
        .success-badge {
            text-align: center;
            font-size: 48px;
            margin-bottom: 20px;
        }
        .section {
            margin: 20px 0;
            padding: 20px;
            background-color: #f9f9f9;
            border-left: 4px solid #11998e;
            border-radius: 4px;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: 600;
            color: #666;
        }
        .detail-value {
            color: #333;
            text-align: right;
        }
        .amount-paid {
            font-size: 24px;
            color: #11998e;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
        }
        .footer {
            background-color: #f4f4f4;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #eee;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Payment Received ✓</h1>
        </div>
        
        <div class="content">
            <div class="success-badge">💳 ✓</div>
            
            <p>Thank you! Your payment has been successfully processed. Here are your payment details:</p>
            
            <div class="section">
                <h2 style="margin-top: 0; color: #11998e;">Payment Details</h2>
                <div class="detail-row">
                    <span class="detail-label">Amount Paid:</span>
                    <span class="detail-value">${(payment.amount_cents / 100).toFixed(2)} ${payment.currency}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Payment Method:</span>
                    <span class="detail-value">${payment.method}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Transaction ID:</span>
                    <span class="detail-value">${payment.provider_reference || payment.id}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">${new Date(payment.created_at).toLocaleDateString()}</span>
                </div>
            </div>

            <div class="section">
                <h2 style="margin-top: 0; color: #11998e;">Booking Information</h2>
                <div class="detail-row">
                    <span class="detail-label">Experience:</span>
                    <span class="detail-value">${booking.experience_title}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Booking Reference:</span>
                    <span class="detail-value">${booking.id}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value" style="color: #11998e; font-weight: 600;">${booking.booking_status.charAt(0).toUpperCase() + booking.booking_status.slice(1)}</span>
                </div>
            </div>

            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
                Your booking is confirmed. We've sent you a separate email with all the experience details.
            </p>
        </div>

        <div class="footer">
            <p>&copy; 2026 Ekika Experiences. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `,
  }),

  // Booking Reminder Email
  bookingReminder: (booking) => ({
    subject: `Reminder: Your experience is coming up! - ${booking.experience_title}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 300;
            letter-spacing: 1px;
        }
        .content {
            padding: 40px;
        }
        .highlight-box {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 20px;
            border-radius: 4px;
            margin: 20px 0;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
        }
        .detail-label {
            font-weight: 600;
            color: #666;
        }
        .detail-value {
            color: #333;
            text-align: right;
        }
        .footer {
            background-color: #f4f4f4;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #eee;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Experience Reminder! 🎉</h1>
        </div>
        
        <div class="content">
            <p>Hi ${booking.guest_name},</p>
            
            <p>We're excited that your experience is coming up! Here are the details:</p>
            
            <div class="highlight-box">
                <h2 style="margin-top: 0; color: #f5576c;">📅 ${booking.experience_title}</h2>
                <div class="detail-row">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value"><strong>${new Date(booking.preferred_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong></span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Guests:</span>
                    <span class="detail-value">${booking.guest_count} ${booking.guest_count === 1 ? 'person' : 'people'}</span>
                </div>
            </div>

            <h3>Important Reminders:</h3>
            <ul style="color: #666;">
                <li>Please arrive 15 minutes early</li>
                <li>Bring a valid ID</li>
                <li>Wear comfortable clothing and appropriate footwear</li>
                <li>Check the weather and bring necessary items</li>
            </ul>

            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                Questions or need to reschedule? <a href="mailto:support@ekika.com" style="color: #f5576c; text-decoration: none;">Contact us</a>
            </p>
        </div>

        <div class="footer">
            <p>&copy; 2026 Ekika Experiences. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `,
  }),

  // Contact Form Confirmation
  contactConfirmation: (inquiry) => ({
    subject: `We received your message - Ekika Experiences`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 300;
        }
        .content {
            padding: 40px;
        }
        .footer {
            background-color: #f4f4f4;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #eee;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Message Received ✓</h1>
        </div>
        
        <div class="content">
            <p>Hi ${inquiry.name},</p>
            
            <p>Thank you for reaching out to us! We've received your message and appreciate you taking the time to contact Ekika Experiences.</p>
            
            <p>Our team will review your inquiry and get back to you as soon as possible, typically within 24 hours.</p>

            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 14px;">
                In the meantime, feel free to browse our <a href="#" style="color: #667eea; text-decoration: none;">available experiences</a> or check out our <a href="#" style="color: #667eea; text-decoration: none;">FAQ</a>.
            </p>
        </div>

        <div class="footer">
            <p>&copy; 2026 Ekika Experiences. All rights reserved.</p>
            <p><a href="mailto:support@ekika.com" style="color: #667eea; text-decoration: none;">support@ekika.com</a></p>
        </div>
    </div>
</body>
</html>
    `,
  }),
};

export default emailTemplates;
