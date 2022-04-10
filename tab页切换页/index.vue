<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <a-tabs :activeKey="activeKey" @change="tabsChange">
        <a-tab-pane key="1" tab="公共视图">
          <BoardDetail v-if="activeKey === '1'" :ifPublic="1" :isClose="1" />
        </a-tab-pane>
        <a-tab-pane key="0" tab="我的视图">
          <BoardDetail v-if="activeKey === '0'" :ifPublic="0" :isClose="1" />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </page-header-wrapper>
</template>

<script>
import BoardDetail from './module/BoardDetail.vue'
  export default {
    name: 'BulletinBoard',
    components: {
      BoardDetail
    },
    // data () {
    //   return {
    //     // activeKey: 1
    //   }
    // },
    computed: {
      activeKey () {
        return this.$route.query.key
      }
    },
    beforeRouteEnter (to, from, next) {
      if (to.query.key) {
        next()
      } else {
        next({ path: to.path, query: { key: '1' } })
      }
    },
    methods: {
      tabsChange (activeKey) {
        this.$router.replace({
          path: this.$route.path,
          query: {
            key: activeKey
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
