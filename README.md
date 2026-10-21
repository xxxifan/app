# RSMotor 应用首页

独立的 Vite 静态站点。所有资源随构建产物部署，无第三方字体或图标 CDN 依赖。

## 本地开发与验证

```powershell
cd web/landing
npm ci
npm run dev
npm run format:check
npm run build
npm run preview
```

通过浏览器检查桌面及手机布局、六类外设切换、FAQ、二维码弹窗与下载链接。首屏仪表为明确标注的概念演示，不是 App 截图，也不采集真实车辆数据。二维码指向当前页面的下载区，应在线上地址检查手机访问；localhost 二维码仅用于验证绘制。

下载使用项目现有正式版网关的 `action=download&channel=release`，不保存临时签名文件地址。页面通过 `action=latest&channel=release` 展示线上版本，失败时保留直达下载链接并说明状态。Android 8.0+ 来自 App 的 minSdk 26，公开安装包当前为 arm64-v8a。以后修改最低系统要求或发布架构时，应同时更新本页。

## CloudBase 静态托管

目标环境：`rsmotor-9gtq93sed5fb9acd`，地域 `ap-shanghai`。仅上传 `dist` 到 `rsmotor/`，不改共享托管根目录、云函数和 APK 发布清单。

当前地址：<https://rsmotor-9gtq93sed5fb9acd-1314053235.tcloudbaseapp.com/rsmotor/>。

CloudBase 默认测试域名会向首次访问的浏览器显示平台的“风险提醒”确认页，需访问者手动确认。直接 HTTP 请求成功不能证明浏览器已进入首页；正式对外推广前建议绑定自己的已备案域名。当前未绑定自定义域名，也未绕过平台确认页。

在仓库根目录先核验绑定环境及目标目录：

```powershell
npx mcporter --config .\mcporter.cloudbase.json call cloudbase.auth action=status
npx mcporter --config .\mcporter.cloudbase.json call cloudbase.queryHosting action=websiteConfig
npx mcporter --config .\mcporter.cloudbase.json call cloudbase.queryHosting action=findFiles prefix=rsmotor/ maxKeys=100
```

在 `web/landing` 完成构建后，从仓库根目录部署：

```powershell
$landingDist = (Resolve-Path .\web\landing\dist).Path
npx mcporter --config .\mcporter.cloudbase.json call cloudbase.manageHosting action=upload "localPath=$landingDist" cloudPath=rsmotor
```

部署后检查工具返回的站点 URL、HTML/CSS/JS 状态码、资源哈希、在线版本加载、二维码及 APK 下载。此流程只发布首页，不运行 Android 发版脚本，不产生 Git 提交或标签。

## GitHub Pages

目标地址：<https://xxxifan.github.io/app/>。项目站点的路径固定为仓库名，因此 GitHub 仓库必须命名为 `app`。

`.github/workflows/deploy.yml` 会在推送到 `main` 时执行 `npm ci`、`npm run build` 并发布 `dist`，也可在 Actions 页面手动触发。`vite.config.js` 的 `base: "./"` 使用相对路径，同一份构建产物可同时部署在 GitHub Pages 与 CloudBase 的 `rsmotor/` 子路径下。

首次启用需在仓库 Settings → Pages 中将 Source 设为 **GitHub Actions**。

## 维护

- 页面结构：`index.html`
- 视觉与响应式样式：`src/style.css`
- 外设介绍、版本查询、二维码与动效：`src/main.js`
- App 图标：从 Android 项目的 `mipmap-xxxhdpi/ic_launcher.webp` 复制
- 格式：Prettier 默认规则，UTF-8 无 BOM
- 动效遵循 `prefers-reduced-motion`；浏览器关闭 JavaScript 时仍保留正文及下载入口
