# $1 -> path to restore backup from
# $2 -> database name

in=$1
if [ -z "$in" ]
then
  echo "Please pass the path from where to restore the backup!"
  exit -1
fi

db=$2
if [ -z "$db" ]
then
  db=test_db
fi

echo $db
echo $in

mongorestore --db $db $in

