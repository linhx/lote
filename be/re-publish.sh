#!/bin/bash

while getopts s:b:p: flag
do
    case "${flag}" in
        s) fesourcedir=${OPTARG};;
        b) febuilddir=${OPTARG};;
        p) fepublishdir=${OPTARG};;
    esac
done

cd $fesourcedir
npm run build
sudo rm -R $fepublishdir/* 2>/dev/null || :
sudo cp -R $febuilddir/* $fepublishdir
