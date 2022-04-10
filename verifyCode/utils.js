/**
 * 根据 value 从 对象数组中 查找 对应的对象
 * @param {Number | String} value
 * @param {Array} list 下拉列表
 * @param {String} idFieldName id的属性名城
 * @returns {Object | undefined}
 */
 export function getObjFromList (value, list, idFieldName) {
  return list.find(l => l[idFieldName] === value)
}

/**
 * 判断是否是 undefined
 * @param {*} value 需要判断的变量
 * @returns Boolean
 */
const isUndefined = value => value === undefined

/**
 * 判断是否是 null
 * @param {*} value 需要判断的变量
 * @returns Boolean
 */
const isNull = value => value === null

/**
 * 对象内属性 去 null 处理
 * 如果属性为 undefind 或者 为 null 则删除该属性
 */
export function pickNotNullish (obj) {
  const o = {}
  console.log(obj)
  for (const k in obj) {
    const value = obj[k]
    if (!isUndefined(value) && !isNull(value)) {
      o[k] = value
    }
  }
  return o
}