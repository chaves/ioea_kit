import { config, getConfig, staticConfig } from "$lib/config";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  cc?: string | string[];
}

// Helper function to get ordinal suffix
function getOrdinal(num: number): string {
  const lastDigit = num % 10;
  const lastTwoDigits = num % 100;

  // Handle special cases: 11th, 12th, 13th (not 11st, 12nd, 13rd)
  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return "th";
  }

  // Handle regular cases
  if (lastDigit === 1) return "st";
  if (lastDigit === 2) return "nd";
  if (lastDigit === 3) return "rd";
  return "th";
}

// Simple email sending utility
// Uses nodemailer with SMTP configuration from environment variables
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  // Get from address and name from environment or config
  const fromEmail = process.env.SMTP_FROM_EMAIL || config.emails.general;
  const fromName = process.env.SMTP_FROM_NAME || "IOEA Team";
  const fromAddress = fromName ? `${fromName} <${fromEmail}>` : fromEmail;

  const { to, subject, html, from = fromAddress, cc } = options;

  // For development, just log the email
  if (process.env.NODE_ENV === "development" || !process.env.SMTP_HOST) {
    console.log("=== Email ===");
    console.log("From:", from);
    console.log("To:", to);
    if (cc) console.log("CC:", cc);
    console.log("Subject:", subject);
    console.log("Body:", html);
    console.log("=============");
    return true;
  }

  // Production: send actual email using nodemailer
  try {
    const nodemailer = await import("nodemailer");

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure:
        process.env.SMTP_SECURE === "true" || process.env.SMTP_PORT === "465", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      // Allow self-signed certificates if needed
      tls: {
        rejectUnauthorized: process.env.SMTP_REJECT_UNAUTHORIZED !== "false",
      },
    });

    await transporter.sendMail({
      from: from,
      to: to,
      cc: cc,
      subject: subject,
      html: html,
    });

    console.log(`Email sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    // Don't fail the application submission if email fails
    // Log the error but return true so the application is still saved
    return true;
  }
}

// Application receipt email template
export async function applicationReceiptEmail(applicant: {
  firstName: string;
  lastName: string;
  email: string;
}): Promise<EmailOptions> {
  // Get config (static only)
  const fullConfig = getConfig();
  const year = fullConfig.session.year;
  const sessionNumber = fullConfig.sessionNumber;
  const sessionOrdinal = getOrdinal(sessionNumber);

  return {
    to: applicant.email,
    cc: fullConfig.emails.webmaster,
    subject: `IOEA ${year} application receipt`,
    html: `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
				<h2 style="color: #1a365d;">IOEA ${year} - Application Received</h2>

				<p>Dear ${applicant.firstName} ${applicant.lastName},</p>

				<p>We have successfully received your application for the ${sessionNumber}${sessionOrdinal} session of the Institutional and Organizational Economics Academy ${year}.</p>

				<p>Your application will be reviewed by our selection committee. You will be notified about the outcome ${fullConfig.deadlines.notification}.</p>

				<p>If you have any questions, please don't hesitate to contact us at <a href="mailto:${fullConfig.emails.coordination}">${fullConfig.emails.coordination}</a>.</p>

				<p>Best regards,<br>
				The IOEA Team</p>

				<hr style="margin-top: 30px; border: none; border-top: 1px solid #e2e8f0;">
				<p style="font-size: 12px; color: #718096;">
					Institutional and Organizational Economics Academy<br>
					<a href="https://ioea.eu">https://ioea.eu</a>
				</p>
			</div>
		`,
  };
}

// Welcome email with temporary credentials
export function welcomeUserEmail({
  name,
  email,
  temporaryPassword,
  loginUrl,
}: {
  name: string;
  email: string;
  temporaryPassword: string;
  loginUrl: string;
}): EmailOptions {
  return {
    to: email,
    subject: "Your IOEA Account Has Been Created",
    html: `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
				<h2 style="color: #1a365d;">Welcome to IOEA</h2>

				<p>Dear ${name},</p>

				<p>An account has been created for you on the IOEA platform.</p>

				<p>Here are your login credentials:</p>
				<div style="background: #f7fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; margin: 1rem 0;">
					<p style="margin: 0.25rem 0;"><strong>Email:</strong> ${email}</p>
					<p style="margin: 0.25rem 0;"><strong>Temporary Password:</strong> ${temporaryPassword}</p>
				</div>

				<p>You will be asked to change your password on first login.</p>

				<p>
					<a href="${loginUrl}" style="display: inline-block; background: #4c1d95; color: white; padding: 0.75rem 1.5rem; border-radius: 6px; text-decoration: none; font-weight: bold;">Login Now</a>
				</p>

				<p style="font-size: 0.9rem; color: #718096;">If you did not expect this email, please ignore it.</p>

				<hr style="margin-top: 30px; border: none; border-top: 1px solid #e2e8f0;">
				<p style="font-size: 12px; color: #718096;">
					Institutional and Organizational Economics Academy<br>
					<a href="https://ioea.eu">https://ioea.eu</a>
				</p>
			</div>
		`,
  };
}

// Password reset email
export function passwordResetEmail({
  name,
  email,
  resetUrl,
}: {
  name: string;
  email: string;
  resetUrl: string;
}): EmailOptions {
  return {
    to: email,
    subject: "IOEA - Password Reset Request",
    html: `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
				<h2 style="color: #1a365d;">Password Reset</h2>

				<p>Dear ${name},</p>

				<p>We received a request to reset your password for your IOEA account.</p>

				<p>Click the button below to reset your password. This link will expire in 1 hour.</p>

				<p>
					<a href="${resetUrl}" style="display: inline-block; background: #4c1d95; color: white; padding: 0.75rem 1.5rem; border-radius: 6px; text-decoration: none; font-weight: bold;">Reset Password</a>
				</p>

				<p style="font-size: 0.9rem; color: #718096;">If you didn't request this, you can safely ignore this email. Your password will not be changed.</p>

				<hr style="margin-top: 30px; border: none; border-top: 1px solid #e2e8f0;">
				<p style="font-size: 12px; color: #718096;">
					Institutional and Organizational Economics Academy<br>
					<a href="https://ioea.eu">https://ioea.eu</a>
				</p>
			</div>
		`,
  };
}

// Newsletter subscription confirmation
export function newsletterConfirmationEmail(email: string): EmailOptions {
  return {
    to: email,
    subject: "Welcome to the IOEA Community",
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
		`,
  };
}
