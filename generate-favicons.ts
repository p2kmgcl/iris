import fs from 'fs';
import path from 'path';
import childProcess from 'child_process';

const faviconPath = path.join(__dirname, 'assets', 'favicon.svg');
const faviconCirclePath = path.join(__dirname, 'assets', 'favicon-circle.svg');

const staticPath = path.join(__dirname, 'static');
const manifestContent = JSON.parse(
  fs.readFileSync(path.join(staticPath, 'iris.webmanifest'), 'utf-8'),
);

manifestContent.icons.forEach(
  (icon: { src: string; sizes: string; purpose: string }) => {
    const size = parseInt(icon.sizes, 10);
    const source =
      icon.purpose === 'maskable' ? faviconPath : faviconCirclePath;
    const destination = path.resolve(staticPath, icon.src);

    childProcess.execSync(
      `inkscape --export-png ${destination} -w ${size} ${source}`,
    );
  },
);
