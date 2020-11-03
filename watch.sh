#!/bin/sh

while inotifywait -r -e modify src -q; do
       yarn build && gzip build/static/*/*.{js,css} && \
       rsync -ave ssh build/* web@dev:bbs/client/;
done
