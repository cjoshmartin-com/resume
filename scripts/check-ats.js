const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

const PDF_PATH = path.resolve(__dirname, '..', 'index.pdf');

const REQUIRED_SECTIONS = ['Experience', 'Education'];
const REQUIRED_EMAIL_PATTERN = /contact@cjoshmartin\.com/;
const REQUIRED_PHONE_DIGITS = '13176528413';

// Each entry's title must read before its employer, matching the visual
// top-to-bottom order of the .content-with-words grid layout.
const JOB_ENTRIES = [
	{ title: 'Freelance Software Engineer', employer: 'Reprogrammed Software' },
	{ title: 'Frontend Engineer', employer: 'Amazon' },
	{ title: 'React Native Developer', employer: 'Studio Science' },
	{ title: 'Full Stack Engineer', employer: 'Mirus Research' },
];

async function main() {
	const failures = [];

	if (!fs.existsSync(PDF_PATH)) {
		console.error(`ATS check failed: ${PDF_PATH} does not exist. Run "npm run build:pdf" first.`);
		process.exit(1);
	}

	const buffer = fs.readFileSync(PDF_PATH);
	const { text } = await pdfParse(buffer);

	if (!text || text.trim().length < 100) {
		failures.push('PDF text extraction returned little or no text — resume may not be ATS-parseable (image-only content or a broken layout).');
	}

	for (const section of REQUIRED_SECTIONS) {
		if (!text.includes(section)) {
			failures.push(`Missing expected section header: "${section}"`);
		}
	}

	if (!REQUIRED_EMAIL_PATTERN.test(text)) {
		failures.push('Missing expected email address in extracted text');
	}

	// Compare digits only so PDF-extraction spacing/punctuation quirks
	// around parentheses and dashes can't cause a false negative.
	const digitsOnly = text.replace(/\D/g, '');
	if (!digitsOnly.includes(REQUIRED_PHONE_DIGITS)) {
		failures.push('Missing expected phone number in extracted text');
	}

	for (const { title, employer } of JOB_ENTRIES) {
		const titleIndex = text.indexOf(title);
		const employerIndex = text.indexOf(employer);

		if (titleIndex === -1 || employerIndex === -1) {
			failures.push(`Could not locate "${title}" / "${employer}" in extracted PDF text`);
			continue;
		}

		if (titleIndex > employerIndex) {
			failures.push(`Reading order broken: "${employer}" appears before "${title}" in extracted PDF text`);
		}
	}

	if (failures.length > 0) {
		console.error('ATS check failed:\n' + failures.map((f) => ` - ${f}`).join('\n'));
		process.exit(1);
	}

	console.log('ATS check passed.');
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
