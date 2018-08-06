all: index.html index.pdf index.docx index.txt

index.html: index.md style.css bootstrap-grid.min.css
	pandoc --standalone --css bootstrap-grid.min.css --title-prefix="Josh Martin" --from markdown --to html -o index.html index.md

index.pdf: index.html
	wkhtmltopdf index.html index.pdf

index.docx: index.md
	pandoc --from markdown --to docx -o index.docx index.md

index.txt: index.md
	pandoc --standalone  --from markdown+smart --to plain -o index.txt index.md

clean:
	rm -f *.html *.pdf *.docx *.txt
