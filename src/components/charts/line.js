import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  props: {
    chartdata: {
      type: Object,
      default: () => {
        return {
          datasets: []
        }
      }
    },
    options: {
      type: Object,
      default: null
    }
  },

  methods: {
    update () {
      this.$data._chart.update()
    },
    reRender () {
      this.renderChart(this.chartdata, this.options)
    }
  },

  mounted () {
    this.renderChart(this.chartdata, this.options)
  }
}