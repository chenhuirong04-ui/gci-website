# GCI Website workflow instructions

## Daily Briefing FINAL auto-publish

当用户明确确认“今日晨报定稿”或“确认今日晨报”，且晨报侧来源核验、近 7 天去重、日期和内容一致性检查全部通过后，生成 FINAL JSON，并通过 GitHub connector 创建或更新 `briefing-publish/YYYY-MM-DD.json` 后提交到 `main`；不得再次询问是否发布官网。由 GitHub Action 调用现有 Publisher，不得调用本机 npm、读取 Windows Secret、创建 GitHub Issue、绕过 Publisher 或直接操作 Supabase。成功只返回 `briefing_date`、published 数量和“官网验证 PASS”；失败只返回 Publisher 的具体错误。
