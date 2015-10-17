function min
{
  type=$1;
  version=$2;
  java -jar /home/web/yuicompressor-2.4.7/build/yuicompressor-2.4.7.jar -v --type $type --charset utf-8 -o min/$version.min.$type min/$version.$type;
}

time=`date +%s`;

list=`cat <<EOD
model.js
mithril.js
app.js
EOD`
cat `echo $list | tr '\n' ' '` > min/$time.js
min js $time >> min/$time.log 2>&1;

list=`cat <<EOD
normalize.css
app.css
EOD`
cat `echo $list | tr '\n' ' '` > min/$time.css
min css $time >> min/$time.log 2>&1;

sleep 1;
# gzip css and js min file
echo 'commands to create gzip files:'
for i in `ls min/$time.*min.{css,js}`; do
	echo -e "\tgzip -c $i > $i.gz";
done

echo -n $time > min/min.current
