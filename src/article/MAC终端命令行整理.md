参考：http://www.jianshu.com/p/3291de46f3ff
http://www.cnblogs.com/zourong/p/6806440.html


## 目录操作

- cd	切换到指定目录	cd test
- ls	查看这个目录下的所有文件	ls /Users/zourong/projects/test
- pwd	显示当前目录的路径名	pwd
- mkdir	新建一个目录	mkdir test
- rmdir	删除一个目录(空目录)	rmdir test
 

## 文件操作

- cp	复制文件或目录	cp file1 file2
- rm	删除文件或目录	rm filename/rm -rf dirname
- mv	修改当前文件名或所在目录	mv filename1 filename2
- cat	显示文件的内容	cat filename
- open	用默认程序打开文件	open filename
- more	分屏显示文件的内容，不完整显示	more filename
- find	使用匹配表达式查找文件	find filename
- file	显示文件类型	file filename
 

## 选择操作

- head	显示文件的最初几行	head -20 filename
- tail	显示文件的最后几行	tail -15 filename
- diff	比较两个文件的差异	diff filename1 filename2
- comm	显示两个文件的不同点，跟diff类似	comm filename1 filename2
- wc	统计文件的字符数、词数和行数	wc filename
- nl	给文件加上行号显示出来	nl filename
 

## 其他操作

- make	执行可执行脚本，需要定义makefile.js文件	 
- touch	新建文件	touch a.js
- ps	显示进程当前状态	ps
- kill	终止进程	kill pid(进程pid)
- date	显示系统的日期和时间	date
- cal	显示日历	cal　　
- ping	给一个网络主机发送 回应请求	ping ipaddress
- history	列出最近执行过的 几条命令及编号	history
- clear	清除屏幕或窗口内容	clear
- env	显示当前所有设置过的环境变量	env
- df	显示文件系统的总空间和可用空间	df pathname