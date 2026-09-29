# GCI Website workflow instructions

## Daily Briefing FINAL auto-publish

当用户明确确认“今日晨报定稿”或“确认今日晨报”，且晨报侧来源核验、去重和日期检查全部通过后，生成 FINAL JSON 并立即在 `globalcare-info-platform` 运行 `npm run publish-daily-briefing-final` 自动提交至现有 Publisher；不得再次询问是否发布官网，不得绕过 Publisher 或直接操作 Supabase。成功只返回 `briefing_date`、published 数量和“官网验证 PASS”；失败只返回 Publisher 的具体错误。
