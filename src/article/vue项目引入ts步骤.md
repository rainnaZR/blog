
最近考虑到老项目代码的可维护性以及稳定性，决定引入ts做规范检测。因为介绍的东西比较基础，如果介绍的不对，麻烦指正。


## 1. 简介

TypeScript 是 JavaScript 的一个超集，主要提供了类型系统和对 ES6 的支持。网上关于ts的学习资料很多，这里不做详细介绍。可参考的学习网站：

[https://ts.xcatliu.com/](https://ts.xcatliu.com/)

[https://typescript.bootcss.com/](https://typescript.bootcss.com/)


## 2. 安装依赖包

```
cnpm i typescript ts-loader --save-dev
```

## 3. 添加tsconfig.json文件

在项目根目录下添加 tsconfig.json 文件。tsconfig.json 文件用来指定ts的编译选项。配置可参考：[https://typescript.bootcss.com/tsconfig-json.html](https://typescript.bootcss.com/tsconfig-json.html)

项目工程 tsconfig.json 文件配置如下：（仅做参考）

```
{
    "compilerOptions": {
        "baseUrl": ".",
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true,
        "noEmitOnError": true,
        "target": "esnext",
        "module": "esnext",
        "strict": true,
        "allowJs": true,
        "noEmit": false,
        "noImplicitThis": true,
        "esModuleInterop": true,
        "sourceMap": true,
        "moduleResolution": "node"
    },
    "include": [
        "src/**/*", "types"
    ],
    "exclude": [
        "node_modules",
        "build"
    ]
}
```

## 4. webpack打包配置修改

webpack.config.js 打包文件修改，新增对.ts文件的打包配置。

### 4.1 入口文件后缀名由.js修改为.ts

```
module.exports = {
    entry: {
        app: ['@babel/polyfill', './src/main.ts']
    }
}
```

### 4.2 extensions 文件扩展名增加 .ts, .tsx 文件的支持

tsx针对react项目文件的支持，因为我们的工程基于vue开发，支持.ts文件就可以了。

```
module.exports = {
    resolve: {
        extensions: ['.js', '.vue', '.json', '.css', '.ts']
    }
}
```

### 4.3 loader增加对ts文件的支持

使用ts-loader来转换ts文件。

```
module.exports = {
    module: {
        rules: [
            {
                test: /\.ts?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                  appendTsSuffixTo: [/\.vue$/],
                }
            }
        ]
    }
}
```

## 5. eslint 添加对ts文件的检测

### 5.1 安装依赖包

```
cnpm i @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-typescript eslint-plugin-typescript --save-dev
```

@typescript-eslint/parser ts文件解析器

@typescript-eslint/eslint-plugin 版本号需要与@typescript-eslint/parser的版本一致，解析器相关的配置选项

eslint-config-typescript 针对ts项目配置的eslint检测规范


### 5.2 .eslintrc配置文件修改

.eslintrc配置文件修改，支持对ts的文件的校验。经过多次调整，我们工程的 .eslintrc 配置文件如下：

```
{
    "parserOptions": {
        "parser": "@typescript-eslint/parser",
        "project": "./tsconfig.json",
        "extraFileExtensions": [".vue"],
        "ecmaVersion": 2017,
        "sourceType": "module",
        "ecmaFeatures": {
            "modules": true
        }
    },
    "env": {
      "jest": true,
      "browser": true
    },
    "settings": {
      "import/resolver": {
        "node": {
          "extensions": [".js", ".jsx", ".ts", ".tsx", ".eslintrc"]
        },
        "webpack": {
          "config": {
            "resolve": {
              "alias": {
                "src": "src"
              }
            }
          }
        }
      }
    },
    "plugins": [
        "vue",
        "babel",
        "@typescript-eslint"
    ],
    "extends": [
        "eslint:recommended",
        "plugin:vue/base",
        "typescript",
        "standard"
    ],
    "rules": {
        "func-names": 0,
        "one-var": [1, "never"],
        "prefer-const": 1,
        "no-unused-expressions": 1,
        "new-cap": 2,
        "prefer-arrow-callback": 2,
        "arrow-body-style": 0,
        "max-len": [
            1,
            {
            "code": 200,
            "ignoreStrings": true,
            "ignoreUrls": true,
            "ignoreRegExpLiterals": true
            }
        ],
        "consistent-return": "off",
        "default-case": 2,
        "prefer-rest-params": 2,
        "no-script-url": 0,
        "no-console": [
            2,
            {
            "allow": ["info", "error", "warn", "log"]
            }
        ],
        "no-duplicate-imports": 2,
        "newline-per-chained-call": 2,
        "no-underscore-dangle": 2,
        "eol-last": 2,
        "no-useless-rename": 2,
        "class-methods-use-this": 0,
        "prefer-destructuring": 0,
        "no-unused-vars": 0,
        "@typescript-eslint/no-unused-vars": 1,
        "no-plusplus": 0,
        "import/prefer-default-export": 0,
        "import/no-dynamic-require": 2,
        "@typescript-eslint/no-var-requires": 2,
        "no-use-before-define": [
            "error",
            {
            "functions": false
            }
        ],
        "@typescript-eslint/no-use-before-define": 0,
        "@typescript-eslint/explicit-function-return-type": 0,
        "@typescript-eslint/interface-name-prefix": 0,
        "no-invalid-this": 0,
        "babel/no-invalid-this": 2,
        "no-await-in-loop": "off",
        "array-callback-return": "off",
        "no-restricted-syntax": "off",
        "@typescript-eslint/no-explicit-any": 0,
        "import/no-extraneous-dependencies": 0,
        "import/no-unresolved": 0,
        "@typescript-eslint/explicit-member-accessibility": 0,
        "@typescript-eslint/no-object-literal-type-assertion": 0,
        "no-param-reassign": [
            2,
            {
            "props": false
            }
        ],
        "generator-star-spacing": "off",
        "indent": [2, 4, {
            "SwitchCase": 1
        }],
        "eqeqeq": 0,
        "no-else-return": 2,
        "arrow-parens": 0,
        "space-before-function-paren": ["error", "never"],
        "comma-dangle": [2, "never"],
        "semi": [2, "always"]
    }
  }
```

注意"extends": ["plugin:vue/base"], 只能选择vue/base，不能用vue/recommend。不然会有规则冲突。

## 6. 项目文件转换

项目配置好后，开始对老代码进行改造，来支持ts的语法检测。

### 6.1 增加ts声明文件目录

项目中总会依赖一些资源包，或是自己开发的一些组件，这些文件需要补充声明文件，声明文件就是将多个声明语句放在一起，这些声明文件可统一放到一个目录里。这个目录需要包含在 tsconfig.json 文件的include里。

ms工程在根目录下新建 types 目录，目前包含 vue.d.ts, request.d.ts, dialog.d.ts, base.d.ts 等文件。

### 6.2 全局vue.d.ts声明文件

需要在ts环境下识别vue文件，需要添加 vue.d.ts 全局声明文件，例子如下：

```
import VueRouter, { Route } from 'vue-router';
import RequestAxios from './request';

declare module '*.vue' {
    import Vue from 'vue';
    export default Vue;
}
declare module 'vue/types/vue' {
    interface Vue {
        $router: VueRouter;
        $route: Route;
        $request: RequestAxios;
        ....
    }
}
```

### 6.2 vue文件的改造

vue文件的改造，只改造js部分，代码大致修改如下：

```
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';

@Component({
    components: {
        ....
    }
})
export default class MyComponent extends Vue {
    // prop
    @Prop({ default: () => {} }) readonly pageInfo !: any

    // data
    private showAnimation : boolean = true;

    // watch
    @Watch('showModuleIndex')
    onShowModuleIndexChanged(newValue: any) {
        this.$emit('input', newValue);
    }

    // computed
    get list() {
        const { page, cityList } = this;
        return page.cityList.split(',').map(
            cityId => cityList.find(c => String(c.id) === cityId)
        );
    }

    // mounted
    private mounted() :void {
        this.initEditor();
    }

    // methods
    private initEditor() :void {
        ....
    }
}
</script>
```

### 6.3 js文件的改造

将文件后缀名更改为.ts，然后加上类型就可以了。


## 7. 踩坑总结

大部分都是eslint校验时的报错，按照提示修复就可以了。

参考链接：
https://www.yodfz.com/detail/43/webpack%20with%20invalid%20interface%20loaded%20as%20resolver.htmlc

"vue/html-indent": [2, 4]  eslint这条规则去掉

"plugin:vue/base"与"plugin:vue/recommend"的区别

...


## 8. 总结

项目改造过程中，大部分时间都是在查配置兼容问题，配置这块解决了，改造起来速度还是挺快的。虽然前期会有一些改造成本，但是长远来看，还是有意义的。毕竟很多代码类型上的问题在开发阶段就可以暴露，不用等到运行时才发现了。