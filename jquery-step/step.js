(function ($, window, document, undefined) {
  function Step(el, opts) {
    this.$el = $(el),
    this.defaults = {
      'stepCount': 3,
      'stepTitles': ['标题一', '标题二', '标题三'],
      'stepContent': '.eis-stepContents',
      'stepDirection': 'x',
      // 'showStepButton': false,
      'currentStep': 0
    }
    this.settings = $.extend({}, this.defaults, opts)
  }
  Step.prototype = {
    'init': function () {
      var that = this,
        $stepBox = that.$el
      // 初始化步骤条

      function _initStepBar(direct, currentStep) {
        var stepHtml = $('<div class="eis-form-steps"></div>'),
          stepBarHtml = ''

        if (direct === 'x') {
          for (var i = 0; i < that.settings.stepCount; i++) {
            if (i === that.settings.stepCount - 1) {
              stepBarHtml +=
                `<div class="eis-form-step" style="width:${(
                  100 / that.settings.stepCount
                ).toFixed(2)}%">\n` +
                '            <div class="eis-step-head">\n' +
                '                <div class="eis-step-icon">\n' +
                `                    <div class="step-icon-txt">${i + 1
                }</div>\n` +
                '                </div>\n' +
                '            </div>\n' +
                `            <div class="eis-step-main">${that.settings.stepTitles[i]}</div>\n` +
                '        </div>'
            } else {
              stepBarHtml +=
                `<div class="eis-form-step" style="width:${(
                  100 / that.settings.stepCount
                ).toFixed(2)}%">\n` +
                '            <div class="eis-step-head">\n' +
                '                <div class="eis-step-icon">\n' +
                `                    <div class="step-icon-txt">${i + 1
                }</div>\n` +
                '                </div>\n' +
                '                <div class="eis-step-line">\n' +
                '                </div>\n' +
                '            </div>\n' +
                `            <div class="eis-step-main">${that.settings.stepTitles[i]}</div>\n` +
                '        </div>'
            }
          }
          stepHtml.append($(stepBarHtml))
          stepHtml.append($('<div class="eis-step-progress"></div>'))
          $stepBox.append(stepHtml)
          // 步骤内容填充到dom中
          var $stepContent = $stepBox.find(that.settings.stepContent)

          $stepBox.append($stepContent)
          $stepBox
            .find('.eis-stepContent')
            .eq(0)
            .show()
            .siblings('.eis-stepContent')
            .hide()
          that._renderStep(currentStep)
        } else if (direct === 'y') {
          for (var i = 0; i < that.settings.stepCount; i++) {
            if (i === that.settings.stepCount - 1) {
              stepBarHtml +=
                `${'<div class="eis-form-step">\n' +
                '            <div class="eis-step-head">\n' +
                '                <div class="eis-step-icon">\n' +
                '                    <div class="step-icon-txt">'
                }${i + 1}</div>\n` +
                '                </div>\n' +
                '            </div>\n' +
                `            <div class="eis-step-main">${that.settings.stepTitles[i]}</div>\n` +
                '        </div>'
            } else {
              stepBarHtml +=
                `${'<div class="eis-form-step">\n' +
                '            <div class="eis-step-head">\n' +
                '                <div class="eis-step-icon">\n' +
                '                    <div class="step-icon-txt">'
                }${i + 1}</div>\n` +
                '                </div>\n' +
                '                <div class="eis-step-line">\n' +
                '                </div>\n' +
                '            </div>\n' +
                `            <div class="eis-step-main">${that.settings.stepTitles[i]}</div>\n` +
                '        </div>'
            }
          }
          stepHtml.append($(stepBarHtml))
          stepHtml.append($('<div class="eis-step-progress"></div>'))
          that.$el.append(stepHtml)
          // 步骤内容填充到dom中
          var $stepContent = $stepBox.find(that.settings.stepContent)

          $stepBox.append($stepContent)
          $stepBox
            .find('.eis-stepContent')
            .eq(0)
            .show()
            .siblings('.eis-stepContent')
            .hide()
          that._renderStep(currentStep)
        }
      }
      // 处理步骤内容
      function _initStepCon(i) {
        var $stepContent = that.$el.find(that.settings.stepContent),
          $stepContents = $stepContent.find('.eis-stepContent')

        $stepContents.eq(i).show().siblings('.eis-stepContent').hide()
      }
      if (that.settings.stepDirection === 'x') {
        $stepBox.addClass('eis-horizontal-steps')
        _initStepBar('x', that.settings.currentStep)
      } else if (that.settings.stepDirection === 'y') {
        $stepBox.addClass('eis-vertical-steps')
        _initStepBar('y', that.settings.currentStep)
      }
      return this
    },
    // 处理步骤内容
    _initStepCon: function _initStepCon(i) {
      var that = this,
        $stepContent = that.$el.find(that.settings.stepContent),
        $stepContents = $stepContent.find('.eis-stepContent')

      $stepContents.eq(i).show().siblings('.eis-stepContent').hide()
      that.settings.currentStep = i
    },
    // 上一步
    stepPrevMove: function _stepPrevMove () {
      var i = this.settings.currentStep - 1
      if (i < 0) {
        i = 0
      }
      this._renderStep(i)
    },
    // 下一步
    stepNextMove: function _stepNextMove () {
      var i = this.settings.currentStep + 1
      if (i >= this.settings.stepCount - 1) {
        i = this.settings.stepCount - 1
      }
      this._renderStep(i)
    },
    _renderStep (index) {
      var direction = this.settings.stepDirection
      if (direction === 'x') {
        this._renderHorizontalStep(index)
      } else {
        this._renderVerticalStep(index)
      }
      this._initStepCon(index)
    },
    // 渲染 横着的 步骤条
    _renderHorizontalStep (index) {
      var that = this
          $formStep = that.$el.find('.eis-form-steps'),
          $formSteps = $formStep.find('.eis-form-step'),
          $stepWidth = $formSteps.width(),
          $stepProgress = $formStep.find('.eis-step-progress'), //步骤条
          $stepIcon = $formSteps.find('.eis-step-icon'),
          $targetStep = $($stepIcon[index])
      if (index === 0) {
        $stepProgress.width($stepWidth / 2)
        $targetStep.parent().parent().nextAll().removeClass('is-finish')
      } else if (index === $stepIcon.length - 1) {
        $stepProgress.width($stepWidth * (that.settings.stepCount - 1))
        $targetStep.parent().parent().addClass('is-finish')
        $targetStep.parent().parent().siblings().addClass('is-finish')
      } else {
        $stepProgress.width($stepWidth / 2 + $stepWidth * index)
        $targetStep.parent().parent().addClass('is-finish')
        $targetStep.parent().parent().prevAll().addClass('is-finish')
        $targetStep.parent().parent().nextAll().removeClass('is-finish')
      }
      that.settings.currentStep = index
    },
    // 渲染 竖着的 步骤条
    _renderVerticalStep (index) {
      var that = this,
          $formStep = that.$el.find('.eis-form-steps'),
          $formSteps = $formStep.find('.eis-form-step'),
          $stepProgress = $formStep.find('.eis-step-progress'), //步骤条
          $stepIcon = $formSteps.find('.eis-step-icon'),
          $stepHeight = $formSteps.height(),
          $targetStep = $($stepIcon[index])
          
      if (index === 0) {
        $stepProgress.height($stepHeight / 2)
        $targetStep.parent().parent().nextAll().removeClass('is-finish')
      } else if (index === $stepIcon.length - 1) {
        $stepProgress.height($stepHeight * (that.settings.stepCount - 1))
        $targetStep.parent().parent().addClass('is-finish')
        $targetStep.parent().parent().siblings().addClass('is-finish')
      } else {
        $stepProgress.height($stepHeight / 2 + $stepHeight * index)
        $targetStep.parent().parent().addClass('is-finish')
        $targetStep.parent().parent().prevAll().addClass('is-finish')
        $targetStep.parent().parent().nextAll().removeClass('is-finish')
      }
      that.settings.currentStep = index
    },
  }
  $.fn.extend({
    'step': function (opt) {
      if (this.length && this.length > 0) {
        return new Step($(this[0]), opt).init()
      }
    }
  })
})(jQuery, window, document)