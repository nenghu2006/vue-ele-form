import { throttle } from 'throttle-debounce'
export default {
  props: {
    // 标签位置
    labelPosition: String,
    // 不填则响应式, 填则固定
    span: Number
  },
  data () {
    return {
      // 表单标签位置
      formLabelPosition: this.labelPosition || 'right',
      // 表单宽度
      formSpan: this.span || 22
    }
  },
  methods: {
    // window resize
    handleWindowResize () {
      if (!this.$refs.wrapper) return
      const { clientWidth } = this.$refs.wrapper
      if (clientWidth === 0) return

      let val = ''
      if (clientWidth > 1920) {
        val = 'xl'
      } else if (clientWidth > 1200) {
        val = 'lg'
      } else if (clientWidth > 992) {
        val = 'md'
      } else if (clientWidth > 768) {
        val = 'sm'
      } else {
        val = 'xs'
      }

      this.$emit('responsive', val, clientWidth)
    },

    // 处理响应式
    handleChangeResponsive (val, clientWidth) {
      let labelPosition = 'right'
      let span = 22

      if (val === 'xs') {
        labelPosition = 'top'
        span = 24
      } else {
        labelPosition = 'right'
        if (val === 'xl') {
          span = 12
        } else if (val === 'lg') {
          span = 14
        } else if (val === 'md') {
          span = 16
        } else {
          span = 18
        }
      }

      if (!this.labelPosition) {
        this.formLabelPosition = labelPosition
      }

      if (!this.span) {
        this.formSpan = span
      }
    }
  },
  mounted () {
    if (!(this.labelPosition && this.span)) {
      // 确保dom渲染完毕
      this.$nextTick(() => {
        // 监听事件
        this.$on('responsive', this.handleChangeResponsive)

        // 先触发一次, 进行初始化判定
        this.handleWindowResize()

        // 检测浏览器窗口变化, 进行响应式处理
        this.resizeFn = throttle(150, () => {
          this.handleWindowResize()
        })
        window.addEventListener('resize', this.resizeFn, false)
      })
    }
  },
  destroyed () {
    if (!(this.labelPosition && this.span)) {
      window.removeEventListener('resize', this.resizeFn, false)
      this.$off('responsive', this.handleChangeResponsive)
    }
  }
}