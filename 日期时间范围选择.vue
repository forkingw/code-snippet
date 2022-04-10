<template>
  <a-range-picker
    :show-time="{
      hideDisabledOptions: true,
      defaultValue: defaultBuildTimeValue,
    }"
    v-decorator="[
      'disasterFrontTime',
      { rules: [{ required: true, message: '请选择灾前上报时间！' }] },
    ]"
    allowClear
    :disabledDate="disasterDisabledDate"
    :disabledTime="disasterDisabledDateTime"
    :valueFormat="dateFormat"
  />
</template>

<script>
export default {
  data() {
    return {
      // 这里会影响日期的选择， 如果 hh , 会 格式为 12 小时制的
      dateFormat: 'YYYY-MM-DD HH:mm:ss'
    }
  },
  computed: {
    defaultBuildTimeValue() {
      // 开始时间 为当前时间， 结束时间为 23:59:00
      const startTime = moment().seconds(0);
      const endTime = moment("23:59:00", "HH:mm:ss");
      return [startTime, endTime];
    },
  },
  methods: {
    disasterDisabledDate(currentDate) {
      return currentDate && currentDate.isBefore(moment(), "d");
    },
    disasterDisabledDateTime(_, type) {
      const disableSeconddRange = range(1, 59);
      const currentHour = moment().hour();
      const disableHourRange = currentHour > 0 ? range(0, currentHour - 1) : [];
      if (type === "start") {
        return {
          disabledHours: () => disableHourRange,
          disabledSeconds: () => disableSeconddRange,
        };
      } else {
        return {
          disabledSeconds: () => disableSeconddRange,
        };
      }
    },
  },
};
</script>

<style></style>
