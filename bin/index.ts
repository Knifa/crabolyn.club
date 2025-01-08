import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const inputDir = "./crabalogue/in";
const outputDir = "./crabalogue/out";

interface Crabolyn {
  name: string;
  color: string;
  fullPath: string;
  thumbPath: string;
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  return ((r << 16) | (g << 8) | b).toString(16);
}

async function processImages() {
  const crabolyns: Crabolyn[] = [];
  const files = await fs.readdir(inputDir);

  for (const file of files) {
    const inputPath = `${inputDir}/${file}`;
    const baseName = path.basename(file, path.extname(file));

    const fullBaseName = `${baseName}_full.jpg`;
    const thumbBaseName = `${baseName}_thumb.jpg`;

    const resizeOptions: sharp.ResizeOptions = {
      fit: "cover",
      position: "center",
    };

    const image = sharp(inputPath)
      .rotate();
    const imageStats = await image.stats();

    await image
      .resize(256, 256, resizeOptions)
      .jpeg({ quality: 50 })
      .toFile(`${outputDir}/${thumbBaseName}`);

    await image
      .resize(1024, 1024, resizeOptions)
      .jpeg({ quality: 80 })
      .toFile(`${outputDir}/${fullBaseName}`);

    crabolyns.push({
      name: baseName,
      color: `#${rgbToHex(imageStats.dominant)}`,
      fullPath: fullBaseName,
      thumbPath: thumbBaseName,
    });
  }

  const json = JSON.stringify(crabolyns, null, 2);
  await fs.writeFile(`${outputDir}/crabalogue.json`, json);
}

processImages();
