import fs from 'fs';
import path from 'path';

const srcDir = './src';
const distDir = './dist';

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 1. Read files
let html = fs.readFileSync(path.join(srcDir, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(srcDir, 'style.css'), 'utf8');
const js = fs.readFileSync(path.join(srcDir, 'app.js'), 'utf8');

// 2. Inline CSS and JS
// Replace <link rel="stylesheet" href="style.css"> with <style>...</style>
html = html.replace(/<link[^>]*href="style\.css"[^>]*>/i, `<style>\n\/\* inlined style.css \*\/\n${css}\n</style>`);

// Replace <script type="module" src="app.js"></script> with <script type="module">...</script>
html = html.replace(/<script[^>]*src="app\.js"[^>]*><\/script>/i, `<script type="module">\n\/\* inlined app.js \*\/\n${js}\n</script>`);

// 3. Write to dist/index.html (lowercase for both GAS and GitHub Pages compatibility)
fs.writeFileSync(path.join(distDir, 'index.html'), html, 'utf8');

// 4. Copy Code.gs to dist/Code.gs
const gsCode = fs.readFileSync(path.join(srcDir, 'Code.gs'), 'utf8');
fs.writeFileSync(path.join(distDir, 'Code.gs'), gsCode, 'utf8');

console.log('✓ Successfully bundled webapp into dist/index.html and dist/Code.gs!');

