# utools-plugin-selfcheck

uTools 插件**提交审核前自查**的 Agent Skill。按 uTools 插件市场的官方审核标准，对一个插件目录做静态检查，输出「必须整改 / 建议整改」自查报告。

- 只读检查，不执行插件代码，不连接任何审核接口，不需要 token。
- 重点检查 `preload.js` 及其依赖链、`plugin.json`、logo、数据存储方式、第三方接入等。
- 自查结果仅供参考，最终以官方审核为准。

## 安装

需要 Node.js 16 及以上。

```bash
npx utools-plugin-selfcheck
```

默认自动识别本机已有的 Cursor（`~/.cursor`）、Claude Code（`~/.claude`）、GitHub Copilot（`~/.copilot`），都装到个人级 skills 目录；一个都没有时装到 `~/.agents/skills`。

指定工具或装到项目里：

```bash
npx utools-plugin-selfcheck -t claude,cursor      # 指定工具
npx utools-plugin-selfcheck -t copilot -p         # 当前项目的 .github/skills
npx utools-plugin-selfcheck -d ./my/skills        # 指定目录
npx utools-plugin-selfcheck -f                    # 覆盖升级到新版本
npx utools-plugin-selfcheck uninstall -t all      # 卸载
```

| 工具 | `-t` | 个人级目录 | 项目级目录（`-p`） |
| --- | --- | --- | --- |
| Cursor | `cursor` | `~/.cursor/skills/` | `.cursor/skills/` |
| Claude Code | `claude` | `~/.claude/skills/` | `.claude/skills/` |
| VS Code + GitHub Copilot | `copilot` | `~/.copilot/skills/` | `.github/skills/` |
| 通用 Agent Skills | `agents` | `~/.agents/skills/` | `.agents/skills/` |

也可以手动安装：把包里的 `skills/utools-plugin-selfcheck/` 目录复制到上表任一目录，目录名必须是 `utools-plugin-selfcheck`。

## 使用

安装后重启 AI 工具，在插件项目里说：

```text
帮我自查一下这个 uTools 插件，看能不能通过审核
```

AI 会读取 `plugin.json`、`preload.js` 及其依赖，给出按「必须整改 / 建议整改」分组的报告。

## 许可

MIT
