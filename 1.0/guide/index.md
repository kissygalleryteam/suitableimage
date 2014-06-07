## 综述

Suitableimage是兼容 IE 的 background-size: cover/contain 功能的组件。

* 版本：1.0
* 作者：筱谷
* demo：[http://gallery.kissyui.com/suitableimage/1.0/demo/index.html](http://gallery.kissyui.com/suitableimage/1.0/demo/index.html)

## 初始化组件
		
    S.use('gallery/suitableimage/1.0/index', function (S, Suitableimage) {
         var suitableimage = new Suitableimage(config);
    })
	
## API说明

    el              : '#image-wrap' #包裹图片的元素
    image           : 'http://img.la/99x99' #图片地址，会先读取父元素上的 data-image，除非这里指定
    width           : null # 如有需要，手动指定元素宽度
    height          : null # 如有需要，手动指定元素高度
    cover           : true # 是否实现 background-size: cover 功能
    contain         : false # 是否实现 background-size: contain 功能，如果同时设置了 cover 和 contain ，cover 优先
    position        : "center" # cover 后的对齐方式，同 background-potion
    relative        : false # 图片内部使用相对定位，默认绝对定位
    showDura        : 0.5 # 图片载入动画时间
    showFunc        : "easeBoth" # 图片载入动画效果
    loadingPic      : null  # 懒加载时显示的 Loading 图标
    autoResize      : true # 针对不支持 background-size 的浏览器监听 window 的 resize 事件并执行图片的 resize	
