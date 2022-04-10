<template>
  <a-row type="flex">
    <a-col flex="auto">
      <a-input type="text" placeholder="请输入验证码" :value="yzm" @change="handleYzmChange" />
    </a-col>
    <a-col>
      <a-button
        class="getCaptcha"
        :disabled="yzmstate.smsSendBtn"
        @click.stop.prevent="getCaptcha"
      >{{ !yzmstate.smsSendBtn && '获取验证码' || (yzmstate.time+' s') }}
      </a-button>
    </a-col>
  </a-row>
</template>

<script>
export default {
  name: 'VerifyCode',
  props: {
    value: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      // 验证码的值
      yzm: '',
      // 验证码的状态
      yzmstate: {
        time: 60,
        smsSendBtn: false
      },
      timer: null
    }
  },
  watch: {
    value(val = {}) {
      this.yzm = val.yzm || ''
    }
  },
  methods: {
    getCaptcha (e) {
      e.preventDefault()
      // 发送验证码的逻辑在父组件中处理，需要为组件绑定一个 getCaptcha 方法
      this.$emit('getCaptcha')
    },
    handleYzmChange (e) {
      const yzm = e.target.value
      this.$emit('change', { yzm })
    },
    /**
     * 验证码发送成功按钮开始计时，并且禁用
     */
    changeToSuccesStatus () {
      const { yzmstate } = this
      this.timer = setInterval(() => {
        if (yzmstate.time-- <= 0) {
          yzmstate.time = 60
          yzmstate.smsSendBtn = false
          window.clearInterval(this.timer)
        }
      }, 1000)
    },
    /**
     * 验证码 发失败，按钮停止计时，并且变为可用
     */
    changeToFailStatus () {
      const { yzmstate } = this
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
      yzmstate.time = 60
      yzmstate.smsSendBtn = false
    }
  }
}
</script>

<style lang="less" scoped>

</style>
