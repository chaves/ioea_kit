import { config } from '$lib/config';

interface EmailOptions {
	to: string;
	subject: string;
	html: string;
	from?: string;
}

// Simple email sending utility
// In production, integrate with your email service (SendGrid, Mailgun, etc.)
export async function sendEmail(options: EmailOptions): Promise<boolean> {
	const { to, subject, html, from = config.emails.general } = options;

	// For development, just log the email
	if (process.env.NODE_ENV === 'development') {
		console.log('=== Email ===');
		console.log('From:', from);
		console.log('To:', to);
		console.log('Subject:', subject);
		console.log('Body:', html);
		console.log('=============');
		return true;
	}

	// TODO: Implement actual email sending with your preferred service
	// Example with nodemailer:
	// const transporter = nodemailer.createTransport({ ... });
	// await transporter.sendMail({ from, to, subject, html });

	console.warn('Email sending not configured for production');
	return false;
}

// Application receipt email template
export function applicationReceiptEmail(applicant: {
	firstName: string;
	lastName: string;
	email: string;
}): EmailOptions {
	const year = config.currentYear;

	return {
		to: applicant.email,
		subject: `IOEA ${year} application receipt`,
		html: `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
				<h2 style="color: #1a365d;">IOEA ${year} - Application Received</h2>

				<p>Dear ${applicant.firstName} ${applicant.lastName},</p>

				<p>We have successfully received your application for the Institutional and Organizational Economics Academy ${year}.</p>

				<p>Your application will be reviewed by our selection committee. You will be notified about the outcome ${config.deadlines.notification}.</p>

				<p>If you have any questions, please don't hesitate to contact us at <a href="mailto:${config.emails.coordination}">${config.emails.coordination}</a>.</p>

				<p>Best regards,<br>
				The IOEA Team</p>

				<hr style="margin-top: 30px; border: none; border-top: 1px solid #e2e8f0;">
				<p style="font-size: 12px; color: #718096;">
					Institutional and Organizational Economics Academy<br>
					<a href="https://ioea.eu">https://ioea.eu</a>
				</p>
			</div>
		`
	};
}

// Newsletter subscription confirmation
export function newsletterConfirmationEmail(email: string): EmailOptions {
	return {
		to: email,
		subject: 'Welcome to the IOEA Community',
		html: `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
				<h2 style="color: #1a365d;">Welcome to the IOEA Community!</h2>

				<p>Thank you for joining the Institutional and Organizational Economics Academy mailing list.</p>

				<p>You will now receive updates about:</p>
				<ul>
					<li>Upcoming IOEA sessions</li>
					<li>Call for applications</li>
					<li>News and events from the community</li>
				</ul>

				<p>Visit our website to learn more about our program: <a href="https://ioea.eu">https://ioea.eu</a></p>

				<p>Best regards,<br>
				The IOEA Team</p>
			</div>
		`
	};
}

