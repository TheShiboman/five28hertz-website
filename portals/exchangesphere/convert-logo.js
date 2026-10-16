import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convertToWebP() {
  try {
    // Input PNG path
    const inputPath = path.join(__dirname, 'client/public/images/exchangesphere-logo.png');
    
    // Output WebP path
    const outputPath = path.join(__dirname, 'client/public/images/exchangesphere-logo.webp');
    
    // Convert to WebP with high quality
    await sharp(inputPath)
      .webp({ quality: 90 })
      .toFile(outputPath);
      
    console.log('Successfully converted logo to WebP format!');
  } catch (error) {
    console.error('Error converting image:', error);
  }
}

convertToWebP();