#!/bin/bash

mongo -u root -p root <<EOF
rs.initiate({_id:'rs0',members:[{_id:0, host:'mongo:27017'}]});
EOF
