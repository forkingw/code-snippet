<template>
  <a-space>
    <a-input-number :min="1" :max="100" v-model="score" />
    <a-popconfirm
      :disabled="!isCanScore"
      title="确定要打分吗?"
      ok-text="确定"
      cancel-text="取消"
      @confirm="confirmScore"
    >
      <a-button
        type="primary"
        shape="circle"
        icon="check"
        size="small"
        ghost
        :disabled="!isCanScore" />
    </a-popconfirm>
    <a-button
      type="danger"
      shape="circle"
      icon="close"
      size="small"
      ghost />
  </a-space>
</template>

<script>
  export default {
    name: 'ScoreInput',
    data () {
      return {
        score: undefined
      }
    },
    computed: {
      isCanScore () {
        return Boolean(this.score === 0 || this.score)
      }
    },
    methods: {
      /**
       * 确认打分
       */
      confirmScore () {
        console.log('确认打分')
        this.$emit('confirmScore', this.score)
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
