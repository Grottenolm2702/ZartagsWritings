# Suche alle Hauptdateien (die \begin{document} enthalten)
TEX_FILES := $(shell grep -l '\\begin{document}' *.tex 2>/dev/null)
PDF_FILES := $(TEX_FILES:.tex=.pdf)
SHARED_DEPS := $(shell find sections config -type f -name '*.tex' 2>/dev/null) \
               $(wildcard *.bib .latexmkrc)

# Nutze latexmk, da es inkrementelle Builds und Referenzen perfekt verwaltet
LATEXMK = latexmk
FLAGS   = -lualatex -interaction=nonstopmode -halt-on-error -synctex=1

.PHONY: all clean distclean

# Das Standard-Target baut alle PDFs
all: $(PDF_FILES)

# Die eigentliche Regel: Baut die PDF-Datei NUR, wenn die .tex-Datei neuer ist
# oder sich interne Abhängigkeiten geändert haben.
%.pdf: %.tex $(SHARED_DEPS)
	@echo "=== Prüfe/Kompiliere $< ==="
	$(LATEXMK) $(FLAGS) $<

# Säubert alle Hilfsdateien, die latexmk oder lualatex erzeugt haben
clean:
	@echo "Lösche temporäre LaTeX-Hilfsdateien..."
	$(LATEXMK) -c
	rm -f *.synctex.gz *.out.pyg *.nav *.snm *.bbl *.aux *.lol

# Löscht zusätzlich die PDFs
distclean: clean
	@echo "Lösche erzeugte PDF-Dateien..."
	$(LATEXMK) -C
	rm -f $(PDF_FILES)
