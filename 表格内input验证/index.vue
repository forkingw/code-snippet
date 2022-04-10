<template>
  <a-form-model class="table-form" :model="form" :rules="formRules" layout="vertical">
    <a-form-model-item prop="value">
      <a-input
        :type="type"
        :value="form.value"
        :allowClear="allowClear"
        @change="changeValue"
      />
    </a-form-model-item>
  </a-form-model>
</template>

<script>
export default {
  name: 'TableFormInput',
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: {
      type: [Number, String],
      default: 'text'
    },
    type: {
      type: String,
      default: 'text'
    },
    allowClear: {
      type: Boolean,
      default: false
    },
    rules: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      form: {
        value: this.value
      }
    }
  },
  computed: {
    formRules () {
      return {
        value: this.rules
      }
    }
  },
  methods: {
    changeValue (e) {
      const v = e.target.value
      this.form.value = v
      this.$emit('input', v)
    }
  }
}
</script>
<style lang="less" scoped>
.table-form /deep/ {
  .ant-row.ant-form-item {
    display: block;
    /deep/ .ant-col.ant-form-item-control-wrapper {
      display: block;
    }
  }
}
</style>
