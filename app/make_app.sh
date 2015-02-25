clientroot=$(dirname $PWD)
time=$(date +%s);
appdir="$1.__HEAD__"
appnew="$1.$time"

if [ -d "$appdir" ]; then
    rm -rf $appnew
    cp -pr $appdir $appnew
    sed -i "s/__HEAD__/$time/g" $appnew/index.html $appnew/app.js
    # min the js files
    files=$(grep '<script .*\.js".*</script>' $appnew/index.html  | grep -v '\.min\.' | sed -e 's/.*src=.//' -e 's/\.js['\'',"].*/.js/')
    for f in $files; do
        cat $clientroot$f >> $appnew/$time.js;
    done

    sed -i 's!/app.js"!/app.min.js"!g' $appnew/index.html
    for f in $files; do
        sed -i 's!.*<script .*'$f'.*</script>.*!!g' $appnew/index.html
        #delete files in local version directory
        if echo $f | grep "$appnew" > /dev/null; then
            rm -rf $clientroot$f;
        fi
    done
    sed -i '/^$/d' $appnew/index.html

    java -jar /home/web/yuicompressor-2.4.7/build/yuicompressor-2.4.7.jar -v --type js --charset utf-8 -o $appnew/app.min.js $appnew/$time.js > $appnew/min.log 2>&1
    rm -rf $appnew/$time.js
    gzip -c $appnew/app.min.js > $appnew/app.min.js.gz
    for i in $appnew/views/*.html; do gzip -c $i > $i.gz; done
    echo -n "$appnew" > "$1.current"
    echo "new app created: $appnew"
else
    echo "app does not exist: $1"
fi
