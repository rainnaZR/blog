在windows环境下，git提交文件时，默认对文件名大小写不敏感，若修改了文件名字的大小写，可能会导致提交时没有记录，文件名修改不成功。网上搜集了几种解决方法，现总结下：
http://www.cnblogs.com/zourong/p/6250106.html
 

### 1. 修改git config的配置

git config core.ignorecase false
经测试，发现当修改文件名字的大小写并提交后，git status里并没有删除文件的操作，只有新增操作。也就是git上的文件并没有直接替换，而是新增了一份。

 

### 2. 先删除旧文件，然后新增文件

```javascript
git rm fileNames

git add newFileNames

git commit -m 'MISC:add files'

git push origin
```
经测试，此方法有效。
