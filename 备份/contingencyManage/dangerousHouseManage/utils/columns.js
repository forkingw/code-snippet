import moment from 'moment'
/**
 * 上报危房
 */
export const reportHousesColumns = [
  {
    title: '危房ID',
    dataIndex: 'dilapidatedId'
  },
  {
    title: '区域/小区',
    dataIndex: 'areaName',
    scopedSlots: { customRender: 'areaName' }
  },
  {
    title: '坐落地址',
    dataIndex: 'buildingAddress',
    scopedSlots: { customRender: 'des' }
  },
  {
    title: '楼栋',
    dataIndex: 'building',
    customRender (text) {
      return text ? text + '栋' : ''
    }
  },
  {
    title: '竣工日期',
    dataIndex: 'completionDate',
    customRender (text) {
      return text ? moment(text).format('YYYY-MM-DD') : ''
    }
  },
  {
    title: '结构类型',
    dataIndex: 'buildingStructure'
  },
  {
    title: '住宅总套数/建筑层数/总建筑面积',
    dataIndex: 'buildingArea',
    customRender (text, record) {
      const infoArr = []
      const { buildingHouseCount, sumLayer, buildingArea } = record
      if (buildingHouseCount) {
        infoArr.push(`${buildingHouseCount}间`)
      }
      if (sumLayer) {
        infoArr.push(`${sumLayer}层`)
      }
      if (buildingArea) {
        infoArr.push(`${buildingArea}m²`)
      }
      return infoArr.join('/')
    }
  },
  {
    title: '创建时间',
    dataIndex: 'addTime',
    customRender (text) {
      return text ? moment(text).format('YYYY-MM-DD hh:mm:ss') : ''
    }
  },
  {
    title: '操作人',
    dataIndex: 'upReportName'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '330px',
    scopedSlots: { customRender: 'action' },
    fixed: 'right'
  }
]

/**
 * 已排查
 */
export const checkedColums = [
  {
    title: '危房ID',
    dataIndex: 'dilapidatedId'
  },
  {
    title: '区域/小区',
    dataIndex: 'areaName',
    scopedSlots: { customRender: 'areaName' }
  },
  {
    title: '坐落地址',
    dataIndex: 'buildingAddress',
    scopedSlots: { customRender: 'des' }
  },
  {
    title: '楼栋',
    dataIndex: 'building',
    customRender (text) {
      return text ? text + '栋' : ''
    }
  },
  {
    title: '排查结果',
    dataIndex: 'checkSort',
    scopedSlots: { customRender: 'checkSort' }
  },
  {
    title: '竣工日期',
    dataIndex: 'completionDate',
    customRender (text) {
      return text ? moment(text).format('YYYY-MM-DD') : ''
    }
  },
  {
    title: '结构类型',
    dataIndex: 'buildingStructure'
  },
  {
    title: '住宅总套数/建筑层数/总建筑面积',
    dataIndex: 'buildingArea',
    customRender (text, record) {
      const infoArr = []
      const { buildingHouseCount, sumLayer, buildingArea } = record
      if (buildingHouseCount) {
        infoArr.push(`${buildingHouseCount}间`)
      }
      if (sumLayer) {
        infoArr.push(`${sumLayer}层`)
      }
      if (buildingArea) {
        infoArr.push(`${buildingArea}m²`)
      }
      return infoArr.join('/')
    }
  },
  {
    title: '创建时间',
    dataIndex: 'addTime',
    customRender (text) {
      return text ? moment(text).format('YYYY-MM-DD hh:mm:ss') : ''
    }
  },
  {
    title: '操作人',
    dataIndex: 'upReportName'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '230px',
    scopedSlots: { customRender: 'action' },
    fixed: 'right'
  }
]

/**
 * 已鉴定、未解危、已解危
 */
export const identifiedColumns = [
  {
    title: '危房ID',
    dataIndex: 'dilapidatedId'
  },
  {
    title: '区域/小区',
    dataIndex: 'areaName',
    scopedSlots: { customRender: 'areaName' }
  },
  {
    title: '坐落地址',
    dataIndex: 'buildingAddress',
    scopedSlots: { customRender: 'des' }
  },
  {
    title: '楼栋',
    dataIndex: 'building',
    customRender (text) {
      return text ? text + '栋' : ''
    }
  },
  {
    title: '鉴定结论',
    dataIndex: 'dangerousGrade',
    scopedSlots: { customRender: 'dangerousGrade' }
  },
  {
    title: '竣工日期',
    dataIndex: 'completionDate',
    customRender (text) {
      return text ? moment(text).format('YYYY-MM-DD') : ''
    }
  },
  {
    title: '结构类型',
    dataIndex: 'buildingStructure'
  },
  {
    title: '住宅总套数/建筑层数/总建筑面积',
    dataIndex: 'buildingArea',
    customRender (text, record) {
      const infoArr = []
      const { buildingHouseCount, sumLayer, buildingArea } = record
      if (buildingHouseCount) {
        infoArr.push(`${buildingHouseCount}间`)
      }
      if (sumLayer) {
        infoArr.push(`${sumLayer}层`)
      }
      if (buildingArea) {
        infoArr.push(`${buildingArea}m²`)
      }
      return infoArr.join('/')
    }
  },
  {
    title: '是否治理改造完成',
    dataIndex: 'remouldCompleted',
    customRender (text) {
      return text === 1 ? '是' : '否'
    }
  },
  {
    title: '是否实质性解危',
    dataIndex: 'offDanger',
    customRender (text) {
      return text === 1 ? '是' : '否'
    }
  },
  {
    title: '创建时间',
    dataIndex: 'addTime',
    customRender (text) {
      return text ? moment(text).format('YYYY-MM-DD hh:mm:ss') : ''
    }
  },
  {
    title: '操作人',
    dataIndex: 'upReportName'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '230px',
    scopedSlots: { customRender: 'action' },
    fixed: 'right'
  }
]

/**
 * 巡查记录
 */
export const patrolColumns = [
  {
    title: '记录ID',
    dataIndex: 'patrolId'
  },
  {
    title: '巡查描述',
    dataIndex: 'patrolExplain',
    scopedSlots: { customRender: 'des' }
  },
  {
    title: '创建时间',
    dataIndex: 'addTime'
  },
  {
    title: '操作人',
    dataIndex: 'upMangeName'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' },
    fixed: 'right'
  }
]

/**
 * 处理改造记录
 */
export const modificationColumns = [
  {
    title: '记录ID',
    dataIndex: 'remouldId'
  },
  {
    title: '改造完成时间',
    dataIndex: 'remouldTime'
  },
  {
    title: '是否实质性解危',
    dataIndex: 'offDanger',
    customRender (text) {
      return text === 1 ? '是' : '否'
    }
  },
  {
    title: '创建时间',
    dataIndex: 'addTime'
  },
  {
    title: '操作人',
    dataIndex: 'upMangeNam'
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: '150px',
    scopedSlots: { customRender: 'action' },
    fixed: 'right'
  }
]
