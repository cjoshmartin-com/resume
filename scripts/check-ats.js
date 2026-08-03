const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

const PDF_PATH = path.resolve(__dirname, '..', 'index.pdf');

const REQUIRED_SECTIONS = ['Experience', 'Education'];
const REQUIRED_CONTACT_PATTERNS = [
	{ label: 'email address', pattern: /contact@cjoshmartin\.com/ },
	{ label: 'phone number', pattern: /\d{3}[).\-\s]?\d{3}[.\-]?\d{4}/ },
];

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

	for (const { label, pattern } of REQUIRED_CONTACT_PATTERNS) {
		if (!pattern.test(text)) {
			failures.push(`Missing expected ${label} in extracted text`);
		}
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
