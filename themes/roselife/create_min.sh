set -e

time=`date +%s`

list='
css/main_xs.css
css/main_sm.css
css/main_md.css
css/main_lg.css
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
