#!/bin/bash

while getopts s:b:p: flag
do
    case "${flag}" in
        s) fesourcedir=${OPTARG};;
        b) fenotebuilddir=${OPTARG};;
        p) fepublishdir=${OPTARG};;
    esac
done

cd $fesourcedir
npm run build-note
sudo cp -R $fenotebuilddir/* $fepublishdir
