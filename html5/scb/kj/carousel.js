/**
 * Carousel 组件构造函数
 */
function Carousel(selector) {
  var self = this
  var element = $(selector)

  var container = $(">ul", element)
  var panes = $(">ul>li", element)

  var paneWidth = 0
  var paneCount = panes.length

  var currentPane = 0
  this.count2 = 0
  this.count3 = 0

  /**
   * 初始化方法
   */
  this.init = function() {
    setPaneDimensions()
    // 重点在于 orientationchange 事件，它用来检测用户是否改变了屏幕方向
    // 对于任何改变屏幕尺寸的行为，都重新设置整个面板的尺寸
    $(window).on("load resize orientationchange", function() {
      setPaneDimensions()
    })
  }


  /**
   * 将所有面板的宽度都设置为外部元素的宽度，
   * 然后再将容器（ul）的宽度设置为所有面板的宽度
   * 这样可以让所有面板横着一一排好
   * 当然这个步骤也可以使用CSS来实现
   */
  function setPaneDimensions() {
    paneWidth = element.width()
    panes.each(function() {
      $(this).width(paneWidth)
    })
    container.width(paneWidth * paneCount)
  }


  /**
   * 切换到某一面板
   */
  this.showPane = function(index) {
    if(index == 1){
      $(".scb-list-t1").addClass('li-left')
    }else if(index == 2){
        $(".scb-list-t2").addClass('li-left')
    }
    index = Math.max(0, Math.min(index, paneCount - 1))
    currentPane = index
    var offset = -((100 / paneCount) * currentPane)
    setContainerOffset(offset, true)
  }

  //
  function setContainerOffset(percent, animate) {
    container.removeClass("animate")
    if (animate) {
      container.addClass("animate")
    }
    container.css("transform", "translate3d(" + percent + "%,0,0) scale3d(1,1,1)")
  }

  this.next = function() {
    return this.showPane(currentPane + 1, true)
  }
  this.prev = function() {
    return this.showPane(currentPane - 1, true)
  }

  function handleHammer(e) {
    // console.log(e)
    // 禁止浏览器默认的滚动行为
    e.gesture.preventDefault()

    switch (e.type) {
      case 'dragright':
      case 'dragleft':
        // 让面板跟着手指移动
        var paneOffset = -(100 / paneCount) * currentPane
        var dragOffset = ((100 / paneWidth) * e.gesture.deltaX) / paneCount

        // 第一个和最后一个面板无法再进行拖动，因此降低其“粘手”的感觉
        if ((currentPane === 0 && e.gesture.direction === 'right') ||
          (currentPane === paneCount - 1 && e.gesture.direction === 'left')) {
          dragOffset *= 0.4
        }

        setContainerOffset(dragOffset + paneOffset)
        break

      case 'swipeleft':
        self.next()
        // 当触发了 swipe 后，调用 stopDetect 停止探测其他手势
        e.gesture.stopDetect()
        break

      case 'swiperight':
        self.prev()
        e.gesture.stopDetect()
        break

      case 'release':
        // 在拖拽时，如果拖动幅度超过 50% 之后松手，那么这一次导航是有效的
        if (Math.abs(e.gesture.deltaX) > paneWidth / 2) {
          if (e.gesture.direction === 'right') {
            console.log('right')
            self.prev()
          } else {
            console.log('left')
            self.next()
          }
        } else {
          self.showPane(currentPane, true)
        }
        break
    }
  }

  element.hammer({
    drag_lock_to_axis: true
  }).on("release dragleft dragright swipeleft swiperight", handleHammer)
}