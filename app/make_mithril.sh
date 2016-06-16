clientroot=$(dirname $PWD)
time=$(date +%s);
appdir="$1.__HEAD__"
appnew="$1.$time"

if [ -d "$appdir" ]; then
    rm -rf $appnew
    cp -pr $appdir $appnew
    sed -i "s/__HEAD__/$time/g" $appnew/index.html $appnew/app.js
    # min the js files
    files=$(grep '<script .*\.js".*</script>' $appnew/index.html  | grep -v '\.min\.' | sed -e 's/.*src=.//' -e 's/\.js['\'',"].*/.js/' | grep -v '^//')
    echo -e '"use strict";\n\n(function(){' > $appnew/$time.js;
    for f in $files; do
        # cat $clientroot$f >> $appnew/$time.js;
        grep -v '"use strict"\|console.log(' $clientroot$f >> $appnew/$time.js;
    done
    echo -e '\n}());' >> $appnew/$time.js;

    sed -i 's!/app.js"!/app.min.js"!g' $appnew/index.html
    for f in $files; do
        sed -i 's!.*<script .*'$f'.*</script>.*!!g' $appnew/index.html
        #delete files in local version directory
        if echo $f | grep "$appnew" > /dev/null; then
            rm -rf $clientroot$f;
        fi
    done

    #java -jar /home/web/yuicompressor-2.4.8.jar -v --type js --charset utf-8 -o $appnew/app.min.js $appnew/$time.js > $appnew/min.log 2>&1
    uglifyjs --mangle --screw-ie8 -v -o $appnew/app.min.js -- $appnew/$time.js > $appnew/min.js.log 2>&1
    if [ $? -ne 0 ]; then
        cat $appnew/min.log
        echo "new app failed: $appnew"
        exit 1;
    fi


    # min the css files
    files=$(grep '<link .*\.css".*>' $appnew/index.html  | grep -v '\.min\.' | sed -e 's/.*href=.//' -e 's/\.css['\'',"].*/.css/' | grep -v '^//')
    for f in $files; do
        cat $clientroot$f >> $appnew/$time.css;
    done

    sed -i 's!/app.css"!/app.min.css"!g' $appnew/index.html
    for f in $files; do
        sed -i 's!.*<link .*'$f'.*>.*!!g' $appnew/index.html
        #delete files in local version directory
        if echo $f | grep "$appnew" > /dev/null; then
            rm -rf $clientroot$f;
        fi
    done

    java -jar /home/web/yuicompressor-2.4.8.jar -v --type css --charset utf-8 -o $appnew/app.min.css $appnew/$time.css > $appnew/min.css.log 2>&1
    if [ $? -ne 0 ]; then
        cat $appnew/min.log
        echo "new app failed: $appnew"
        exit 1;
    fi


    # clean up
    sed -i '/^$/d' $appnew/index.html
    rm -rf $appnew/$time.js $appnew/$time.css
    echo "gzip -c $appnew/app.min.js > $appnew/app.min.js.gz"
    echo "gzip -c $appnew/app.min.css > $appnew/app.min.css.gz"
    echo -n "$appnew" > "$1.current"
    echo "new app created: $appnew"
else
    echo "app does not exist: $1"
fi
