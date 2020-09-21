set -e

time=`date +%s`

list='
js/jquery.cookie.js
js/jquery.imageslider.js
js/jquery.hoverIntent.js
js/jquery.superfish.js
js/jquery.markitup.js
js/jquery.markitup.bbcode.set.js
js/image-blob-reduce.js
js/main.js
'
cat $list > min/$time.js
terser min/$time.js --comments false -c -m -o min/$time.min.js

list='
css/normalize.css
css/markitup.style.css
css/markitup.bbcode.css
css/nav_xs.css
css/nav_sm.css
css/main_xs.css
css/main_sm.css
css/main_md.css
css/main_lg.css
css/fontello.css
'
cat $list > min/$time.css
csso --comments none -i min/$time.css -o min/$time.min.css

cp css/main.dallas.css min/$time.dallas.css
csso --comments none -i min/$time.dallas.css -o min/$time.dallas.min.css

sleep 1;
# gzip css and js min file
echo 'commands to create gzip files:'
for i in `ls min/$time.*min.{css,js}`; do
	echo -e "\tgzip -c $i > $i.gz"
done

echo -n $time > min/min.current
