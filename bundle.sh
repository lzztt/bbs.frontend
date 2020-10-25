if diff src/image-blob-reduce-1.0.7.js node_modules/image-blob-reduce/index.js; then
	if [ -d build ]; then
		mv build build.`date -r build +%s`;
	fi
	yarn build && gzip build/static/*/*.{js,css}
fi
