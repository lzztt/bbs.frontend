function min
{
  type=$1;
  version=$2;
  java -jar /home/web/yuicompressor-2.4.8.jar -v --type $type --charset utf-8 -o min/$version.min.$type min/$version.$type;
}

time=`date +%s`;

list=`cat <<EOD
js/jquery.cookie.js
js/jquery.imageslider.js
js/jquery.hoverIntent.js
js/jquery.superfish.js
js/jquery.markitup.js
js/jquery.markitup.bbcode.set.js
js/jquery.upload-1.0.2.js
js/main.js
EOD`
cat `echo $list | tr '\n' ' '` > min/$time.js
min js $time >> min/$time.log 2>&1;

list=`cat <<EOD
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
EOD`
cat `echo $list | tr '\n' ' '` > min/$time.css
min css $time >> min/$time.log 2>&1;

cp css/main.dallas.css min/$time.dallas.css
min css $time.dallas >> min/$time.log 2>&1;

sleep 1;
# gzip css and js min file
echo 'commands to create gzip files:'
for i in `ls min/$time.*min.{css,js}`; do
	echo -e "\tgzip -c $i > $i.gz";
done

echo -n $time > min/min.current
