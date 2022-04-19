export default {
  computed: {
    currentAreaLevel () {
      return this.$store.getters?.userInfo?.currentAreaLevel
    },
    /**
     * 是否是物业科账号
     * 物业科一般都是区县和市级
     */
    isPropertySectionAcc () {
      return this.currentAreaLevel > 0 && this.currentAreaLevel < 3
    },
    /**
     * 是否是街道账号
     */
    isStreetAccount () {
      return this.currentAreaLevel === 3
    },
    /**
     * 是否是社区账号
     */
    isCommunityAccount () {
      return this.currentAreaLevel === 4
    },
    /**
     * 是否是总账号（超级管理员）
     */
    isSysAccount () {
      const systemManage = this.$store.getters?.userInfo?.systemManage
      return systemManage === 1
    }
  }
}
