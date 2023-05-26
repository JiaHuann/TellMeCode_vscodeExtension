# TELL ME CODE
忙着在各种文档/博客/标签页中切换？让TellMeCode来为你推测和分析源码吧。

## 0x00 你需要准备的是：
在OpenAI的api中获取这两个东西：
- Organization ID
- API keys

[指路牌--->platform_openai](https://platform.openai.com/account)
### 获取API Keys
[指路牌--->account/api-keys](https://platform.openai.com/account/api-keys)
[![p9beizF.png](https://s1.ax1x.com/2023/05/25/p9beizF.png)](https://imgse.com/i/p9beizF)

### 获取Organization ID
[指路牌--->account/org-settings](https://platform.openai.com/account/org-settings)

[![p9beAsJ.png](https://s1.ax1x.com/2023/05/25/p9beAsJ.png)](https://imgse.com/i/p9beAsJ)

## 0x01 初始化
`ctrl+shift+p`调出vscode下拉选项命令行，分别在`TellMeCode-set-APItoken`和`TellMeCode-set-orgCode`中输入对应的token和code，就可以正常使用了

## 0x02 使用方式
1. 光标选中你要分析的代码块或某几行，按`ctrl+shift+t`触发，鼠标再次放在选中行上会看到hover提示正在加载。

2. 先选中内容，然后按`ctrl+shift+p`选中`TellMeCode`

> ps:需要科学上网，由于暂时不支持流式传输，且依赖openai，所以生成比较慢，如果在五行代码以上可能会长达20秒。

## 0x03 测试：
欢迎contribute和commit，或者反馈bug等等。测试阶段，如果你懒得弄token，可以联系我，免费提供测试使用。

mail:cheayuki13@gmail.com

QQ:1395622672