# electerm-vostok

基于 [electerm](https://github.com/electerm/electerm) 二次开发的 SSH 终端工具，界面向 FinalShell 看齐。

## 界面

- 顶部工具栏：新建连接、断开、SFTP 开关、监控开关、设置
- 左侧会话管理树：书签默认展开固定
- 中间多标签终端
- 终端 + 文件管理器默认分屏显示
- 底部服务器性能监控条（SSH 会话自动出现）+ 命令群发输入框
- 深蓝灰紧凑主题

![FinalShell 风格预览](finalshell-preview.png)

## 构建

```bash
npm ci --legacy-peer-deps
npm run build
```

## 版权

本项目基于 electerm 修改，原项目采用 MIT License，原作者版权声明见 [LICENSE](./LICENSE) 文件，予以保留。

原项目地址：https://github.com/electerm/electerm
