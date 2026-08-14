import { mkdir, stat } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const JAR_URL = "https://assets.jmrecondo.com/react-assessment/jm-coffeeshop.jar";
const JAR_NAME = "jm-coffeeshop.jar";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const binDir = join(projectRoot, "bin");
const jarPath = join(binDir, JAR_NAME);

async function exists(path) {
  try {
    const info = await stat(path);
    return info.isFile() && info.size > 0;
  } catch {
    return false;
  }
}

if (await exists(jarPath)) {
  console.log(`Using existing server jar: ${jarPath}`);
  process.exit(0);
}

console.log(`Downloading server jar from ${JAR_URL} ...`);
await mkdir(binDir, { recursive: true });

const response = await fetch(JAR_URL, { redirect: "follow" });
if (!response.ok || !response.body) {
  throw new Error(
    `Download failed: ${response.status} ${response.statusText}`,
  );
}

await pipeline(Readable.fromWeb(response.body), createWriteStream(jarPath));

const { size } = await stat(jarPath);
console.log(`Downloaded ${JAR_NAME} (${(size / 1024 / 1024).toFixed(1)} MB) to ${jarPath}`);
