/* Generate optimized WebP variants for images displayed smaller than source.
   Run with: node scripts/optimize-images.js */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const DIST = path.resolve(__dirname, '..', 'dist');
const SCREENSHOTS = path.join(DIST, 'screenshots');

// Images displayed at specific sizes in project cards (~429px wide max on md+ grids)
// Cards have aspect-ratio 16/10, so at 429px wide = ~268px tall displayed
const PROJECT_CARDS = [
  { src: 'Ai_Agent-800.webp',         srcW: 800, srcH: 500,  maxW: 480 },
  { src: 'bolts_army-800.webp',       srcW: 800, srcH: 500,  maxW: 480 },
  { src: 'Siksya_mantra-800.webp',    srcW: 800, srcH: 500,  maxW: 480 },
  { src: 'Invoice_generator-800.webp',srcW: 800, srcH: 524,  maxW: 480 },
  { src: 'Inventory_management-800.webp', srcW: 800, srcH: 600, maxW: 480 },
  { src: 'Business_automation-800.webp', srcW: 800, srcH: 500, maxW: 480 },
];

// Hackathon certificate: displayed at w-full, h-48 (md:h-72) in about section
// Container is max-w-4xl (~896px on large), but image fills width at 439px on mobile
// We'll create a 640px variant that covers tablet/mobile and keeps quality on desktop
const HACKATHON = { src: 'hackathon-880.webp', srcW: 880, srcH: 611, maxW: 640 };

async function generateVariants() {
  const results = [];

  // Generate 480px variants for project cards (480px covers >95% of mobile/tablet viewports)
  for (const img of PROJECT_CARDS) {
    const srcPath = path.join(SCREENSHOTS, img.src);
    if (!fs.existsSync(srcPath)) {
      console.warn(`Source not found: ${srcPath}`);
      continue;
    }
    const outName = img.src.replace('-800.webp', '-480.webp');
    const outPath = path.join(SCREENSHOTS, outName);

    await sharp(srcPath)
      .resize(img.maxW, null, { withoutEnlargement: true, fit: 'inside' })
      .webp({ quality: 82, effort: 6, alphaQuality: 80 })
      .toFile(outPath);

    const stats = fs.statSync(outPath);
    results.push({ name: outName, sizeKB: Math.round(stats.size / 1024) });
    console.log(`✓ ${outName} — ${Math.round(stats.size / 1024)} KB`);
  }

  // Hackathon at 640px (covers tablet, desktop gets full-size)
  const srcPath = path.join(DIST, HACKATHON.src);
  if (!fs.existsSync(srcPath)) {
    console.warn(`Source not found: ${srcPath}`);
  } else {
    const outName = HACKATHON.src.replace('-880.webp', '-640.webp');
    const outPath = path.join(DIST, outName);

    await sharp(srcPath)
      .resize(HACKATHON.maxW, null, { withoutEnlargement: true })
      .webp({ quality: 85, effort: 6 })
      .toFile(outPath);

    const stats = fs.statSync(outPath);
    results.push({ name: outName, sizeKB: Math.round(stats.size / 1024) });
    console.log(`✓ ${outName} — ${Math.round(stats.size / 1024)} KB`);
  }

  console.log('\nGenerated ' + results.length + ' optimized variants');
  return results;
}

generateVariants().catch(console.error);
