
bundle: ./build/content_script.js
	rm -f build/bundle.zip &&\
	zip build/bundle.zip -j ./build/content_script.js manifest.json &&\
	zip build/bundle.zip icons/*

./build/content_script.js: content_script.js package.json yarn.lock gathering/* insertion/* utils/*
	yarn parcel build content_script.js --dist-dir ./build/