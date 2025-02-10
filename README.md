# Tauri + Vue + TypeScript

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's Take Over mode by following these steps:

1. Run `Extensions: Show Built-in Extensions` from VS Code's command palette, look for `TypeScript and JavaScript Language Features`, then right click and select `Disable (Workspace)`. By default, Take Over mode will enable itself if the default TypeScript extension is disabled.
2. Reload the VS Code window by running `Developer: Reload Window` from the command palette.

You can learn more about Take Over mode [here](https://github.com/johnsoncodehk/volar/discussions/471).

# Introduction
这个项目目标制作一个通过暴力枚举破解 WiFi 密码的 GUI 工具。

## 环境需求

JavaScript 运行时 Node.js。  
JavaScript 运行时 deno。用于执行工具脚本。  
Tauri 编译所需的环境。  

## 安装

安装项目依赖 `npm install`  
安装 standalone vue-devtools `npm add -g @vue/devtools`  

## 运行

启动 vue-devtools （需要在启动应用之前，需要单开一个终端） `npx vue-devtools`  
开发模式下启动应用 `npm run tauri dev`  

## Roadmap

- [x] Project setup.
- [x] Base GUI.
- [x] Support Windows. **In Progress**
- [ ] Support macOS.
- [ ] Support Linux.

## Todos

- [x] Project framework.
- [x] Platform check.
- [x] Device nifo.
- [x] WiFi scan.
- [ ] WiFi scan statistics.
- [x] Task scheduling.
- [x] WiFi cracking.
- [ ] WiFi cracking output.
- [ ] App data persistency.

## references

- [The Rust Programming Language](https://kaisery.github.io/trpl-zh-cn/)
- [Tauri](https://tauri.app/start/)
- [crates.io](https://crates.io/)
- [Windows-RS Docs](https://microsoft.github.io/windows-docs-rs/doc/windows/)
- [Windows Wlan Commands API](https://learn.microsoft.com/zh-cn/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc755301(v=ws.10)#netsh-wlan-commands)
- [Windows Wlan Profile](https://learn.microsoft.com/en-us/uwp/schemas/mobilebroadbandschema/wlan/element-wlanprofile)
- [Top 200 Most Common Passwords](https://nordpass.com/most-common-passwords-list/)
- 生成无线网络状态报告 `netsh wlan show wlanreport`