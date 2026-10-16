@echo off
set TEMP=D:\temp
set TMP=D:\temp
if not exist D:\temp mkdir D:\temp
if not exist D:\npm-cache mkdir D:\npm-cache
call npm config set cache D:\npm-cache
call npm install
