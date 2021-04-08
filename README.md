# ctfd-pages-theme

将题目分类分页，目前用于 https://ctf.xidian.edu.cn 以及 https://ctf.show

## 食用方式

将webpack.config.js替换为仓库中的webpack.config.js
然后利用npm构建

## tldr

```sh
git clone https://github.com/CTFd/CTFd
git clone https://github.com/frankli0324/ctfd-pages-theme CTFd/themes/pages
cp CTFd/themes/pages/webpack.config.js .
npm i && npm run build
# 注意，如果CTFd是3.0.0+请切换分支
```
