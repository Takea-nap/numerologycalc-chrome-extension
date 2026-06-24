# Agent Notes

## Source of Truth

- `lib/numerology.js` 是从 `numerologycalc/src/lib/numerology.ts` 转写而来的纯 JS 副本。
  - 任何计算逻辑、Master Number 处理、Y-as-vowel 行为变更，必须先在主站 TS 源文件中修改，再同步到本目录。
  - 只改 `lib/numerology.js` 不算完整修复；下次重新转写后改动会丢失。
- `lib/meanings.js` 来自 `numerologycalc/src/lib/meanings.ts`。
  - 插件**只保留** `shortDescription`，**故意删除** `expandedDescription`——这是驱动用户到主站阅读完整解读的设计。
  - 主站新增/修改数字含义时，记得同步本目录的 `shortDescription` 与 `title`/`keyword`/`isMaster` 字段。
- `icons/icon*.png` 应从 `numerologycalc/public/logo-mark.svg` 生成。
  - 不要再维护一套独立的简化字母图标；扩展图标需要跟主站品牌 mark 保持一致。
  - 重新生成时使用 `python3 scripts/generate-icons.py`。

## URL Slug 维护

- `popup.js` 的 `numberUrl()` 中硬编码了所有 URL slug（`life-path-number-1`、`master-number-11` 等）。
- 这些 slug 必须在主站 `src/app/` 目录中存在一一对应的路由文件夹。
- 主站新增/删除数字页面时，记得同步 `numberUrl()` 中的逻辑。

## 维护流程

1. 修改主站 `src/lib/numerology.ts` 或 `src/lib/meanings.ts`。
2. 重新转写本项目对应 `lib/*.js`。
3. 如新增/删除数字页面，更新 `popup.js` 的 `numberUrl()`。
4. 更新 `manifest.json` 的 `version` 字段。
5. 跑 `node scripts/package-release.mjs` 重新打包。
