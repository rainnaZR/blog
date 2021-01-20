原文链接: http://www.cnblogs.com/zourong/p/5962240.html

用mac开发项目，每次提交文件时都生成修改文件的.DS_Store文件，提交时会不会觉得比较烦？别急，下面给出解决方案。我们需要用到.gitignore文件去配置Git目录中需要忽略的文件。

### .gitignore文件

.gitignore文件里配置用于忽略的文件，格式如下：

1. ＃号开头的代表注释符号，会被忽略。

2. 使用标准的glob模式匹配，glob模式要点:
```
*:任意个任意字符,
[]:匹配任何一个在方括号中的字符,
?:匹配一个任意字符，
[0-9]:匹配字符范围内所有字符
```
3. 匹配模式最后的反斜杠（／）代表的是目录。

4. 要忽略指定模式以外的文件或目录，可以在模式前加上惊叹号（!）取反。

 

### 操作步骤

1. 在git目录下新建 .gitignore文件。文件内容加上：
```
*/.DS_Store
.DS_Store
```

2.  保存.gitignore文件，表示忽略当前目录的.DS_Store以及其子目录的.DS_Store。

3.  全局配置要忽略的文件，这个配置文件对所有的Git目录都生效。
```
创建~/.gitignore_global文件，把需要全局忽略的文件写入该文件，语法和.gitignore一样
在~/.gitconfig（git配置文件）中引入.gitignore_global文件
[core] 
excludesfile = /Users/project/.gitignore_global 
也可以通过git config --global core.excludesfile/Users/project/.gitignore_global命令来实现
如果已经配置过全局的忽略文件，可以通过git命令找出配置文件的目录：git config --global core.excludesfile
配置成功
```

4.  删除已经提交在git上的.DS_Store文件。使用下面的命令，先将stage中的文件删除，然后提交，再push到远端。
```
git rm --cached filename
git commit -m "delete file"
git push origin
```

文章来源

http://www.jianshu.com/p/06c32daefe0f

http://www.jianshu.com/p/8c0d262e49a6