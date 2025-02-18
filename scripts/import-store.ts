/**
 * pinia 的 store 要求必须在基于一个 Vue app 进行 createPinia() 实例化后，才可以实例化。
 * 也就是说，store 必须依赖已经实例化且关联到既有 Vue app 的 pinia 实例，才可以正常实例化。
 * 因此，此脚本需要执行很多奇技淫巧来实现模块间导入关系的正确组织。
 * 需要编译输出额外的静态文件，且对于 main.ts 有一定侵入性。
 */
import * as nodefs from "node:fs"
import * as nodepath from "node:path"
import * as _ from "lodash-es"



const ENTRY = 'src/store'
const ENTRY_ALIAS = '@/store'
const IMPORTS_OUTPUT = 'src/store.auto-imports.ts'
const NAMELIST_OUTPUT = 'src/store-namelist.auto-imports.ts'
const PROJECT_ENTRY = 'src/main.ts'

main()

function main()
{
    const paths: string[] = []

    searchFolder(paths, ENTRY, ENTRY)

    console.log('write store imports from: ------------\n', paths)

    const list_token_group: [store_name: string, useStore_name: string, import_statement: string][] = []

    paths.forEach((path) => {
        const waypoints = path.split('/')
        const waypoints_nontrivial = waypoints.at(-1) === 'index' ? waypoints.slice(0, waypoints.length - 1) : waypoints
        const module_name = ['store', ...waypoints_nontrivial].join('_')
        const import_name = ['useStore', ...waypoints_nontrivial].join('_')

        list_token_group.push([module_name, import_name, `import ${import_name} from "${ENTRY_ALIAS}/${path}"`])
    })

    const import_content =
    [
        '// auto-generated by scripts/import-store //',
        '// @ts-nocheck', // 避免编译阶段路径别名被 ts 检查。
        ...list_token_group.map(([store_name, useStore_name, import_statement]) => import_statement),
        '',
        ...[
            'export',
            '{',
            ...list_token_group.map(([store_name, useStore_name, import_statement]) => `    ${useStore_name},`),
            '}',
        ],
        '',
        ...[
            `declare module "@vue/runtime-core"`,
            `{`,
            `    export interface ComponentCustomProperties`,
            `    {`,
            ...list_token_group.map(([store_name, useStore_name, import_statement]) => `        ${store_name}: ReturnType<typeof ${useStore_name}>`),
            `    }`,
            `}`,
        ],
        '',
    ].join('\n')

    nodefs.writeFileSync(nodepath.join(nodepath.resolve(), IMPORTS_OUTPUT), import_content)

    const namelist_content =
    [
        '// auto-generated by scripts/import-store //',
        'export default ' + JSON.stringify(list_token_group.map(([store_name, useStore_name, import_statement]) => store_name), undefined, 4),
        '',
    ].join('\n')

    nodefs.writeFileSync(nodepath.join(nodepath.resolve(), NAMELIST_OUTPUT), namelist_content)

    const store_statements_in_main =
    [
        '\n// auto-generated by scripts/import-store //',
        ...list_token_group.map(([store_name, useStore_name, import_statement]) => `export const ${store_name} = stores.${useStore_name}()`),
        ...list_token_group.map(([store_name]) => `app.config.globalProperties['${store_name}'] = ${store_name}`),
        '',
    ].join('\n')

    const main_file_head_import = `import * as stores from "${toAliased(IMPORTS_OUTPUT, ['src/', '@/'])}"`
    const main_file_content = nodefs.readFileSync(PROJECT_ENTRY, 'utf8')

    const sign_start_index = main_file_content.indexOf('/// <store-auto-imports>') + '/// <store-auto-imports>'.length
    const sign_end_index = main_file_content.indexOf('/// </store-auto-imports>')

    const main_file_content_new =
    [
        main_file_content.includes(main_file_head_import) ?
            ''
            :
        `${main_file_head_import} // auto-generated by scripts/import-store\n`,
        main_file_content.slice(0, sign_start_index),
        store_statements_in_main,
        main_file_content.slice(sign_end_index),
    ].join('')

    nodefs.writeFileSync(nodepath.join(nodepath.resolve(), PROJECT_ENTRY), main_file_content_new)
}

function match(filename: string)
{
    return filename.endsWith('.ts') && !filename.includes(' ')
}

function normalizePath(path: string)
{
    let normalized = path

    normalized.replace(/\\/g, '/')

    return _.flow(
        // 统一使用正斜杠作为目录分隔符 //
        (path) => {
            return path.replace(/\\/g, '/')
        },
        // 删除文件名的后缀部分 //
        (path) => {
            const last_dot_index = path.lastIndexOf(".")
            return last_dot_index === -1 ? path : path.slice(0, last_dot_index)
        },
    )(path)
}

function searchFolder(paths: string[], entry: string, dir: string) {
    // 获取目录下的所有文件和子目录 //
    const items = nodefs.readdirSync(dir)

    items.forEach((item) => {
        const item_path = nodepath.join(dir, item)
        const item_path_relative = nodepath.relative(entry, item_path)

        // 如果是目录，则递归调用 //
        if (nodefs.statSync(item_path).isDirectory())
            searchFolder(paths, entry, item_path)
        else if (match(item))
            paths.push(normalizePath(item_path_relative))
    })
}

function toAliased(path: string, alias: [from: string, to: string])
{
    return path.startsWith(alias[0]) ? path.replace(alias[0], alias[1]) : path
}
