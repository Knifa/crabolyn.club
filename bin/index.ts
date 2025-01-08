import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import exifr from "exifr";

const inputDir = "./crabalogue/in";
const outputDir = "./crabalogue/out";

interface Crabolyn {
  name: string;
  color: string;
  fullPath: string;
  thumbPath: string;
  date: string | null;
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  const rh = r.toString(16).padStart(2, "0");
  const gh = g.toString(16).padStart(2, "0");
  const bh = b.toString(16).padStart(2, "0");

  return `${rh}${gh}${bh}`;
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

    const exif = await exifr.parse(inputPath, {
      pick: ["DateTimeOriginal"],
    });

    const dateRaw = exif?.DateTimeOriginal;
    const date = dateRaw ? new Date(dateRaw).toISOString() : null;

    const image = sharp(inputPath).rotate();
    const imageStats = await image.stats();

    await image
      .resize(256, 256, resizeOptions)
      .jpeg({ quality: 80 })
      .toFile(`${outputDir}/${thumbBaseName}`);

    await image
      .resize(1024, 1024, resizeOptions)
      .jpeg({ quality: 80 })
      .toFile(`${outputDir}/${fullBaseName}`);

    crabolyns.push({
      name: baseName.replace(/(_|-)/g, " "),
      color: `#${rgbToHex(imageStats.dominant)}`,
      fullPath: fullBaseName,
      thumbPath: thumbBaseName,
      date,
    });
  }

  const json = JSON.stringify(crabolyns, null, 2);
  await fs.writeFile(`${outputDir}/crabalogue.json`, json);
}

processImages();
