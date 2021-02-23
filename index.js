const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const error = params => console.error(chalk.bold.red(params));
const warning = params => console.log(chalk.orange(params));
const success = params => console.log(chalk.greenBright(params));
const OUTPUT_FILE_DIRECTORY = 'docs';
 


const marked = require('marked');


String.prototype.interpolate = function (params) {
    const names = Object.keys(params);
    const vals = Object.values(params);
    return new Function(...names, `return \`${this}\`;`)(...vals);
};

async function copyFiles ({filePath, newFilePath, fileType}) {
    try{
        await fs.copy(filePath, newFilePath);
        success(`${fileType}文件已成功复制到打包目录！`);
    }catch(err){
        error(err);
    }
}

async function loadHtml({ filePath }){
    let fileExt = path.extname(filePath);
    let fileName = path.basename(filePath, fileExt);
    let outputPath = `${OUTPUT_FILE_DIRECTORY}/${fileName}${fileExt}`;
    let res = await fs.readFile(filePath, 'utf-8');
    let reg = /@include\('(\S+)(',\s(\S+))*'\)/g;
    // 找到所有的include标签
    let tags = res.match(reg);
    await fs.remove(outputPath);
    if(!tags || !tags.length){
        await fs.outputFile(`${OUTPUT_FILE_DIRECTORY}/${fileName}${fileExt}`, res);
        success('文件生成成功！');
        return;
    }

    let index = 0;
    let total = tags.length;
    tags.map(async i => {
        let result = i.match(/@include\('(\S+)(',\s'(\S+))*'\)/);
        let tagPath = result[1];
        let jsonPath = result[3];
        try{
            let html = await fs.readFile(tagPath, 'utf-8');
            // 如果有JSON路径，就读取jons文件作为数据来源
            if(jsonPath){
                let json = await fs.readJson(jsonPath);
                html = html.interpolate(json);
            }
            index ++;
            res = res.replace(i, html);
            if(index < total) return;
            // 当全部加载完后，生成完整html文件
            await fs.outputFile(outputPath, res);
            success('文件生成成功！');
        }catch(err){
            error(err);
        }
    })

   
    
    



    
    


    //                 // let templateStr = template.match(/\<template\>\w+/g);
    //                 let templateStr = `${data.children.map(item => {
    //                     return `<div class="blogs-item">
    //                                             <a href="${item.name}.html">目录层级${item.level}-${item.name}</a>
    //                                         </div>`;
    //                   }).join('')}`;
    //                   template = template.replace('@template', templateStr)      
    //                     fs.access('docs',(err)=>{
    //                         // 目录存在时
    //                         // if(!err) fs.rmdir('dist');
    //                         // fs.mkdir('dist', err => {
    //                             // if(err) return;
    //                             fs.writeFile('docs/index.html', template, err => {
    //                                 if(!err) console.log("success")  
    //                             })
    //                         // })
    //                     }); 
    //             }
    //         })
}

copyFiles({
    filePath: './static/css',
    newFilePath: `${OUTPUT_FILE_DIRECTORY}/css`,
    fileType: 'css'
})
loadHtml({
    filePath: './static/index.html'
});







// String.prototype.interpolate = function (params) {
//     const names = Object.keys(params);
//     const vals = Object.values(params);

//     return new Function(...names, `return \`${this}\`;`)(...vals);
// };

// function onGetFiles(filePath, level, excludeFilePath, fileExtension) {
//     let data = {
//         path: filePath,
//         name: path.basename(filePath),
//         type: 'directory',
//         level
//     };
//     let files = fs.readdirSync(filePath);
//     level ++; 
//     data.children = files.map(file => {
//         // 过滤文件
//         if(excludeFilePath.includes(file)) return;
//         // 获取文件相对路径
//         let subPath = path.join(filePath, file);  
//         // 读取文件信息对象
//         let stats = fs.statSync(subPath);
//         // 如果是文件夹
//         if(stats.isDirectory()){
//             return onGetFiles(subPath, level, excludeFilePath, fileExtension);
//         }
//         // 后缀验证
//         let ext = path.extname(file);
//         if(fileExtension && !fileExtension.includes(ext)) return;
        
//         let option = {
//             path: subPath,
//             name: file,
//             type: 'file',
//             level
//         };
//         onGetMdHtml(option);
//         return option
//     }).filter(i => i);
//     return data;
// }

