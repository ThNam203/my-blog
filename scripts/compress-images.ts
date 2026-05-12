import { readdir, stat, rename, unlink } from "node:fs/promises";
import { join, extname, basename, dirname } from "node:path";
import sharp from "sharp";

const TARGET_DIRS = [
    "public/assets/images",
    "public/assets/avatar",
];
const MAX_WIDTH = 1600;
const QUALITY = 78;
const MIN_BYTES_TO_RECOMPRESS = 250 * 1024;

async function walk(dir: string): Promise<string[]> {
    const entries = await readdir(dir, { withFileTypes: true });
    const files: string[] = [];
    for (const entry of entries) {
        const full = join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...(await walk(full)));
        } else {
            files.push(full);
        }
    }
    return files;
}

async function processFile(file: string) {
    const ext = extname(file).toLowerCase();
    if (![".webp", ".jpg", ".jpeg", ".png"].includes(ext)) return;

    const before = (await stat(file)).size;
    if (before < MIN_BYTES_TO_RECOMPRESS) {
        console.log(`skip  ${file} (${(before / 1024).toFixed(0)}KB)`);
        return;
    }

    const tmp = join(dirname(file), `.tmp-${basename(file)}.webp`);
    const pipeline = sharp(file)
        .rotate()
        .resize({ width: MAX_WIDTH, withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 6 });

    await pipeline.toFile(tmp);
    const after = (await stat(tmp)).size;

    if (after >= before) {
        await unlink(tmp);
        console.log(`keep  ${file} (recompressed bigger)`);
        return;
    }

    const finalPath = ext === ".webp" ? file : file.replace(ext, ".webp");
    if (finalPath !== file) {
        await unlink(file);
    }
    await rename(tmp, finalPath);
    console.log(
        `done  ${file} ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`,
    );
}

async function main() {
    const root = process.cwd();
    for (const dir of TARGET_DIRS) {
        const abs = join(root, dir);
        try {
            const files = await walk(abs);
            for (const f of files) await processFile(f);
        } catch (err) {
            console.warn(`skip dir ${dir}:`, err);
        }
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
