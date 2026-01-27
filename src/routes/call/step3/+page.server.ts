import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { prisma } from "$lib/server/db";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { sendEmail, applicationReceiptEmail } from "$lib/server/email";
import { config } from "$lib/config";

const UPLOAD_DIR = `uploads/IOEA${config.currentYear}_call`;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const load: PageServerLoad = async ({ cookies }) => {
  const step1Data = cookies.get("call_step1");
  const step2Data = cookies.get("call_step2");

  if (!step1Data || !step2Data) {
    throw redirect(303, "/call");
  }

  return {};
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const step1Raw = cookies.get("call_step1");
    const step2Raw = cookies.get("call_step2");

    if (!step1Raw || !step2Raw) {
      throw redirect(303, "/call");
    }

    const step1 = JSON.parse(step1Raw);
    const step2 = JSON.parse(step2Raw);

    const data = await request.formData();
    const cvFile = data.get("cv") as File;
    const paperFile = data.get("paper") as File;

    // Validation
    if (!cvFile || cvFile.size === 0) {
      return fail(400, { error: "Please upload your CV." });
    }

    if (!paperFile || paperFile.size === 0) {
      return fail(400, { error: "Please upload your research paper." });
    }

    if (cvFile.size > MAX_FILE_SIZE || paperFile.size > MAX_FILE_SIZE) {
      return fail(400, { error: "File size must be less than 5MB." });
    }

    if (!cvFile.name.endsWith(".pdf") || !paperFile.name.endsWith(".pdf")) {
      return fail(400, { error: "Only PDF files are accepted." });
    }

    try {
      // Create upload directory if it doesn't exist
      await mkdir(UPLOAD_DIR, { recursive: true });

      // Generate unique filenames
      const timestamp = Date.now();
      const sanitizedName = `${step1.last_name}_${step1.first_name}`.replace(
        /[^a-zA-Z0-9]/g,
        "_"
      );
      const cvFilename = `${sanitizedName}_CV_${timestamp}.pdf`;
      const paperFilename = `${sanitizedName}_PAPER_${timestamp}.pdf`;

      // Save files
      const cvBuffer = Buffer.from(await cvFile.arrayBuffer());
      const paperBuffer = Buffer.from(await paperFile.arrayBuffer());

      await writeFile(join(UPLOAD_DIR, cvFilename), cvBuffer);
      await writeFile(join(UPLOAD_DIR, paperFilename), paperBuffer);

      // Create database entry
      await prisma.call_submissions.create({
        data: {
          call_year: new Date().getFullYear(),
          first_name: step1.first_name,
          last_name: step1.last_name,
          email: step1.email,
          nationality: step1.nationality,
          gender: step1.gender,
          age: step1.age,
          status: step1.status,
          domain: step1.domain,
          diploma: step1.diploma,
          university: step2.university,
          department: step2.department,
          country: step2.country,
          title: step2.phd_title,
          phd_ad_name: step2.phd_ad_name || null,
          phd_ad_mail: step2.phd_ad_mail || null,
          phd_year: step2.phd_year || null,
          summary: step2.phd_summary,
          cv: cvFilename,
          paper: paperFilename,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      // Send confirmation email (don't fail if email fails)
      try {
        const emailSent = await sendEmail(
          await applicationReceiptEmail({
            firstName: step1.first_name,
            lastName: step1.last_name,
            email: step1.email,
          })
        );
        if (!emailSent) {
          console.warn(
            `Failed to send confirmation email to ${step1.email}, but application was saved`
          );
        }
      } catch (emailError) {
        // Log email error but don't fail the submission
        console.error("Email sending error (non-fatal):", emailError);
      }

      // Clear cookies
      cookies.delete("call_step1", { path: "/call" });
      cookies.delete("call_step2", { path: "/call" });
    } catch (error) {
      console.error("Application submission error:", error);
      return fail(500, {
        error:
          "An error occurred while submitting your application. Please try again.",
      });
    }

    // Redirect outside try-catch to avoid catching SvelteKit's redirect exception
    redirect(303, "/call/success");
  },
};
