## larke-admin 前端页面


### 项目介绍

*  `larke-admin` 的前端页面及菜单api接口
*  本项目为 `后台前端页面`，`后台api服务` 可查看 [Larke Admin](https://github.com/deatil/larke-admin) 项目


### 截图预览

![login](https://user-images.githubusercontent.com/24578855/101988572-71360b80-3cd5-11eb-9109-1e959f99663b.png)

![index](https://user-images.githubusercontent.com/24578855/101989891-51571580-3cde-11eb-8a6a-ec602d1eaf1c.png)

![admin](https://user-images.githubusercontent.com/24578855/101988564-6bd8c100-3cd5-11eb-8524-21151ba3b404.png)

![admin-access](https://user-images.githubusercontent.com/24578855/102609135-f3a34d00-4165-11eb-87a9-c2d98eaca02a.png)

![attach](https://user-images.githubusercontent.com/24578855/101988566-6da28480-3cd5-11eb-9532-69d88b2f598d.png)

![config](https://user-images.githubusercontent.com/24578855/101988567-6e3b1b00-3cd5-11eb-8799-66e8ebec6020.png)

![menus](https://user-images.githubusercontent.com/24578855/101988573-71cea200-3cd5-11eb-8e8b-e80ab319b216.png)

![rule2](https://user-images.githubusercontent.com/24578855/102609155-f9992e00-4165-11eb-93ad-82275af134ab.png)

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


### 特别鸣谢

感谢以下的项目,排名不分先后

 - vue

 - element-ui

 - vue-element-admin-i18n


### 开源协议

*  `larke-admin` 遵循 `Apache2` 开源协议发布，在保留本系统版权的情况下提供个人及商业免费使用。  


### 版权

*  该系统所属版权归 deatil(https://github.com/deatil) 所有。
