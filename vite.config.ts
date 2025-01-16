import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import UnpluginAutoImport from 'unplugin-auto-import/vite'
import UnpluginVueComponents from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import * as path from "node:path"
import getLocalIP from "./utils/getLocalIP"
import store_export_names from "./src/store-namelist.auto-imports"
import { createHtmlPlugin } from "vite-plugin-html"



const host = process.env.TAURI_DEV_HOST

// https://vitejs.dev/config/
export default defineConfig(async ({ command, mode }) => {
console.log('mode :', mode);
    
    return {
        base: './',
        resolve:
        {
            alias:
            {
                '@': path.resolve(__dirname, "./src"),
            },
        },
        plugins:
        [
            vue(),
            UnpluginAutoImport({
                dts: true,
                eslintrc: {
                    enabled: true,
                },
                imports: [
                    // presets //
                    'vue',
                    'vue-router',
                    // global-imports //
                    {
                        '@/global-imports':
                        [
                            '_',
                            'clone',
                            'cloneShallow',
                            'router',
                            'route',
                        ],
                    },
                    {
                        '@/main': store_export_names,
                    },
                    {
                        '@/api.auto-imports':
                        [
                            ['default', 'API'],
                        ],
                    },
                ],
                resolvers: [ElementPlusResolver()],
            }),
            UnpluginVueComponents({
                resolvers: [ElementPlusResolver()],
            }),
            createHtmlPlugin({
                inject:
                {
                    data:
                    {
                        vue_devtools_import: mode === 'development'? '<script src="http://localhost:8098"></script>' : '',
                    },
                },
            })
        ],
        css:
        {
            preprocessorOptions:
            {
                stylus:
                {
                    globals:
                    {
                        '_colorset': path.resolve('src/assets/stylesheets/colorset/index.styl'),
                        '_patterns': path.resolve('src/assets/stylesheets/patterns/index.styl'),
                    },
                },
            },
        },
    
        // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
        //
        // 1. prevent vite from obscuring rust errors
        clearScreen: false,
        // 2. tauri expects a fixed port, fail if that port is not available
        server: {
            port: 1420,
            strictPort: true,
            host: host || false,
            hmr: host
                ? {
                    protocol: "ws",
                    host,
                    port: 1421,
                }
                : undefined,
            watch: {
                // 3. tell vite to ignore watching `src-tauri`
                ignored: ["**/src-tauri/**"],
            },
        },
    }
})
