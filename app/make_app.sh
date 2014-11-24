time=`date +%s`;

if [ -d "$1" ]; then
    cp -pr $1 $1.$time
    echo "new app created: $1.$time"
else
    echo "app does not exist: $1"
fi
