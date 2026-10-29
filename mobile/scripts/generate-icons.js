const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const ASSETS_DIR = path.join(__dirname, '..', 'assets');
const SOURCE_SVG = path.join(ASSETS_DIR, 'logo-source.svg');

async function run() {
  if (!fs.existsSync(SOURCE_SVG)) {
    console.error(`Missing ${SOURCE_SVG}`);
    process.exit(1);
  }
  const svg = fs.readFileSync(SOURCE_SVG);

  await sharp(svg, { density: 384 })
    .resize(1024, 1024)
    .png()
    .toFile(path.join(ASSETS_DIR, 'icon.png'));

  await sharp(svg, { density: 384 })
    .resize(620, 620)
    .extend({ top: 202, bottom: 202, left: 202, right: 202, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(ASSETS_DIR, 'adaptive-icon.png'));

  await sharp(svg, { density: 384 })
    .resize(300, 300)
    .png()
    .toFile(path.join(ASSETS_DIR, 'splash-icon.png'));

  await sharp(svg, { density: 384 })
    .resize(48, 48)
    .png()
    .toFile(path.join(ASSETS_DIR, 'favicon.png'));

  console.log('Generated icon.png, adaptive-icon.png, splash-icon.png, favicon.png in /assets');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
