<template>
  <a-drawer
    :title="title"
    :visible="visible"
    @close="onClose"
    :width="drawerConfig.drawerWidth"
  >
    <div class="drawer-content">
      <a-form
        :form="form"
        :labelCol="drawerConfig.labelCol"
        :wrapperCol="drawerConfig.wrapperCol"
      >
        <a-form-item label="所属项目">
          <a-select
            v-decorator="['project', { rules: [{ required: true, message: '请选择所属项目!' }] }]"
            allowClear
            placeholder="请选择所属项目"
          >
            <a-select-option value="2">
              所属项目1
            </a-select-option>
            <a-select-option value="3">
              所属项目2
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="版本号">
          <a-input
            v-decorator="['name', { rules: [{ required: true, message: '请输入版本号' }] }]"
            allowClear
            placeholder="请输入版本号"
          />
        </a-form-item>
        <a-form-item label="创建日期">
          <a-date-picker
            v-decorator="['creationDate', { rules: [{ required: true, message: '请选择日期' }] }]"
            allowClear
            placeholder="请选择日期"
          >
          </a-date-picker>
        </a-form-item>
        <a-form-item label="项目描述">
          <a-textarea
            v-decorator="['desc']"
            placeholder="请输入项目描述"
            :rows="4"
          />
        </a-form-item>
      </a-form>
    </div>
    <div class="drawer-bottom-button">
      <a-button :style="{ marginRight: '8px' }" @click="onClose">
        取消
      </a-button>
      <a-button type="primary" :loading="iconLoading" @click="handleSubmit">
        确定
      </a-button>
    </div>
  </a-drawer>
</template>

<script>
export default {
  // TODO name 改一下
  name: 'ProjectManageDrawer',
  data () {
    return {
      title: '',
      visible: false,
      // form: this.$form.createForm(this, { name: 'projectManage' }),
      iconLoading: false
    }
  },
  methods: {
    showDrawer () {
      // TODO 抽屉标题名称
      this.visible = true
    },
    onClose () {
      this.visible = false
    },
    handleSubmit () {
      this.form.validateFields(async (err, values) => {
        if (!err) {
          const { code, message } = await authUserSave(values)
          if (code === 0) {
            this.$message.success(message)
            this.onClose()
            this.$emit('handleQuery')
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.drawer-content {
  position: absolute;
  top: 55px;
  left: 24px;
  right: 0px;
  bottom: 65px;
  padding-right: 24px;
  overflow: auto;
}
</style>
