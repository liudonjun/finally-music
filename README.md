# finally-music

### Vue 3 + Typescript + Vite + pinia

imooc checken music refactor Vue3 + anyScript(Typescript) + Vite + pinia

使用组合式API来编写

### 代码提交规范

- 代码提交日志规范
- Commit messages 的基本语法
- 具体格式为:<type>: <subject>
- type: 本次 commit 的类型，诸如 bugfix docs style 等
- subject: 简明扼要的阐述下本次 commit 的主旨
- Type 的类别说明
- feat: 添加新特性
- fix: 修复 bug
- docs: 仅仅修改了文档
- style: 仅仅修改了空格、格式缩进、都好等等，不改变代码逻辑
- refactor: 代码重构，没有加新功能或者修复 bug
- perf: 增加代码进行性能测试
- test: 增加测试用例
- chore: 改变构建流程、或者增加依赖库、工具等
- git commit 规范工具
- 请参考 https://blog.csdn.net/zhaileilei1/article/details/83186047

```
使用git cz 来commit 代码

  messages:{
    type:'请选择提交类型:',
    customScope:'请输入修改范围(可选):',
    subject:'请简要描述提交(必填):',
    body:'请输入详细描述(可选):',
    footer:'请输入要关闭的issue(可选):',
    confirmCommit:'确认要使用以上信息提交? (y/n)'
  },
  // 跳过步骤
  skipQuestions:['body','footer'],
```

### 效果预览
<img src="./static/prev.png">