#!/bin/bash

while getopts s: flag
do
    case "${flag}" in
        s) fesourcedir=${OPTARG};;
    esac
done

cd $fesourcedir
npm run deploy
