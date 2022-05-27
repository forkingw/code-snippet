<template>
  <page-header-wrapper :breadcrumb="{ props: { routes: $store.getters.customRoutes, itemRender: defaultItemRender } }">
    <template v-slot:extra>
      <a-button style="float: right" @click="goBack">返回</a-button>
    </template>
    <a-card>
      <a-form-model
        class="account-info-form"
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol">
        <div class="account-info-title">帐号信息</div>
        <div class="account-info-basic">
          <a-form-model-item label="企业名称" prop="corporationName">
            <a-input class="account-info-item" allowClear v-model="form.corporationName" placeholder="请输入企业名称" />
          </a-form-model-item>
          <a-form-model-item label="注册地址" :required="true">
            <a-row type="flex" :gutter="10">
              <a-col flex="130px">
                <a-form-model-item prop="registeredDistrictId" class="no-bottom-margin">
                  <a-select
                    show-search
                    option-filter-prop="children"
                    v-model="form.registeredDistrictId"
                    placeholder="区/县"
                  >
                    <a-select-option v-for="d in districtList" :value="d.areaId" :key="d.areaId">{{
                      d.areaName
                    }}</a-select-option>
                  </a-select>
                </a-form-model-item>
              </a-col>
              <a-col flex="auto">
                <a-form-model-item prop="registeredAddress" class="no-bottom-margin">
                  <a-input class="account-info-item" v-model="form.registeredAddress" placeholder="请输入公司详细注册地址" allowClear />
                </a-form-model-item>
              </a-col>
            </a-row>
          </a-form-model-item>
          <a-form-model-item label="姓名" prop="name">
            <a-input class="account-info-item" allowClear v-model="form.name" />
          </a-form-model-item>
          <a-form-model-item label="手机号码" required>
            <a-form-model-item prop="mobile" class="no-bottom-margin">
              <a-input-number class="only-number account-info-item" allowClear v-model="form.mobile" />
              <a-button class="getCaptcha" :disabled="yzmstate.smsSendBtn" @click.stop.prevent="getCaptcha">{{
                (!yzmstate.smsSendBtn && '获取验证码') || yzmstate.time + ' s'
              }}</a-button>
            </a-form-model-item>
          </a-form-model-item>
          <a-form-model-item label="短信验证码" prop="smsCode">
            <a-input-number allowClear v-model="form.smsCode" style="width: 100%;" class="account-info-item" />
          </a-form-model-item>
          <a-form-model-item label="常用邮箱" prop="mail">
            <a-input class="account-info-item" allowClear v-model="form.mail" />
          </a-form-model-item>
        </div>

        <div class="account-info-title">基本信息</div>
        <a-row>
          <a-col :span="12">
            <a-form-model-item
              label="公司类型"
              :label-col="rowLabelCol"
              :wrapper-col="rowWrapperCol"
              prop="developCompanyTypeId"
            >
              <a-select v-model="form.developCompanyTypeId" allowClear placeholder="请选择公司类型">
                <a-select-option v-for="c in companyTypeList" :value="c.optionValueId" :key="c.optionValueId">
                  {{ c.optionName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              label="企业类型"
              :label-col="rowLabelCol"
              :wrapper-col="rowWrapperCol"
              prop="corporationTypeId"
            >
              <a-select v-model="form.corporationTypeId" allowClear placeholder="请选择企业类型">
                <a-select-option v-for="c in corporationTypeList" :value="c.optionValueId" :key="c.optionValueId">{{
                  c.optionName
                }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-form-model-item label="绑定小区" prop="floorId">
          <a-select
            show-search
            :filter-option="false"
            v-model="form.floorId"
            @search="getFloorList"
            placeholder="请输入搜索"
            allowClear
          >
            <a-select-option v-for="c in floorList" :key="c.floorId" :value="c.floorId">
              {{ c.floor }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="资质证书编号" prop="licenceNumber">
          <a-input v-model="form.licenceNumber" allowClear />
        </a-form-model-item>
        <a-form-model-item label="资质等级" prop="licenceLevel">
          <a-input v-model="form.licenceLevel" allowClear />
        </a-form-model-item>
        <a-form-model-item label="资质有效期限" prop="licenceDate">
          <a-range-picker v-model="form.licenceDate" allowClear :format="dateFormat" />
        </a-form-model-item>
        <a-form-model-item label="资质证书照片" prop="licencePic">
          <div style="display: flex; align-items: center">
            <SinglePicUpload v-model="form.licencePic" folder="news" file-type="jpg/png/gif/bmp" />
            <div class="tip">
              必须为彩色图片且小于2M，文件格式为bmp、png、jepg、jpg或gif
            </div>
          </div>
        </a-form-model-item>
        <div class="account-info-title">营业执照</div>
        <a-form-model-item label="统一社会信用代码" prop="socialCreditCode">
          <a-input v-model="form.socialCreditCode" allowClear />
        </a-form-model-item>
        <a-form-model-item label="营业执照期限" :required="true">
          <a-row type="flex" :gutter="10">
            <a-col flex="1">
              <a-form-model-item prop="licenseStartTime" class="no-bottom-margin">
                <a-date-picker
                  style="width: 100%"
                  placeholder="营业开始时间"
                  v-model="form.licenseStartTime"
                  :format="dateFormat"
                  allowClear
                />
              </a-form-model-item>
            </a-col>
            <a-col>
              <span>——</span>
            </a-col>
            <a-col flex="1">
              <a-form-model-item prop="licenseEndTime" class="no-bottom-margin">
                <a-date-picker
                  style="width: 100%"
                  placeholder="营业结束时间"
                  v-model="form.licenseEndTime"
                  :format="dateFormat"
                  allowClear
                />
              </a-form-model-item>
            </a-col>
            <a-col>
              <a-checkbox v-model="form.serviceTimeLong" style="margin-left: 10px">
                长期
              </a-checkbox>
            </a-col>
          </a-row>
        </a-form-model-item>
        <a-row>
          <a-col :span="12">
            <a-form-model-item
              :label-col="rowLabelCol"
              :wrapper-col="rowWrapperCol"
              label="成立时间"
              prop="registeredDate"
            >
              <a-date-picker v-model="form.registeredDate" allowClear></a-date-picker>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item
              :label-col="rowLabelCol"
              :wrapper-col="rowWrapperCol"
              label="注册资本（万元）"
              prop="registeredCapital"
            >
              <a-input-number class="only-number" v-model="form.registeredCapital" allowClear />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-form-model-item label="营业范围" prop="businessScope">
          <a-input v-model="form.businessScope" type="textarea" :autoSize="{ minRows: 3 }" allowClear />
        </a-form-model-item>
        <a-form-model-item label="营业执照照片" prop="licensePhoto">
          <div style="display: flex; align-items: center">
            <SinglePicUpload v-model="form.licensePhoto" folder="developer" file-type="jpg/png/gif/bmp" />
            <div class="tip">
              需年检章齐全（当年成立公司除外）<br />必须为彩色图片且小于2M，文件格式为bmp、png、jepg、jpg或gif
            </div>
          </div>
        </a-form-model-item>

        <div class="account-info-title">联系人信息</div>
        <a-form-model-item label="法人代表姓名" prop="artificialPerson">
          <a-input v-model="form.artificialPerson" />
        </a-form-model-item>
        <a-form-model-item label="联系电话" prop="apMobile">
          <a-input v-model="form.apMobile" />
        </a-form-model-item>
        <a-form-model-item label="法人代表身份证号" prop="apIdCard">
          <a-input v-model="form.apIdCard" allowClear />
        </a-form-model-item>
        <a-form-model-item label="联系人姓名" prop="linkman">
          <a-input v-model="form.linkman" allowClear />
        </a-form-model-item>
        <a-form-model-item label="联系人手机号码" prop="linkmanMobile">
          <a-input-number class="only-number" v-model="form.linkmanMobile" />
        </a-form-model-item>
      </a-form-model>
      <div style="text-align: center;">
        <a-space :size="80">
          <a-button @click="goBack">取消</a-button>
          <a-button type="primary" @click="goBack">保存</a-button>
        </a-space>
      </div>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import config from '@/config/config'
import { chineseLetterReg, creditCodeReg, identityCardReg } from '@/utils/regExr'
import { glbArea, dropdownList } from '@/api/common'
import { getFloorList } from '@/api/developer.js'
import moment from 'moment'
import SinglePicUpload from './components/SinglePicUpload/index.vue'

// 注册城市默认id
const cityId = '3.3.4.'

export default {
  name: 'AddEditAccount',
  components: {
    SinglePicUpload
  },
  data () {
    // /**
    //  * 企业名称查重
    //  */
    // const checkCompany = async (rule, value, callback) => {
    //   // 企业名称不存在 或者 未选择账户类型 不进行校验
    //   if ((value !== 0 && !value) || !this.form.userType) return callback()
    //   try {
    //     const result = await checkCompanyName({
    //       cityId: '3.3.4.',
    //       corporationName: value,
    //       userType: this.form.userType
    //     })
    //     if (result.code !== 0) {
    //       callback(result.message)
    //     }
    //   } catch (error) {
    //     callback(error)
    //   }
    //   return callback()
    // }
    const handleEndTime = (rule, value, callback) => {
      const startTime = moment(this.form.licenseStartTime).format('YYYY-MM-DD')
      const diff3 = moment(value).isBefore(moment(startTime))
      if (value && diff3) {
        callback(new Error('结束时间不能早于开始时间!'))
      } else {
        callback()
      }
    }
    const handleContactInformation = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入联系电话'))
      } else if (
        !config.REGULARS.mobile.test(value) &&
        !/^(?:(?:\d{3}-)?\d{8}|^(?:\d{4}-)?\d{7,8})(?:-\d+)?$/.test(value)
      ) {
        callback(new Error('请输入正确的联系方式，手机或者座机均可!'))
      } else {
        callback()
      }
    }
    const handleMobile = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入联系人手机号码'))
      } else if (!config.REGULARS.mobile.test(value)) {
        callback(new Error('手机号格式不正确!'))
      } else {
        callback()
      }
    }
    const handleCapital = (rule, value, callback) => {
      if (value > 1000000000) {
        callback(new Error('注册资本不能超过1,000,000,000万元'))
      } else if (value <= 0) {
        callback(new Error('注册资本不能为0'))
      } else {
        callback()
      }
    }
    return {
      iconLoading: false,
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
      rowLabelCol: { span: 8 },
      rowWrapperCol: { span: 16 },
      yzmstate: {
        time: 60,
        smsSendBtn: false
      },
      form: {
        corporationName: undefined,
        registeredDistrictId: undefined,
        registeredAddress: '',
        mobile: undefined,
        smsCode: undefined,
        name: undefined,
        mail: undefined,
        developCompanyName: '',
        // developCompanyId: '',
        // 公司类型
        developCompanyTypeId: undefined,
        developCompanyType: '',

        // 企业类型
        corporationTypeId: undefined,
        corporationType: '',

        // 企业注册地址
        registeredProvinceId: '3.3.',
        registeredProvince: '浙江省',
        registeredCityId: '3.3.4.',
        registeredCity: '嘉兴市',
        registeredDistrict: '',

        floorId: undefined,
        floor: '',
        licenceNumber: '',
        licenceLevel: '',
        licenceDate: [],
        licencePic: '',

        // 营业执照相关信息
        socialCreditCode: '',
        licenseStartTime: null,
        licenseEndTime: null,
        serviceTimeLong: false,
        registeredDate: undefined,
        registeredCapital: '',
        businessScope: '',
        licensePhoto: '',

        // 联系人信息
        artificialPerson: '',
        apMobile: '',
        apIdCard: '',
        linkman: '',
        linkmanMobile: ''
      },
      rules: {
        corporationName: [
          { required: true, message: '请输入企业名称', trigger: 'blur' },
          { max: 30, message: '不能超过30个字符', trigger: ['blur', 'change'] },
          {
            required: true,
            pattern: chineseLetterReg,
            message: '仅支持汉字和字母',
            trigger: ['change', 'blur']
          }
          // {
          //   validator: checkCompany,
          //   trigger: 'blur'
          // }
        ],
        registeredDistrictId: [{ required: true, message: '请选择区县', trigger: 'change' }],
        registeredAddress: [
          { required: true, message: '请输入注册地址', trigger: 'blur' },
          { max: 50, message: '不能超过50个字符', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            required: true,
            pattern: config.REGULARS.mobile,
            message: '手机号格式不正确!',
            trigger: 'blur'
          }
        ],
        smsCode: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          {
            required: true,
            pattern: chineseLetterReg,
            message: '仅支持汉字和字母',
            trigger: ['change', 'blur']
          },
          {
            max: 10,
            message: '不能超过10个字符',
            trigger: ['change', 'blur']
          }
        ],
        developCompanyName: [{ required: true, message: '请输入企业名称', trigger: 'blur' }],
        developCompanyTypeId: [{ required: true, message: '请选择选择公司类型', trigger: 'blur' }],
        corporationTypeId: [{ required: true, message: '请选择选择企业类型', trigger: 'blur' }],
        licenceNumber: [
          { required: true, message: '请输入资质证书编号', trigger: 'blur' },
          { max: 30, message: '不能超过30个字符', trigger: ['blur', 'change'] }
        ],
        licenceLevel: [
          { required: true, message: '请输入资质等级', trigger: 'blur' },
          { max: 30, message: '不能超过30个字符', trigger: ['blur', 'change'] }
        ],
        licenceDate: [{ required: true, message: '请选择资质有效期限', trigger: 'blur' }],
        licencePic: [{ required: true, message: '请上传资质照片证书', trigger: 'change' }],

        socialCreditCode: [
          {
            required: true,
            message: '请输入统一社会信用代码',
            trigger: 'blur'
          },
          {
            required: true,
            pattern: creditCodeReg,
            message: '统一社会信用代码不正确',
            trigger: 'blur'
          }
        ],
        licenseStartTime: [{ required: true, message: '请输入营业开始时间', trigger: 'change' }],
        licenseEndTime: [{ validator: handleEndTime, trigger: 'change' }],
        // 成立时间
        registeredDate: [{ required: true, message: '请输入成立时间', trigger: 'change' }],
        registeredCapital: [
          { required: true, message: '请输入注册资本', trigger: 'blur' },
          { validator: handleCapital, trigger: 'change' }
        ],
        businessScope: [{ max: 500, message: '不能超过500个字符', trigger: ['blur', 'change'] }],
        licensePhoto: [{ required: true, message: '请上传营业执照照片', trigger: 'change' }],
        artificialPerson: [
          { required: true, message: '请输入法人代表姓名', trigger: 'blur' },
          { max: 10, message: '不能超过10个字符', trigger: ['blur', 'change'] }
        ],
        apMobile: [
          {
            required: true,
            message: '请输入联系电话',
            trigger: 'blur'
          },
          { validator: handleContactInformation, trigger: 'change' }
        ],
        apIdCard: [
          {
            pattern: identityCardReg,
            message: '法定代表人身份证号码不合法格式不正确!',
            trigger: 'blur'
          }
        ],
        linkman: [
          { required: true, message: '请输入联系人姓名', trigger: 'blur' },
          { max: 10, message: '不能超过10个字符', trigger: ['blur', 'change'] }
        ],
        linkmanMobile: [
          { required: true, message: '请输入联系人手机号码' },
          { validator: handleMobile, trigger: 'change' }
        ]
      },
      // 区县下拉列表
      districtList: [],
      companyTypeList: [],
      corporationTypeList: [],
      // 小区下拉列表
      floorList: [],
      dateFormat: 'YYYY-MM-DD'
    }
  },
  watch: {
    'form.licenceDate' (val) {
      const [licenceBeginDate, licenceEndDate] = val || []
      this.form.licenceBeginDate = licenceBeginDate?.format(this.dateFormat)
      this.form.licenceEndDate = licenceEndDate?.format(this.dateFormat)
    },
    'form.licencePic' () {
      this.$nextTick(() => {
        this.$refs.ruleForm.validateField('licencePic')
      })
    },
    'form.licensePhoto' () {
      this.$nextTick(() => {
        this.$refs.ruleForm.validateField('licensePhoto')
      })
    },
    watch: {
      'form.floorId' (val) {
        if (!val) {
          this.floorList = []
        }
      }
    }
  },
  created () {},
  methods: {
    init () {
      this.getDistricList(cityId)
      this.getCompanyTypeList()
      this.getCorporationType()
    },
    /**
     * 根据城市id获取区县列表
     */
    getDistricList (val) {
      glbArea({
        areaId: val
      }).then(res => {
        if (res.code === 0) {
          this.districtList = res.dataBody
        }
      })
    },
    getCaptcha (e) {
      e.preventDefault()
      this.$refs.ruleForm.validateField('mobile')
      const mobilevalue = this.form.mobile
      const { yzmstate } = this
      if (mobilevalue !== '' && config.REGULARS.mobile.test(mobilevalue)) {
        yzmstate.smsSendBtn = true
        const interval = window.setInterval(() => {
          if (yzmstate.time-- <= 0) {
            yzmstate.time = 60
            yzmstate.smsSendBtn = false
            window.clearInterval(interval)
          }
        }, 1000)
        // const hide = this.$message.loading('验证码发送中..', 0)
        // getSmsCaptcha({ mobile: this.form.mobile }).then(res => {
        //   hide()
        //   this.$message.success(res.message)
        // }).catch(() => {
        //   window.clearInterval(interval)
        // })
      }
    },
    /**
     * 获取公司类型下拉列表
     */
    getCompanyTypeList () {
      dropdownList('companyType')
        .then(res => {
          const { code, dataBody } = res
          if (code === 0) {
            this.companyTypeList = dataBody
          }
        })
        .catch(err => {
          this.$message(err.message)
        })
    },
    /**
     * 获取企业类型下拉列表
     */
    getCorporationType () {
      dropdownList('corporationType')
        .then(res => {
          const { code, dataBody } = res
          if (code === 0) {
            this.corporationTypeList = dataBody
          }
        })
        .catch(err => {
          this.$message(err.message)
        })
    },
    /**
     * 获取小区下拉列表
     * @param {} floor 项目备案名
     */
    getFloorList (floor) {
      if (!floor) {
        this.floorList = []
        return
      }
      getFloorList({
        // developCompanyId,
        floor
      }).then(res => {
        if (res.code === 0) {
          this.floorList = res.dataBody
        }
      })
    },
    goBack () {
      this.$router.back()
    }
  }
}
</script>

<style lang="less" scoped>
.account-info {
  &-form {
    width: 80%;
    min-width: 600px;
    max-width: 1200px;
    margin-left: 50px;
    margin-right: auto;
  }
  &-title {
    font-size: 18px;
    padding-bottom: 10px;
    font-weight: bold;
    border-bottom: 1px solid #e8e8e8;
    margin-bottom: 20px;
  }
  // &-basic {
  //   width: 650px;
  // }
  &-item {
    max-width: 450px;
  }
}
.no-bottom-margin {
  margin-bottom: 0;
}
.only-number {
  width: 100%;
  ::v-deep .ant-input-number-handler-wrap {
    display: none;
  }
}
</style>
