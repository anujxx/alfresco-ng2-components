#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $DIR/../../../

echo "====== Check content UP ====="

./node_modules/@alfresco/adf-cli/bin/adf-cli check-cs-env --host "$E2E_HOST" -u "$E2E_USERNAME" -p "$E2E_PASSWORD" || exit 1
