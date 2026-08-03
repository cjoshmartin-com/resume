const path = require('path');
const puppeteer = require('puppeteer');

const SOURCE = path.resolve(__dirname, '..', 'index.html');
const OUTPUT = path.resolve(__dirname, '..', 'index.pdf');

(async () => {
	const browser = await puppeteer.launch();
	try {
		const page = await browser.newPage();
		await page.goto(`file://${SOURCE}`, { waitUntil: 'networkidle0' });
		await page.emulateMediaType('print');
		await page.pdf({
			path: OUTPUT,
			printBackground: true,
			preferCSSPageSize: true,
		});
	} finally {
		await browser.close();
	}

	console.log(`Wrote ${path.relative(process.cwd(), OUTPUT)}`);
})();
