/**
 * 判断是否是 undefined
 * @param {*} value 需要判断的变量
 * @returns Boolean
 */
const isUndefined = (value) => value === undefined;

/**
 * 判断是否是 null
 * @param {*} value 需要判断的变量
 * @returns Boolean
 */
const isNull = (value) => value === null;

/**
 * 对象内属性 去 null 处理
 * 如果属性为 undefind 或者 为 null 则删除该属性
 */
export function pickNotNullish(obj) {
  const o = {};
  console.log(obj);
  for (const k in obj) {
    const value = obj[k];
    if (!isUndefined(value) && !isNull(value)) {
      o[k] = value;
    }
  }
  return o;
}

/**
 * 辅助 下载 的工具函数
 * @param {*} dataStream 文件流
 */
export function downloadTool(dataStream) {
  const blob = new Blob([dataStream]); // 构造一个blob对象来处理数据
  const fileName = "导出.xlsx";
  // 对于<a>标签，只有 Firefox 和 Chrome（内核） 支持 download 属性
  // IE10以上支持blob但是依然不支持download
  if ("download" in document.createElement("a")) {
    // 支持a标签download的浏览器
    const link = document.createElement("a"); // 创建a标签
    link.download = fileName; // a标签添加属性
    link.style.display = "none";
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link);
    link.click(); // 执行下载
    URL.revokeObjectURL(link.href); // 释放url
    document.body.removeChild(link); // 释放标签
  } else {
    navigator.msSaveBlob(blob, fileName);
  }
}

/**
 * 浏览器生成 uuid
 * 有兼容性限制 ie11 一下，不支持
 * @returns {String}
 */
export const UUIDGeneratorBrowser = () =>
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );

/**
 * 生成 id
 * 日期(36位) + 随机数(36位) 拼接 成的字符串
 */
export function generatorID() {
  let idStr = Date.now().toString(36);
  idStr += Math.random().toString(36).substr(3);
  return idStr;
}

/**
 * a-upload fileList 上传文件列表的对象
 */
class UpLoadFile {
  static generatorID () {
    let idStr = Date.now().toString(36)
    idStr += Math.random().toString(36).substr(3)
    return idStr
  }
  constructor ({ uid, name, status, url }) {
    if (uid) {
      this.uid = uid || UpLoadFile.generatorID()
      this.name = name
      this.status = status || 'done'
      this.url = url
    }
  }
}

/**
 * 只能输入大于等于 0 的整数
 * @param {Event} event 
 * @returns {String, Number}
 */
function getValueFromEvent (event) {
  const value = event.target.value.replace(/[^0-9]+/, '')
  if (value) {
    return parseInt(value)
  } else {
    return ''
  }
}


/**
 * checkbox 选择
 * 基于 ant-design-vue a-form 的 normalize 方法，写的
 * 全选，选择全部
 * 取消时全选， 取消全部
 * 处理全选，其他都选择时， 全选也选中
 * ! 有问题，其他控件， 也触发了这个方法
 */
function selectNoticeReceiver (value, prevValue = []) {
  if (value.length > prevValue.length) {
    // 选择
    const selectedReceiver = value.filter(v => !prevValue.includes(v))[0]
    if (selectedReceiver === this.currentAreaId || value.length === this.notificationObject.length - 1) {
      return this.notificationObject.map(n => n.areaId)
    } else {
      return value
    }
  } else if ((value.length < prevValue.length)) {
    // 取消选择
    const deselectReceiver = prevValue.filter(v => !value.includes(v))[0]
    if (deselectReceiver === this.currentAreaId) {
      return []
    } else {
      return value.filter(v => v !== this.currentAreaId)
    }
  }
  return value
}

// 空格转义字符
const space = '&nbsp;'

/**
 * 千分位处理
 */
export function handleThousandNumber (value, groupSeparator = ',') {
  const val = String(value)
  const cells = val.match(/^(-?)(\d*)(\.(\d+))?$/)
  if (!cells) {
    return value
  } else {
    const negative = cells[1]
    let int = cells[3] || '0'
    const decimal = cells[4] || ''
    int = int.replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator)
    return negative + int + decimal
  }
}
