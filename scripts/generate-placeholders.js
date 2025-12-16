#!/usr/bin/env node

/**
 * Generate placeholder images for the IOEA website
 * Creates: placeholder-person.jpg, placeholder-photo.jpg, placeholder-year.jpg
 */

import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log("Generating placeholder images...");

// For now, let's create a script that will be run with a tool that can generate images
// We'll use a simple approach: create instructions or use a web service

// Actually, the best approach is to create simple placeholder images using a tool
// Let me create a script that uses sharp if available, or provides instructions

try {
  // Use sharp to generate placeholder images
  const sharp = (await import("sharp")).default;
  const outputDir = join(__dirname, "../static/images");

  // Create placeholder-person.jpg (square, 400x400)
  await sharp({
    create: {
      width: 400,
      height: 400,
      channels: 3,
      background: { r: 220, g: 220, b: 220 },
    },
  })
    .jpeg({ quality: 80 })
    .toFile(join(outputDir, "placeholder-person.jpg"));

  console.log("✓ Created placeholder-person.jpg");

  // Create placeholder-photo.jpg (4:3 ratio, 800x600)
  await sharp({
    create: {
      width: 800,
      height: 600,
      channels: 3,
      background: { r: 220, g: 220, b: 220 },
    },
  })
    .jpeg({ quality: 80 })
    .toFile(join(outputDir, "placeholder-photo.jpg"));

  console.log("✓ Created placeholder-photo.jpg");

  // Create placeholder-year.jpg (4:3 ratio, 800x600)
  await sharp({
    create: {
      width: 800,
      height: 600,
      channels: 3,
      background: { r: 220, g: 220, b: 220 },
    },
  })
    .jpeg({ quality: 80 })
    .toFile(join(outputDir, "placeholder-year.jpg"));

  console.log("✓ Created placeholder-year.jpg");
  console.log("\nAll placeholder images generated successfully!");
} catch (error) {
  console.error("Error generating images:", error.message);
  console.log(
    "\nPlease ensure sharp is installed: npm install --save-dev sharp"
  );
  process.exit(1);
}