// function onGetHtml(templatePath, data){
//     fs.readFile(templatePath, 'utf-8', (err, template)=>{
//         if(err){  
//             throw err;
//         }else{
//             // let templateStr = template.match(/\<template\>\w+/g);
//             let templateStr = `${data.children.map(item => {
//                 return `<div class="blogs-item">
//                                         <a href="${item.name}.html">目录层级${item.level}-${item.name}</a>
//                                     </div>`;
//               }).join('')}`;
//               template = template.replace('@template', templateStr)      
//                 fs.access('docs',(err)=>{
//                     // 目录存在时
//                     // if(!err) fs.rmdir('dist');
//                     // fs.mkdir('dist', err => {
//                         // if(err) return;
//                         fs.writeFile('docs/index.html', template, err => {
//                             if(!err) console.log("success")  
//                         })
//                     // })
//                 }); 
//         }
//     })
// }

// function onGetMdHtml({ path, name }){
//     console.log(path)
//     let templatePath = './static/template/detail.html';
//     fs.readFile(templatePath, 'utf-8', (err, template)=>{
//         console.log(template);
//         if(err){  
//             throw err;
//         }else{
//             fs.readFile(path, 'utf8', (err,markContent)=>{  
//                 if(err){  
//                     throw err  
//                 }else{  
//                     // 转化好的html字符串  
//                     let htmlStr = marked(markContent.toString())  
//                     // 将html模板文件中的 '@markdown' 替换为html字符串  
//                     template = template.replace('@markdown', htmlStr)  
//                     // 将新生成的字符串template重新写入到文件中==>模板文件地址  
//                     fs.writeFile(`docs/${name}.html`, template, err=>{  
//                         if(err){  
//                             throw err  
//                         }else{  
//                             console.log("success2")  
//                         }  
//                     })  
//                 }  
//             })
            
//         }
//     })
// }

// function init({ filePath, excludeFilePath, fileExtension, templatePath }){
//     let data = onGetFiles(filePath, 0, excludeFilePath, fileExtension);
//     let html = onGetHtml(templatePath, data);
// }

// init({
//     filePath: './src',
//     fileExtension: ['.md'],
//     excludeFilePath: [''],
//     theme: 'default',
//     templatePath: './static/template/index.html'
// })





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

/**
 * 思路
 * 1. 传入文件路径，文件格式，要排除的文件目录等
 * 2. 根据文件路径生成目录数据
 * 3. 根据目录数据生成html内容
 * 4. 根据html内容生成完整的html文件
 * 5. 定制该html文件的样式，支持样式文件和内联样式
 * 5. 启动本地服务，访问该html文件
*/
// let fs = require('fs');
// let path = require('path');

// /**
//  * options
//  *  filePath 文件路径
//  *  fileExtension 文件后缀
//  *  excludeFilePath 排除的文件路径
//  *  theme 主题样式
//  * **/
// class fileLoader {
//     constructor(options){
//         let { filePath, theme } = options;
//         this.options = options;
//         this.files = this.onGetFiles(filePath, 0);
//         this.htmlTemplate = this.onGetHtmlTemplate(this.files, theme);
//         console.log(this.htmlTemplate);
//     }

//     /**
//      * 根据文件路径生成目录数据
//     */
//     onGetFiles(filePath, level){
//         let { excludeFilePath, fileExtension}  = this.options;
//         let data = {
//             path: filePath,
//             name: path.basename(filePath),
//             type: 'directory',
//             level
//         };
//         let files = fs.readdirSync(filePath);
//         level ++; 
//         data.children = files.map(file => {
//             // 过滤文件
//             if(excludeFilePath.includes(file)) return;
//             // 获取文件相对路径
//             let subPath = path.join(filePath, file);  
//             // 读取文件信息对象
//             let stats = fs.statSync(subPath);
//             // 如果是文件夹
//             if(stats.isDirectory()){
//                 return this.onGetFiles(subPath, level);
//             }
//             // 后缀验证
//             let ext = path.extname(file);
//             if(fileExtension && !fileExtension.includes(ext)) return;
//             return {
//                 path: subPath,
//                 name: file,
//                 type: 'file',
//                 level
//             }
//         }).filter(i => i);
//         return data;
//     }

//     /**
//      * 根据目录数据生成html内容
//     */
//    onGetHtmlTemplate(files, theme = 'default'){
//        if(!files) return;
//        this.html = '';

//        return `<div class="m-blogs-${theme}">
//         <div class="blogs-title">主页${files.name}</div>
//         <div class="blogs-list">
//             ${this.onGetItemTemplate(files.children)}
//         </div>
//        </div>`;
//    }

//    /**
//     * 获取模板内容
//    */
//   onGetItemTemplate(list = []){
//     list.map(item => {
//         this.html += `<div class="blogs-item">
//                         <a href="${item.path}">目录层级${item.level}-${item.name}</a>
//                     </div>`;
//         item.children && item.children.length && this.onGetItemTemplate(item.children);
//     })
//     return this.html;
//   }
// }

// module.exports = new fileLoader({
//     filePath: './',
//     fileExtension: ['md', 'html'],
//     excludeFilePath: [''],
//     theme: 'default'
// })