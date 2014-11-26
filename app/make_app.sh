time=`date +%s`;
appdir="$1.__HEAD__"
appnew="$1.$time"

if [ -d "$appdir" ]; then
    cp -pr $appdir $appnew
    sed -i "s/__HEAD__/$time/g" $appnew/index.html $appnew/app.js
    sed -i 's!/app.js"!/min.js"!g' $appnew/index.html
    java -jar /home/web/yuicompressor-2.4.7/build/yuicompressor-2.4.7.jar -v --type js --charset utf-8 -o $appnew/min.js $appnew/app.js > $appnew/min.log 2>&1
    gzip -c $appnew/min.js > $appnew/min.js.gz
    for i in $appnew/*.tpl.html; do gzip -c $i > $i.gz; done
    echo -n "$appnew" > "$1.current"
    echo "new app created: $appnew"
else
    echo "app does not exist: $1"
fi
