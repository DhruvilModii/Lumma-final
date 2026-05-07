import fs from "fs";
const pkg = await import("pdf-parse");
const pdf = pkg.default || pkg;
const paths = ['d:/INTERSHIP COURSE/week 3/practice set.pdf', 'd:/INTERSHIP COURSE/week 3/week 3.pdf'];
for (const p of paths) {
  process.stdout.write(`FILE: ${p}\n`);
  try {
    const dataBuffer = fs.readFileSync(p);
    const data = await pdf(dataBuffer);
    const pages = data.text.split(/\f/);
    for (let i = 0; i < Math.min(pages.length, 5); ++i) {
      process.stdout.write(`PAGE ${i+1}\n`);
      process.stdout.write(pages[i].trim().slice(0, 1200) + '\n---\n');
    }
  } catch (e) {
    process.stdout.write(`ERROR ${e.message}\n`);
  }
}
