.PHONY: github-pages
github-pages:
	npm run build -- --base='/docx2html/app/' --outDir='app/'
