/**
 * 向上搜索元素路径。
 * @param element 起点元素。搜索会包含该元素。
 * @param callback 回调函数。在经过每一个路点时检查。
 * @returns 在回调中返回任意非 undefined 值将终止搜索，且该返回值将作为整个搜索方法的返回值。默认返回 undefined。
 */
export default function searchUpHTMLElement<T extends HTMLElement, C>(element: T, callback: (el: HTMLElement) => C)
{
    let searching_element: null | HTMLElement = element
    
    do
    {
        const result = callback(searching_element)

        if (result !== undefined) return result

        searching_element = searching_element.parentElement
    } while (searching_element)

    return undefined
}
