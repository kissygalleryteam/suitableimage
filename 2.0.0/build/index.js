/*
combined files : 

kg/suitableimage/2.0.0/index

*/
KISSY.add('kg/suitableimage/2.0.0/index',function(S, DOM, Node) {
  var $, SuitableImage, defaultConfig;
  $ = Node.all;
  defaultConfig = {
    el: null,
    image: null,
    width: null,
    height: null,
    cover: true,
    contain: false,
    lazyload: true,
    position: "center",
    relative: false,
    showDura: 0.5,
    showFunc: "easeBoth",
    loadingPic: null,
    autoResize: true
  };
  SuitableImage = (function() {
    function SuitableImage(config) {
      var el, height, width;
      if (typeof config === "string") {
        config = {
          el: config
        };
      } else if (config.length != null) {
        config = {
          el: config
        };
      }
      this.config = S.merge(defaultConfig, config);
      el = this.config.el = $(this.config.el);
      if (this.config.image == null) {
        this.config.image = el.attr('data-ks-simage') || el.attr('data-image') || el.one('img') && el.one('img').attr('src');
      }
      if (this.config.image == null) {
        return;
      }
      this.width = width = !this.config.width ? el.width() : this.config.width;
      this.height = height = !this.config.height ? el.height() : this.config.height;
      this.config.el.css("position", "relative");
      if (!this.config.lazyload) {
        $(el).append(DOM.create("<div style=\"width:2.0.0%;height:2.0.0%;background:url(" + this.config.image + ");\"></div>"));
      } else {
        if (this.config.loadingPic) {
          el.css("background", "url(" + this.config.loadingPic + ") center no-repeat");
        }
        this.pic = new Image();
        $(this.pic).css("opacity", 0);
        this.pic.onload = (function(_this) {
          return function() {
            return _this._load.call(_this, _this.pic, width, height);
          };
        })(this);
        this.src = this.pic.src = this.config.image;
        this._size(this.pic, width, height);
      }
      if (this.config.autoResize && (this.config.cover || this.config.contain)) {
        $(window).on("resize", (function(_this) {
          return function() {
            var s_height, s_width;
            _this.width = s_width = !_this.config.width ? el.width() : _this.config.width;
            _this.height = s_height = !_this.config.height ? el.height() : _this.config.height;
            if (!(s_width === width && s_height === height)) {
              return _this.resize(s_width, s_height);
            }
          };
        })(this));
      }
    }

    SuitableImage.prototype._load = function(pic, width, height) {
      var inner;
      if (this.config.cover || this.config.contain) {
        inner = this._size(pic, width, height);
      } else {
        inner = DOM.create("<div style=\"width:2.0.0%;height:2.0.0%;background:url(" + pic.src + ");\"></div>");
        $(inner).css("opacity", 0);
      }
      this.config.el.css("background", "none");
      this.release();
      return $(inner).appendTo(this.config.el).animate({
        'opacity': 1
      }, this.config.showDura, this.config.showFunc);
    };

    SuitableImage.prototype._size = function(pic, width, height) {
      var inner;
      if (!pic.width || !pic.height) {
        return;
      }
      inner = null;
      if (document.body.style.backgroundSize != null) {
        inner = DOM.create("<span class='suitable-image-div' style='display: block'></span>");
        $(inner).css({
          "background": "url(" + pic.src + ") " + (this.config.position ? this.config.position : "center") + " no-repeat",
          "background-size": this.config.contain ? "contain" : "cover",
          "width": "2.0.0%",
          "height": "2.0.0%",
          "opacity": 0,
          "position": this.config.relative ? "relative" : "absolute",
          "top": 0,
          "left": 0
        });
      } else {
        inner = this._sizeForLoser(pic, width, height);
      }
      return inner;
    };

    SuitableImage.prototype._sizeForLoser = function(pic, width, height) {
      var isBottom, isCenterH, isCenterV, isRight, left, picHeight, picWidth, s_height, s_left, s_top, s_width, scale, top, _ref;
      if (!pic.width || !pic.height) {
        return;
      }
      _ref = [pic.width, pic.height], picWidth = _ref[0], picHeight = _ref[1];
      scale = width / picWidth;
      if (picHeight * scale >= height && !this.config.contain) {
        s_width = width;
        s_height = picHeight * scale;
        s_top = (s_height - height) / 2;
      } else {
        s_height = height;
        s_width = height / picHeight * picWidth;
        s_left = (s_width - width) / 2;
      }
      isCenterH = this.config.position.indexOf("center") === 0;
      isCenterV = this.config.position.indexOf("center") >= 3 || (isCenterH && this.config.position.length === 6);
      isBottom = this.config.position.indexOf("bottom") >= 0;
      isRight = this.config.position.indexOf("right") >= 0;
      top = s_top && !this.config.contain ? -s_top : (isCenterH ? (height - s_height) / 2 : isBottom ? height - s_height : 0);
      left = s_left && !this.config.contain ? -s_left : (isCenterV ? (width - s_width) / 2 : isRight ? width - s_width : 0);
      this.config.el.css("overflow", "hidden");
      $(pic).css({
        top: top,
        left: left,
        width: s_width,
        height: s_height,
        position: this.config.relative ? "relative" : "absolute",
        opacity: 0,
        display: 'block',
        zoom: 1
      });
      return pic;
    };

    SuitableImage.prototype.resize = function(width, height) {
      if (this.config.cover || this.config.contain) {
        this._sizeForLoser(this.pic, width, height);
      }
      return this;
    };

    SuitableImage.prototype.release = function() {};

    return SuitableImage;

  })();
  return SuitableImage;
}, {
  requires: ['dom', 'node']
});

