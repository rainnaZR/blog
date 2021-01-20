const fs = require('fs');
const path = require('path');
const marked = require('marked');

String.prototype.interpolate = function (params) {
    const names = Object.keys(params);
    const vals = Object.values(params);

    return new Function(...names, `return \`${this}\`;`)(...vals);
};

function onGetFiles(filePath, level, excludeFilePath, fileExtension) {
    let data = {
        path: filePath,
        name: path.basename(filePath),
        type: 'directory',
        level
    };
    let files = fs.readdirSync(filePath);
    level ++; 
    data.children = files.map(file => {
        // 过滤文件
        if(excludeFilePath.includes(file)) return;
        // 获取文件相对路径
        let subPath = path.join(filePath, file);  
        // 读取文件信息对象
        let stats = fs.statSync(subPath);
        // 如果是文件夹
        if(stats.isDirectory()){
            return onGetFiles(subPath, level, excludeFilePath, fileExtension);
        }
        // 后缀验证
        let ext = path.extname(file);
        if(fileExtension && !fileExtension.includes(ext)) return;
        
        let option = {
            path: subPath,
            name: file,
            type: 'file',
            level
        };
        onGetMdHtml(option);
        return option
    }).filter(i => i);
    return data;
}

function onGetHtml(templatePath, data){
    fs.readFile(templatePath, 'utf-8', (err, template)=>{
        if(err){  
            throw err;
        }else{
            // let templateStr = template.match(/\<template\>\w+/g);
            let templateStr = `${data.children.map(item => {
                return `<div class="blogs-item">
                                        <a href="${item.name}.html">目录层级${item.level}-${item.name}</a>
                                    </div>`;
              }).join('')}`;
              template = template.replace('@template', templateStr)      
                fs.access('docs',(err)=>{
                    // 目录存在时
                    // if(!err) fs.rmdir('dist');
                    // fs.mkdir('dist', err => {
                        // if(err) return;
                        fs.writeFile('docs/index.html', template, err => {
                            if(!err) console.log("success")  
                        })
                    // })
                }); 
        }
    })
}

function onGetMdHtml({ path, name }){
    console.log(path)
    let templatePath = './static/template/detail.html';
    fs.readFile(templatePath, 'utf-8', (err, template)=>{
        console.log(template);
        if(err){  
            throw err;
        }else{
            fs.readFile(path, 'utf8', (err,markContent)=>{  
                if(err){  
                    throw err  
                }else{  
                    // 转化好的html字符串  
                    let htmlStr = marked(markContent.toString())  
                    // 将html模板文件中的 '@markdown' 替换为html字符串  
                    template = template.replace('@markdown', htmlStr)  
                    // 将新生成的字符串template重新写入到文件中==>模板文件地址  
                    fs.writeFile(`docs/${name}.html`, template, err=>{  
                        if(err){  
                            throw err  
                        }else{  
                            console.log("success2")  
                        }  
                    })  
                }  
            })
            
        }
    })
}

function init({ filePath, excludeFilePath, fileExtension, templatePath }){
    let data = onGetFiles(filePath, 0, excludeFilePath, fileExtension);
    let html = onGetHtml(templatePath, data);
}

init({
    filePath: './src',
    fileExtension: ['.md'],
    excludeFilePath: [''],
    theme: 'default',
    templatePath: './static/template/index.html'
})





// const fs = require('fs');
// const marked = require('marked');



// // 模板文件地址
// fs.readFile('./template.html', 'utf8', (err, template)=>{  
//     if(err){  
//         throw err  
//     }else{  
//         // 源文件地址
//         fs.readFile('./src/test.md', 'utf8', (err,markContent)=>{  
//             if(err){  
//                 throw err  
//             }else{  
//                 // 转化好的html字符串  
//                 let htmlStr = marked(markContent.toString())  
//                 // 将html模板文件中的 '@markdown' 替换为html字符串  
//                 template = template.replace('@markdown', htmlStr)  
//                 // 将新生成的字符串template重新写入到文件中==>模板文件地址  
//                 fs.writeFile('./index.html', template, err=>{  
//                     if(err){  
//                         throw err  
//                     }else{  
//                         console.log("success")  
//                     }  
//                 })  
//             }  
//         })  
//     }  
// })