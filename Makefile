all: index.html index.pdf index.docx index.txt

index.html: index.md dist/css/style.css
	pandoc --standalone --title-prefix="Josh Martin" --from markdown --to html -o dist/index.html index.md

index.pdf: dist/index.html
	wkhtmltopdf dist/index.html dist/index.pdf

index.docx: index.md
	pandoc --from markdown --to docx -o dist/index.docx index.md

index.txt: index.md
	pandoc --standalone  --from markdown+smart --to plain -o dist/index.txt index.md

clean:
	rm -f dist/*.html dist/*.pdf dist/*.docx dist/*.txt
