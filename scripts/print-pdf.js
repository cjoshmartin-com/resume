const path = require('path');
const puppeteer = require('puppeteer');

const SOURCE = path.resolve(__dirname, '..', 'index.html');
const OUTPUT = path.resolve(__dirname, '..', 'index.pdf');

(async () => {
	const browser = await puppeteer.launch({
		// GitHub Actions runners don't support Chrome's unprivileged user
		// namespace sandbox; the job itself already runs in an isolated
		// container, so disabling it here is safe.
		args: ['--no-sandbox', '--disable-setuid-sandbox'],
	});
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
