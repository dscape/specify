node test/specify.js | sed 's/.\[[0-9][0-9]m//g' > test/all.log
node test/specify.js specify#assertion_with_optional_message \
  specify#all_assertions | sed 's/.\[[0-9][0-9]m//g' >  test/filters.log
diff test/all.log test/fixtures/all.txt
if [ $? -eq 0 ]; then
  diff test/filters.log test/fixtures/filters.txt
  if [ $? -eq 0 ]; then
    echo "ok";
  else
    return -1;
  fi
else
  return -1;
fi
