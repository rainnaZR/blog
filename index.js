const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const error = params => console.error(chalk.bold.red(params));
const warning = params => console.log(chalk.orange(params));
const success = params => console.log(chalk.greenBright(params));
const marked = require('marked');
const dayjs = require('dayjs');
const OUTPUT_FILE_DIRECTORY = 'docs';
const JSON_DATA_PATH = './static/data';
const CSS_DATA_PATH = './static/css';

String.prototype.interpolate = function (params) {
    const names = Object.keys(params);
    const vals = Object.values(params);
    return new Function(...names, `return \`${this}\`;`)(...vals);
};
 
function onBuildFiles({filePath}) {
    // 获取页面完整数据
    let data = onGetDocFiles({filePath, level: 0});
    // 生成数据json文件-首页
    onGetJsonData({
        data: data.children,
        path: `${JSON_DATA_PATH}/indexList.json`
    });
    // 复制样式文件
    onCopyFiles({
        filePath: CSS_DATA_PATH,
        outputFilePath: `${OUTPUT_FILE_DIRECTORY}/css`,
        fileType: 'css'
    })
    onLoadHtml({
        filePath: './static/index.html',
        outputFilePath: `${OUTPUT_FILE_DIRECTORY}`,
    });  
}

/**
 * 根据目录数据生成页面需要展示的数据
*/
function onGetJsonData({data, path}){
    let onLoopData = children => children.reduce((list, i) => {
        if(i.type == 'file'){
            return list.concat(i);
        }
        return list.concat(onLoopData(i.children||[]))
    }, []);
    fs.removeSync(path);
    fs.writeJsonSync(path, {
        data: onLoopData(data)
    });
}

/**
 * 1. 生成文件目录数据
 * 2. 将md文件转成html文件并输出
 * **/
function onGetDocFiles({filePath, level}) {
    let data = {
        type: 'directory',
        level,
        title: path.basename(filePath),
        path: filePath
    }
    let files = fs.readdirSync(filePath);
    level++;
    data.children = files.map(file => {
        let subPath = path.join(filePath, file);
        let stats = fs.statSync(subPath);
        if(stats.isDirectory()){
            return onGetDocFiles({filePath: subPath, level});
        }

        let date = dayjs(stats.mtime || stats.ctime).format('YYYY/MM/DD').split('/');
        let option = {
            type: 'file',
            level,
            date: `${date[1]}/${date[2]}`,
            year: date[0]
        };
        let ext = path.extname(file);
        if(ext == '.md'){
            let mdContent = fs.readFileSync(subPath, 'utf-8');
            let htmlContent = marked(mdContent.toString());
            let fileName = Math.random().toString(36).substr(2);
            // markdown 文件生成 html 文件
            onLoadHtml({
                filePath: './static/detail.html',
                outputFilePath: `${OUTPUT_FILE_DIRECTORY}`,
                outputFileName: fileName,
                outputFileContent: {
                    '@markdown': htmlContent
                }
            })
            return {
                ...option,
                path: `${fileName}.html`,
                title: path.basename(file, '.md'),
                introduce: `${mdContent.substr(0, 150)}......`
            }
        }
    }).filter(i => i);
    return data;
}

/**
 * 复制文件
 * **/
async function onCopyFiles ({filePath, outputFilePath, fileType}) {
    try{
        await fs.copy(filePath, outputFilePath);
        success(`==== ${fileType} 文件已成功复制到打包目录！====`);
    }catch(err){
        error(err);
    }
}

/**
 * 打包输出html文件
 * **/
function onLoadHtml({ filePath, outputFilePath, outputFileName, outputFileContent = {} }){
    let fileExt = path.extname(filePath);
    outputFileName = outputFileName || path.basename(filePath, fileExt);
    outputFilePath = `${outputFilePath}/${outputFileName}${fileExt}`;
    
    try{
        let res = fs.readFileSync(filePath, 'utf-8');
        let reg = /(@include\('(\S+)(',\s(\S+))*'\))|(@markdown)/g;
        // 找到所有的引用标签
        let tags = res.match(reg)||[];
        tags.map(i => {
            let html = '';
            // 如果是 @include 标签
            if(i.startsWith('@include')){
                let result = i.match(/@include\('(\S+)(',\s'(\S+))*'\)/);
                let tagPath = result[1];
                let jsonPath = result[3];
                html = fs.readFileSync(tagPath, 'utf-8');
                // 如果有JSON路径，就读取jons文件作为数据来源
                if(jsonPath){
                    let json = fs.readJsonSync(jsonPath);
                    html = html.interpolate(json);
                }
            }
            // 如果是 @markdown 标签
            if(i.startsWith('@markdown')){
                html = outputFileContent[i];
            } 
            res = res.replace(i, html);   
        })
        fs.removeSync(outputFilePath);
        // 当全部加载完后，生成完整html文件
        fs.outputFileSync(outputFilePath, res);
        success(`==== ${outputFilePath} 生成成功！====`); 
    }catch(err){
        error(err);
    }          
}

onBuildFiles({
    filePath: './src'
});