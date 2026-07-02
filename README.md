# kkky-ai Agent Portfolio

这是 `kkky-ai` 的 AI Agent 作品集，收录内容生成、信息判断、自动化办公、线下互动装置和交互式应用相关项目。

在线作品集：

https://kkky-ai.github.io/agent-portfolio/

## 作品列表

| 项目 | 简介 | 链接 |
| --- | --- | --- |
| 真相猎人 · 女性谣言粉碎机 | 面向女性议题的智能核查与谣言拆解 Agent | https://p6z55c4yv.zhaomi.cn/ |
| 磕学家养成手册 | AI 磕 CP 模拟器，生成 CP 设子、剧情、聊天记录和图片 Prompt | https://app-c646jovqbgu9.appmiaoda.com/home |
| Hackerverse 报纸机 | 面向黑客松现场的 AI 报纸打卡装置与作品关系星图 | https://hackathon-03.onrender.com/generate |
| 飞书日报自动化 Agent | 根据满意度、老板要求和 done 自动生成日报的办公自动化 Agent | https://kkky-ai.github.io/agent-portfolio/daily-report-demo/ |
| 星标大事提醒 Agent | 重大事项日历提醒 Agent，支持多提醒节点、附件资料、图片和手机日历导出；公开链接为安全 Demo | https://kkky-ai.github.io/agent-portfolio/star-event-demo/ |

## 项目亮点

### 真相猎人 · 女性谣言粉碎机

- 围绕女性健康、职场偏见、身材容貌焦虑等高频场景做垂直核查。
- 从“生成答案”升级为“流程化核查”：议题分类、知识库检索、多维核查、结构化报告。
- 支持源头溯源、传播路径溯源、版本演变溯源。
- 双模式交互：理性分析给证据，共情守护给反驳话术和情绪支持。

### 磕学家养成手册

- 用户输入 CP 信息、人物关系、情绪风格和想看情节后，自动生成完整内容包。
- Agent 工作流包括信息补全、CP 设子、剧情创作、聊天记录、图片 Prompt、内容整合。
- 面向年轻用户的兴趣内容场景，强调即时情绪补给和可分享结果。
- 内置安全边界：虚构同人声明，不对真人关系作事实断言。

### Hackerverse 报纸机

- 线下 AI 报纸打卡装置：参赛者现场拍照/输入项目信息后，生成专属实体报纸头版。
- Poster Director Agent 负责理解项目、提炼亮点、生成可打印头版。
- 原点宇宙星图把作品化作行星、创作者化作恒星、队友关系连成星链。
- 今日头版墙沉淀现场作品，形成黑客松的作品橱窗和传播入口。

### 飞书日报自动化 Agent

在线 Demo：

https://kkky-ai.github.io/agent-portfolio/daily-report-demo/

公开仓库中只保留安全 Demo 和脱敏说明，不包含真实飞书 token、webhook、公司文档链接、个人账号 ID 等敏感配置。

真实版本能力包括：

- 自动识别日期、星期和工作周。
- 按飞书日报表格规则插入新行。
- 自动生成 Todo、假设、小结与新收获。
- 自动识别飞书文档链接和普通链接。
- 支持飞书文档写入和群机器人通知。

### 星标大事提醒 Agent

在线 Demo：

https://kkky-ai.github.io/agent-portfolio/star-event-demo/

项目仓库：

https://github.com/kkky-ai/star-event-reminder-agent

核心能力：

- 像日历一样展示准确日期，支持按日期创建单日或跨日期大事。
- 每个事件可记录事情、时间、地点、五星重要程度、备注、链接、图片和准备清单。
- 支持单个或多个提醒节点，例如提前一周、提前一天、提前数小时。
- 当天多个大事按时间从早到晚排序展示。
- 支持导出 `.ics` 手机日历文件，把事件导入手机系统日历并触发系统提醒。
- 公开作品集展示安全 Demo：数据只保存在访问者自己的浏览器，不会写入我的真实个人事项。
- 真实版部署在 Render 免费服务上用于个人使用；本地版可继续扩展飞书群提醒等自动化能力。
