const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const inputDir = './src/store/gen';
const outputDir = './src/schemas/gen';

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(inputDir).filter((f) => f.endsWith('.ts'));

files.forEach((file) => {
  const inputPath = path.join(inputDir, file);
  const outputPath = path.join(outputDir, file.replace('.ts', '.zod.ts'));

  console.log(`Generating Zod schema for: ${file}`);
  
  execSync(`npx ts-to-zod "${inputPath}" "${outputPath}" --skipValidation`, {
    stdio: 'inherit',
  });
});

console.log('Finished generating all Zod schemas!');