# vue3   技术栈 
基于 vue3.0 + vite + antd2.0 + ts4.0 + vuex等技术搭建

# 项目地址
- https： https://github.com/zhangfeng001/hello-vue3.git
- ssh：   git@github.com:zhangfeng001/hello-vue3.git

# vue3.0 与 vue2.0比较
> vue3.0速度较vue2.0快上1.5倍至2倍，diff算法做了优化修改。

# 问题说明
- 本项目调研了一个页面出现上百个列表项的性能问题
- < 120条 -- 输入流畅
- 120条<150条 -- 轻微感觉到卡顿
- 150条<200条 -- 明显感觉到卡顿
- 300-400条 -- 卡顿在1s左右
- 400-500条 -- 无法操作页面

# 主要功能
1. 登录页
2. 列表页
3. 详情页 

# 遇到表单
序号|问题描述|解决方案
--|:--:|--:
1|生命周期引入错误|生命周期放在setup,并且需要引入才能使用
2|vuex4.0引入报错|需要使用新语法createStore、useStore
3|新语法useStore在router.js中引入时报错|需要这样引入import { useStore } from '../store'
4|公司无法连接github|解决方案地址 https://zhuanlan.zhihu.com/p/138571208

# Project setup
``` 
"dev": "vite",
"build": "vite build"
```
### 定制配置
See [Configuration Reference](https://cli.vuejs.org/config/).
