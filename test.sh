node test/specify.js | sed 's/.\[[0-9][0-9]m//g' | sed 's/"at.*\(.*\)//' \
  > test/all.log
node test/specify.js specify#throws specify#cascading_sync \
  | sed 's/.\[[0-9][0-9]m//g' | sed 's/"at.*\(.*\)//' >  test/filters.log
node test/singletest.js | sed 's/.\[[0-9][0-9]m//g' > test/single.log
diff test/all.log test/fixtures/all.txt
if [ $? -eq 0 ]; then
  diff test/filters.log test/fixtures/filters.txt
  if [ $? -eq 0 ]; then
    diff test/single.log test/fixtures/single.txt
    if [ $? -eq 0 ]; then
      echo "ok";
    else
      return -1;
    fi
  else
    return -1;
  fi
else
  return -1;
fi