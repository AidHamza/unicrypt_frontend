import { Doughnut } from 'vue-chartjs'

export default {
  extends: Doughnut,
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
    var grad1 = this.$refs.canvas.getContext('2d').createLinearGradient(0, 0, 0, 450)
    var grad2 = this.$refs.canvas.getContext('2d').createLinearGradient(0, 0, 0, 450)
    var grad3 = this.$refs.canvas.getContext('2d').createLinearGradient(0, 0, 0, 450)
    var grad4 = this.$refs.canvas.getContext('2d').createLinearGradient(0, 0, 0, 450)
    // var grad3 = this.$refs.canvas.getContext('2d').createLinearGradient(0, 0, 0, 450)
    grad1.addColorStop(0, "rgba(198,104,243, 0.9)")
    grad1.addColorStop(1, "rgba(85,34,130, 0.5)")

    grad2.addColorStop(0, "rgba(0,190,249, 0.9)")
    grad2.addColorStop(1, "rgba(45,84,142, 0.7)")

    grad3.addColorStop(0, "rgba(20,249,210, 0.9)")
    grad3.addColorStop(1, "rgba(45,84,142, 0.7)")

    grad4.addColorStop(0, "rgba(20,255,180, 0.9)")
    grad4.addColorStop(1, "rgba(20,255,60, 0.7)")

    this.chartdata.datasets[0].backgroundColor[0] = grad1
    this.chartdata.datasets[0].backgroundColor[1] = grad2
    this.chartdata.datasets[0].backgroundColor[2] = grad3
    this.chartdata.datasets[0].backgroundColor[3] = grad4
    // this.chartdata.datasets[0].backgroundColor[2] = grad3
    this.renderChart(this.chartdata, this.options)
  }
}