#!/bin/bash

while getopts s:n: flag
do
    case "${flag}" in
        s) fesourcedir=${OPTARG};;
        n) permalink=${OPTARG};;
    esac
done

cd $fesourcedir
npm run delete-note $permalink
