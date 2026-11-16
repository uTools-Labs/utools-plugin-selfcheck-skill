#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');

const NAME = 'utools-plugin-selfcheck';
const SRC = path.join(__dirname, '..', 'skills', NAME);
const TARGETS = {
  cursor: { personal: '.cursor/skills', project: '.cursor/skills' },
  claude: { personal: '.claude/skills', project: '.claude/skills' },
  copilot: { personal: '.copilot/skills', project: '.github/skills' },
  agents: { personal: '.agents/skills', project: '.agents/skills' }
};

const HELP = `用法: npx ${NAME} [install|uninstall] [选项]

把 uTools 插件自查 skill 安装到 AI 工具的 skills 目录。

选项:
  -t, --target <名称>  cursor | claude | copilot | agents | all，可用逗号分隔多个
                       （默认自动识别：已存在 ~/.cursor、~/.claude、~/.copilot 的都装）
  -p, --project        装到当前项目目录（默认装到个人主目录）
  -d, --dir <路径>     直接装到指定的 skills 目录，忽略 --target
  -f, --force          已存在时覆盖
  -h, --help           显示帮助

示例:
  npx ${NAME}                     自动识别并安装
  npx ${NAME} -t claude,cursor    装到 Claude Code 和 Cursor
  npx ${NAME} -t copilot -p       装到当前项目的 .github/skills
  npx ${NAME} uninstall -t all    全部卸载`;

function parse(argv) {
  const o = { cmd: 'install', targets: null, project: false, dir: null, force: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === 'install' || a === 'uninstall') o.cmd = a;
    else if (a === '-t' || a === '--target') o.targets = String(argv[++i] || '');
    else if (a.startsWith('--target=')) o.targets = a.slice(9);
    else if (a === '-p' || a === '--project') o.project = true;
    else if (a === '-d' || a === '--dir') o.dir = argv[++i];
    else if (a.startsWith('--dir=')) o.dir = a.slice(6);
    else if (a === '-f' || a === '--force') o.force = true;
    else if (a === '-h' || a === '--help') { console.log(HELP); process.exit(0); }
    else { console.error(`未知参数: ${a}\n\n${HELP}`); process.exit(1); }
  }
  return o;
}

function resolveDirs(o) {
  if (o.dir) return [path.resolve(o.dir)];
  const base = o.project ? process.cwd() : os.homedir();
  let names;
  if (!o.targets) {
    names = ['cursor', 'claude', 'copilot'].filter(n => fs.existsSync(path.join(os.homedir(), '.' + n)));
    if (!names.length) names = ['agents'];
  } else if (o.targets === 'all') {
    names = Object.keys(TARGETS);
  } else {
    names = o.targets.split(',').map(s => s.trim()).filter(Boolean);
    const bad = names.filter(n => !TARGETS[n]);
    if (bad.length) { console.error(`不支持的 target: ${bad.join(', ')}`); process.exit(1); }
  }
  const key = o.project ? 'project' : 'personal';
  return [...new Set(names.map(n => path.join(base, TARGETS[n][key])))];
}

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) copyDir(s, d); else fs.copyFileSync(s, d);
  }
}

function main() {
  const o = parse(process.argv.slice(2));
  let failed = 0;
  for (const dir of resolveDirs(o)) {
    const dest = path.join(dir, NAME);
    try {
      if (o.cmd === 'uninstall') {
        if (fs.existsSync(dest)) { fs.rmSync(dest, { recursive: true, force: true }); console.log(`已卸载  ${dest}`); }
        else console.log(`未安装  ${dest}`);
        continue;
      }
      if (fs.existsSync(dest)) {
        if (!o.force) { console.log(`已存在  ${dest}（加 --force 覆盖）`); continue; }
        fs.rmSync(dest, { recursive: true, force: true });
      }
      copyDir(SRC, dest);
      console.log(`已安装  ${dest}`);
    } catch (err) {
      failed++;
      console.error(`失败    ${dest}: ${err.message}`);
    }
  }
  if (o.cmd === 'install' && !failed) console.log('\n重启 AI 工具后，说「帮我自查这个 uTools 插件」即可使用。');
  process.exit(failed ? 1 : 0);
}

main();
