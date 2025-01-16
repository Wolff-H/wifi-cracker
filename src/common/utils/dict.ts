/**
 * 接受命名定义和一个简单值字典，返回它和它的翻转字典到分别的格式化的变量名。
 * @param namespace 命名空间。
 * @param set1_name 集合1名称。
 * @param set2_name 集合2名称。
 * @param dictionary 字典（集合1 -> 集合2形式）。
 * @returns 
 * @example
 *  export const {
        dict_namespace_on_code_to_name,
        dict_namespace_on_name_to_code,
    } = dict('namespace', 'code', 'name', {
        code1: 'name1',
        code2: 'name2',
        code3: 'name3',
        code4: 'name4',
        code5: 'name5',
    })
 */
export default function dict<
    N extends string,
    N1 extends string,
    N2 extends string,
    const T extends Record<string | number, string | number>,
> (
    namespace: N,
    set1_name: N1,
    set2_name: N2,
    dictionary: T,
) {
    const reversed: Record<string | number, string | number> = {}

    for (const key in dictionary) reversed[dictionary[key]] = key

    return {
        [`dict_${namespace}_on_${set1_name}_to_${set2_name}`]: dictionary,
        [`dict_${namespace}_on_${set2_name}_to_${set1_name}`]: reversed,
    } as { [name in `dict_${N}_on_${N1}_to_${N2}`]: T } & { [name in `dict_${N}_on_${N2}_to_${N1}`]: { [K in keyof T as `${T[K]}`]: K } }
}
