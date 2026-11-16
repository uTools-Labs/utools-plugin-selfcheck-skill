# utools-plugin-selfcheck

uTools 插件**提交审核前自查**的 Agent Skill。按 uTools 插件市场的官方审核标准，对一个插件目录做静态检查，输出「必须整改 / 建议整改」自查报告。

- 只读检查，不执行插件代码，不连接任何审核接口，不需要 token。
- 重点检查 `preload.js` 及其依赖链、`plugin.json`、logo、数据存储方式、第三方接入等。
- 自查结果仅供参考，最终以官方审核为准。

## 安装

需要 Node.js 18 及以上，用 [skills](https://github.com/vercel-labs/skills) 安装：

```bash
npx skills add uTools-Labs/utools-plugin-selfcheck-skill
```

按提示选择要安装到的 AI 工具（Cursor、Claude Code、GitHub Copilot 等）和安装范围即可。常用参数：

```bash
npx skills add uTools-Labs/utools-plugin-selfcheck-skill -g          # 装到个人目录，所有项目可用
npx skills add uTools-Labs/utools-plugin-selfcheck-skill -a cursor   # 只装到指定工具
npx skills update utools-plugin-selfcheck                            # 升级到最新版
npx skills remove utools-plugin-selfcheck                            # 卸载
```

也可以手动安装：把本仓库的 `skills/utools-plugin-selfcheck/` 目录复制到 AI 工具的 skills 目录（如 `~/.cursor/skills/`、`~/.claude/skills/`、`.github/skills/`），目录名必须是 `utools-plugin-selfcheck`。

## 使用

安装后重启 AI 工具，在插件项目里说：

```text
帮我自查一下这个 uTools 插件，看能不能通过审核
```

AI 会读取 `plugin.json`、`preload.js` 及其依赖，给出按「必须整改 / 建议整改」分组的报告。

## 许可

MIT
