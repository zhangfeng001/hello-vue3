# 项目组 - A
### vue3 技术栈 
基于 vue3.0 + vue-cli + element-plus + js + vuex等技术搭建

### 项目地址
- https： https://gitlab.com/zhangfenggitlab/demo-vue3
- ssh:    git@gitlab.com:zhangfenggitlab/demo-vue3.git
- 
### 分支说明
- master 主干
- develop为开发分支
- 暂无其他分支
- 
### 项目启动与打包
``` 
"serve": "vue-cli-service serve",
"dev": "vue-cli-service serve",
"build": "vue-cli-service build"
```

# 项目组 B
### vue3 技术栈 
基于 vue3.0 + vite + antd2.0 + ts4.0 + vuex等技术搭建
### 项目地址
- https： https://github.com/zhangfeng001/hello-vue3.git
- ssh：   git@github.com:zhangfeng001/hello-vue3.git

<<<<<<< HEAD
# 分支说明
=======
### 分支说明
>>>>>>> develop
- main 主干
- develop为开发分支
- 暂无其他分支
- 
### 项目启动与打包
``` 
"dev": "vite",
"build": "vite build"
```

# 以下A、B组相同 
### vue3.0 与 vue2.0比较
> vue3.0速度较vue2.0快上1.5倍至2倍，diff算法做了优化修改。

### 问题说明
- 本项目调研了一个页面出现上百个列表项的性能问题
- < 120条 -- 输入流畅
- 120条<150条 -- 轻微感觉到卡顿
- 150条<200条 -- 明显感觉到卡顿
- 300-400条 -- 卡顿在1s左右
- 400-500条 -- 无法操作页面

### 主要功能
1. 登录页
2. 列表页
3. 详情页 

### 问题表单
序号|问题描述|解决方案
--|:--:|--:
1|生命周期引入错误|生命周期放在setup,并且需要引入才能使用
2|vuex4.0引入报错|需要使用新语法getCurrentInstance
3|新语法useStore在router.js中引入时报错|需要这样引入import { useStore } from '../store'
4|reactive声明的基本数据类型 当数据改变后不会响应式更新|推荐声明复杂数据类型用reactive，简单数据类型用ref可以响应式更新 (ref本质也是reactive) 
5|reactive 修改值不会响应式更新| 如const ruleForm = reactive({ username: ""}) 需要ruleForm.username='123'才会响应式更新，ruleForm={}页面不会响应式更新 且reactive声明的变量会递归监听
6|公司无法连接github|解决方案地址 https://blog.csdn.net/secular_/article/details/108472861


### 定制配置
See [Configuration Reference](https://cli.vuejs.org/config/).
