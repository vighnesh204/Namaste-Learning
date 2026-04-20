exports.paymentSuccessEmail = (name, amount, orderId, paymentId) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Payment Confirmation</title>
        <style>
            body { font-family: Arial, sans-serif; background-color: #fceea7; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; text-align: center; background-color: #ffffff; }
            .header { font-size: 24px; font-weight: bold; color: #333333; margin-bottom: 20px; }
            .content { font-size: 16px; color: #555555; text-align: left; }
            .footer { font-size: 12px; color: #999999; margin-top: 30px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">Payment Successful</div>
            <div class="content">
                <p>Dear ${name},</p>
                <p>We have successfully received your payment of <b>₹${amount}</b>.</p>
                <p>Here are your transaction details:</p>
                <ul>
                    <li><b>Order ID:</b> ${orderId}</li>
                    <li><b>Payment ID:</b> ${paymentId}</li>
                </ul>
                <p>Thank you for choosing Study Notion!</p>
            </div>
            <div class="footer">If you have any questions, please contact our support team.</div>
        </div>
    </body>
    </html>`;
};
