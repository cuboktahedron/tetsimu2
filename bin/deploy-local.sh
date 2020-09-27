#!/bin/sh -eu

cd `dirname $0`

. ./env.sh

if [ ! "${PAGE_CONTENTS_DIR:+defined}" ]; then
  echo "Undefined environment variable 'PAGE_CONTENTS_DIR'"
  exit 1
fi

# move project root dir
cd ..

rm -rf `bash -c "echo ${PAGE_CONTENTS_DIR}/static/q/tetsimu2"`
cp -rp dist `bash -c "echo ${PAGE_CONTENTS_DIR}/static/q/tetsimu2"`
