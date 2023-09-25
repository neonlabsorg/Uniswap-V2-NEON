#!/bin/sh

# Number of attempts to compile artifacts
COUNT=10
# How long to wait between unlucky attempts
WAIT=10
# Expected directory to appear after successful compilation
DIR="artifacts"

cd /usr/src/app

for i in $(seq $COUNT)
do
  echo "Attempt number" $i
  npm run compile

  if [ -d "$DIR" ]; then
    echo "Artifacts compiled"
    break
  fi

  if [ ! "$i" -eq $COUNT ]; then
    echo "Unlucky attempt, sleep" $WAIT "seconds"
    sleep $WAIT
  fi
done

if [ ! -d "$DIR" ]; then
   echo "Can't compile artifacts"
   exit 1
fi