
### 1. 文件路径

系统有临时目录提供给用户存储个性化数据。

- Windows: C:\User\YourName\AppData\Roaming
- Mac: /Users/YourName/Library/Appication Support/

可以调用主进程的app.getPath方法来获取用户临时存储目录。参数值如下：

- userData 获取用户临时存储目录
- home 用户根目录
- desktop
- documents
- downloads
- pictures
- music
- video
...


```
let path = app.getPath('userData');
app.setPath('userData', '...')
```

也可以通过node.js的能力来获取系统默认路径：

- require('os').homedir();
- require('os').tmpdir();

#### 写入文件数据和读取文件数据的源码如下：

```
onWriteFile(){
    let fs = window.require('fs-extra');
    let path = require('path');
    let dataPath = remote.app.getPath('userData');
    dataPath = path.join(dataPath, 'test.data.json');
    console.log('文件写入地址', dataPath);

    fs.writeFileSync(dataPath, JSON.stringify(this.dataJson), {
        encoding: 'utf8'
    })
},
onReadFile(){
    let fs = window.require('fs-extra');
    let path = require('path');
    let dataPath = remote.app.getPath('userData');
    dataPath = path.join(dataPath, 'test.data.json');

    let content = fs.readFileSync(dataPath, {
        encoding: 'utf8'
    })
    console.log('文件内容读取', content);
}
```


### 2. 浏览器技术持久化数据

- Local Storage: 容量小是硬伤
- Session Storage
- IndexDB，推荐使用，容量最大
- WebSQL
- Cookie，推荐使用

使用Dexie.js操作本地IndexDB数据库代码如下：

```
this.db = new Dexie('testDatabase');
this.db.version(1).stores({
    friends: '++id,name,age'
})

async onDatabaseModify(type){
    switch(type){
        case 'add':
            await this.db.friends.add({
                name: 'testA',
                age: 20
            })
            break;
        case 'query':
            await this.db.friends.filter(i => i.id == 1);
            break;
        case 'modify':
            await this.db.friends.put({
                id: 1,
                name: 'modifiedName'
            });
            break;
        case 'delete':
            await this.db.friends.delete(2);
            break;
    }
}
```

- 防止Cookie被第三方网站窃取，可以给cookie设置secure属性，允许cookie只能通过HTTPS安全链接传输。
- 防止XSS脚本攻击，Cookie设置HttpOnly属性，不允许脚本操作Cookie。

```
// 删除cookie的代码如下：
await remote.session.defaultSession.clearStorageData({
    storages: 'cookies, localstorage'
})
```

一般客户端不直接操作数据库，让后端开接口来访问数据库，并在后端协商好鉴权和身份验证等技术细节。如果一定要访问，可以使用knexjs工具来访问。

## 扩展阅读

- fs-extra库可以代替fs库来操作文件系统。
- lowdb是基于loadash的一个小型的json数据库。
- electron-store，基于electron设计的轻量数据库。
- Dexie库可以简化操作indexDB数据库。
- knexjs是一个SQL指令构建器，有名的数据库访问工具，node-sqlite3库基于SQLite3做封装，用来操作数据库。
- lowdb和electron-store两个工具库可以操作客户端的文件系统。