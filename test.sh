node test/specify.js  \
  | sed 's/.\[[0-9][0-9]m//g' \
  | sed 's/"at.*\(.*\)//' \
  | sed 's/took.*ms//' \
  | sed 's/"duration":[0-9]*/"duration":0/' \
  | sed 's/"_idleStart".*//' \
  | sed '/^[ \t]*$/d' \
  > test/all.log
node test/specify.js specify#throws specify#cascading_sync \
  | sed 's/.\[[0-9][0-9]m//g' \
  | sed 's/"at.*\(.*\)//' \
  | sed 's/took.*ms//' \
  | sed 's/"duration":[0-9]*/"duration":0/' \
  | sed 's/"_idleStart".*//' \
  | sed '/^[ \t]*$/d' \
  >  test/filters.log
node test/specify/singletest.js \
  | sed 's/.\[[0-9][0-9]m//g' \
  | sed 's/took.*ms//' \
  | sed 's/"duration":[0-9]*/"duration":0/' \
  | sed 's/"_idleStart".*//' \
  | sed '/^[ \t]*$/d' \
  > test/single.log
node bin/specify -e SPECIFY_REPORTER=compact \
  > test/reporter.log
node bin/specify -r compact \
  > test/reporter2.log
node bin/specify -r default \
  | sed 's/.\[[0-9][0-9]m//g' \
  | sed 's/"at.*\(.*\)//' \
  | sed 's/took.*ms//' \
  | sed 's/"duration":[0-9]*/"duration":0/' \
  | sed 's/"_idleStart".*//' \
  | sed '/^[ \t]*$/d' \
  > test/default_reporter.log
echo "all#1"
diff test/all.log test/fixtures/all.txt
if [ $? -eq 0 ]; then
  echo "filters#2"
  diff test/filters.log test/fixtures/filters.txt
  if [ $? -eq 0 ]; then
    echo "single#3"
    diff test/single.log test/fixtures/single.txt
    if [ $? -eq 0 ]; then
      echo "reporter#4"
      diff test/reporter.log test/fixtures/reporter.txt
      if [ $? -eq 0 ]; then
        echo "reporter_alt#5"
        diff test/reporter.log test/reporter2.log
        if [ $? -eq 0 ]; then
          echo "default_reporter#6"
          diff test/default_reporter.log test/fixtures/default_reporter.txt
          if [ $? -eq 0 ]; then
            echo "ok";
          else
            exit 1;
          fi
        else
          exit 1;
        fi
      else
        exit 1;
      fi
    else
      exit 1;
    fi
  else
    exit 1;
  fi
else
  exit 1;
fi