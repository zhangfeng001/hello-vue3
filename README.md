# vue3   技术栈 
基于 vue3.0 + vite + antd2.0 + ts4.0 + vuex等技术搭建

# vue3.0 与 vue2.0比较
> vue3.0速度较vue2.0快上1.5倍至2倍，diff算法做了优化修改。

# 功能、组件的封装
- 指列表
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

## Project setup

``` 
"dev": "vite",
"build": "vite build"
```
### 定制配置
See [Configuration Reference](https://cli.vuejs.org/config/).
