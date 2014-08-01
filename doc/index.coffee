KISSY.add (S, DOM, Node)->
  $ = Node.all
  defaultConfig =
    el              : null
    image           : null    # 一般会先读 data-image，除非这里指定
    width           : null
    height          : null
    cover           : true
    contain         : false
    lazyload        : true
    position        : "center"
    relative        : false
    showDura        : 0.5
    showFunc        : "easeBoth"
    loadingPic      : null  # 不建议这么做，因为一般来说先在 wrapper 上设置菊花就够了
    autoResize      : true # 针对不支持 background-size 的浏览器监听 window 的 resize 事件并执行图片的 resize


  class SuitableImage
    constructor: (config)->
      if typeof config is "string"
        config =
          el: config
      else if config.length?
        config =
          el: config

      @config = S.merge defaultConfig, config
      el = @config.el = $(@config.el)

      if !@config.image?
        @config.image = el.attr('data-ks-simage') || el.attr('data-image') || el.one('img') && el.one('img').attr('src')
      if !@config.image?
        # @config.el.css "background", "none"
        return  # 如果还是没有图片地址，则返回，如果性能遇到问题，可以提前释放 wrapper 的菊花

      @width = width = if !@config.width then el.width() else @config.width
      @height = height =  if !@config.height then el.height() else @config.height

      @config.el.css("position", "relative")
      if !@config.lazyload
        # 扔给它一个 img 就完了
        $(el).append DOM.create """<div style="width:100%;height:100%;background:url(#{@config.image});"></div>"""
      else
        # 还是扔给你一个 img ，自己调整位置
        if @config.loadingPic
          el.css "background", "url(" + @config.loadingPic + ") center no-repeat"

        @pic = new Image()
        $(@pic).css "opacity", 0

        @pic.onload = =>
          @_load.call @, @pic, width, height

        # 开始 load 图，并 size 一次，放在某些浏览器下缓存导致不触发 load 事件
        @src = @pic.src = @config.image
        @_size @pic, width ,height

      if @config.autoResize and (@config.cover or @config.contain)
        $(window).on "resize", =>
          @width = s_width = if !@config.width then el.width() else @config.width
          @height = s_height =  if !@config.height then el.height() else @config.height
          if !(s_width is width and s_height is height)
            @resize s_width, s_height

    _load: (pic, width, height)->
      if @config.cover or @config.contain
        inner = @_size pic, width ,height
      else
        inner = DOM.create """<div style="width:100%;height:100%;background:url(#{pic.src});"></div>"""
        $(inner).css "opacity", 0
      # 清空背景，否则性能很悲剧！！！
      @config.el.css "background", "none"
      @release()
      $(inner).appendTo(@config.el).animate {'opacity': 1}, @config.showDura, @config.showFunc
      # $(inner).appendTo(@config.el).css {'opacity': 1}

    _size: (pic, width, height)->
      return if !pic.width or !pic.height
      inner = null
      if document.body.style.backgroundSize?
        inner = DOM.create "<span class='suitable-image-div' style='display: block'></span>"
        $(inner).css
          "background": "url(" + pic.src + ") " + (if @config.position then @config.position else "center") + " no-repeat"
          "background-size": if @config.contain then "contain" else "cover"
          "width": "100%"
          "height": "100%"
          "opacity": 0
          "position": if @config.relative then "relative" else "absolute"
          "top": 0
          "left": 0
      else
        inner =  @_sizeForLoser pic, width, height
      return inner


    _sizeForLoser: (pic, width, height)->
      return if !pic.width or !pic.height
      [picWidth, picHeight] = [pic.width, pic.height]
      scale = width / picWidth
      if picHeight * scale >= height and !@config.contain
        s_width = width
        s_height = picHeight * scale
        s_top = (s_height - height) / 2
      else
        s_height = height
        s_width = height / picHeight * picWidth
        s_left = (s_width - width) / 2

      isCenterH = @config.position.indexOf("center") is 0
      isCenterV = @config.position.indexOf("center") >= 3 or (isCenterH and @config.position.length is 6)
      isBottom = @config.position.indexOf("bottom") >= 0
      isRight = @config.position.indexOf("right") >= 0

      top = if s_top and !@config.contain then -s_top else (if isCenterH then (height-s_height) / 2 else if isBottom then height-s_height else 0)
      left = if s_left and !@config.contain then -s_left else (if isCenterV then (width-s_width) / 2 else if isRight then width-s_width else 0)

      
      @config.el.css("overflow", "hidden")
      $(pic).css
        top: top
        left: left
        width: s_width
        height: s_height
        position: if @config.relative then "relative" else "absolute"
        opacity: 0
        display: 'block'
        zoom: 1
      return pic

    # 只暴露一个 resize 方法
    resize: (width, height)->
      if @config.cover or @config.contain
        @_sizeForLoser @pic, width, height
      return @

    release: ->
      # @pic = null


  return SuitableImage

, {
    requires: ['dom', 'node']
  }
