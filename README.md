# Next Whois

本專案為 [`zmh-program/next-whois`](https://github.com/zmh-program/next-whois) 的 Fork 版本。

所有 Docker 版本皆基於原專案進行以下優化：

- 改用 `pnpm@11`
- 依賴套件更新至最新版
- 執行 `pnpm audit fix` 修復已知漏洞
- Docker build 流程優化
- 啟用 NextJS Standalone
  - 減少 image 體積約 80 %
- GitHub Action 建製分平台執行(amd64、arm64)
- 自動部署主分支到 [Zeabur](https://s.ccepr.dev/zeabur)

---

## Docker Image 版本說明

| Tag           | 說明                 |
| ------------- | -------------------- |
| latest / dev  | 預設版本，與上游一致 |
| cache         | Redis 優化版         |
| specialdomain | 關閉特殊網域處理     |

### 1. 預設行為（與上游一致）

[✨ 部署示例 on Zeabur 🌐who.ccepr.dev](https://who.ccepr.dev)

```bash
ghcr.io/c-c-epr/next-whois:dev
```

### 2. Redis 快取優化版本

- 啟用 Redis 連線與快取優化

```
ghcr.io/c-c-epr/next-whois:cache
```

### 3. 移除 specialDomain 特殊處理版本

- 此版本關閉 specialDomain 的特殊邏輯處理

```
ghcr.io/c-c-epr/next-whois:specialdomain
```
