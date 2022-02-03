all: Makefile.in

RELEASE_VERSION:=$(shell grep em:version install.rdf | head -n 1 | sed -e 's/ *<em:version>//' -e 's/<\/em:version>//' | sed 's/ //g')

Makefile.in: install.rdf
	@echo "all: zotserver-${RELEASE_VERSION}.xpi" > Makefile.in

-include Makefile.in

zotserver.xpi: FORCE_RUN
	rm -rf $@
	zip -r $@ chrome chrome.manifest install.rdf -x \*.DS_Store

zotserver-%.xpi: zotserver.xpi
	mv $< $@
	rm -rf Makefile.in

version: install.rdf
	@echo "${RELEASE_VERSION}"

FORCE_RUN:
	@# this rule will make anything that depends on it run all the time
