## larke-admin 前端页面


### 项目介绍

*  `larke-admin` 的前端页面及菜单api接口
*  框架为 `vue2` 和 `element-ui`
*  本项目为 `后台前端页面`，`后台api服务` 可查看 [Larke Admin](https://github.com/deatil/larke-admin) 项目


### 截图预览

<table>
    <tr>
        <td width="50%">
            <center>
                <img alt="login" src="https://user-images.githubusercontent.com/24578855/103483910-8cec8780-4e25-11eb-93c5-ea7ce7a09b60.png" />
            </center>
        </td>
        <td width="50%">
            <center>
                <img alt="index" src="https://user-images.githubusercontent.com/24578855/105568367-cacd3380-5d73-11eb-98ab-55701d0068ed.png" />
            </center>
        </td>
    </tr>
    <tr>
        <td width="50%">
            <center>
                <img alt="admin" src="https://user-images.githubusercontent.com/24578855/101988564-6bd8c100-3cd5-11eb-8524-21151ba3b404.png" />
            </center>
        </td>
        <td width="50%">
            <center>
                <img alt="admin-access" src="https://user-images.githubusercontent.com/24578855/103433753-db393500-4c31-11eb-8d8a-b40dfa0db84e.png" />
            </center>
        </td>
    </tr>
    <tr>
        <td width="50%">
            <center>
                <img alt="attach" src="https://user-images.githubusercontent.com/24578855/101988566-6da28480-3cd5-11eb-9532-69d88b2f598d.png" />
            </center>
        </td>
        <td width="50%">
            <center>
                <img alt="config" src="https://user-images.githubusercontent.com/24578855/101988567-6e3b1b00-3cd5-11eb-8799-66e8ebec6020.png" />
            </center>
        </td>
    </tr>
    <tr>
        <td width="50%">
            <center>
                <img alt="menus" src="https://user-images.githubusercontent.com/24578855/101988573-71cea200-3cd5-11eb-8e8b-e80ab319b216.png" />
            </center>
        </td>
        <td width="50%">
            <center>
                <img alt="rule2" src="https://user-images.githubusercontent.com/24578855/102609155-f9992e00-4165-11eb-93ad-82275af134ab.png" />
            </center>
        </td>
    </tr>
</table>

更多截图 
[Larke Admin 后台截图](https://github.com/deatil/larke-admin/issues/1)


### 安装步骤

1. 开始执行以下命令安装前端扩展包

```php
composer require lake/larke-admin-frontend
```

2. 然后运行下面的命令，推送配置文件及静态文件

```php
php artisan vendor:publish --tag=larke-admin-frontend-config
```

```php
php artisan vendor:publish --tag=larke-admin-frontend-assets
```

运行命令后，你可以在 `public/admin` 下发现前端文件

你也可以找到 `config/frontend.php` 配置文件

3. 你可能第一次安装需要运行以下命令更新前端适配菜单信息

```php
php artisan larke-admin-frontend:import-menus --force
```

4. 你可以替换前端文件为你自己的打包好的前端文件

菜单接口可根据包提供的接口更改为适合你的菜单字段

5. 前端编译文档可以查看文档 `public/admin/README.zh-CN.md`

在编译前你需要复制 `.env.development.larke` 重命名为 `.env.development`，复制 `vue.config.js.larke` 重命名为 `vue.config.js`

6. 当前编译环境

 - node v9.9.0
 
 - npm 6.14.8


### 扩展推荐

| 名称 | 描述 |
| --- | --- |
| [demo](https://github.com/deatil/larke-admin-demo) | 扩展示例 |
| [签名证书](https://github.com/deatil/larke-admin-signcert) | 生成RSA,EDDSA,ECDSA等非对称签名证书 |
| [日志查看器](https://github.com/deatil/larke-admin-logviewer) | laravel日志查看扩展 |

注：扩展目录默认为 `/extension` 目录


### 特别鸣谢

感谢以下的项目,排名不分先后

 - vue

 - element-ui

 - vue-element-admin


### 开源协议

*  `larke-admin` 遵循 `Apache2` 开源协议发布，在保留本系统版权的情况下提供个人及商业免费使用。  


### 版权

*  该系统所属版权归 deatil(https://github.com/deatil) 所有。
