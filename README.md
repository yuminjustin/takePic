# takePic
  这是一个拍照或者选择图片上传的插件，它会自动判断照片拍摄的设备方向并自动旋转；<br/>
  IE10以下自动绕道（不支持,需要HTML5的特性）；<br/>
  若你的有浏览器不支持ArrayBuffer，此插件也不适用；<br/>
  之前分享过这种功能的解决方案[点击访问](https://github.com/yuminjustin/photoExif)<br /> 
  处理需要加载的js有：上传插件、jQuery、jQuery.Exif、配置js；<br />
  至少需要这么多，总共有160k<br />
  自己也觉得今后会常用到此功能于是乎就自己写一个吧。
##使用详情
###1、依赖[jfaver](https://github.com/yuminjustin/jfaver)（3.67k）
  （依赖concat和transitionend，有兴趣的可以替换成自己的，让它可以独立）
###2、配置
        var t = new takePic({
            obj: {},          /*dom 对象*/
            uploadURL: "",    /*上传地址*/
            type: "image/jpg,image/jpeg,image/png,image/gif",/*支持格式*/
            maxSize: 1024 * 1024 * 8,    /*最大字节*/
            multiple: 0,                 /*是否多文件*/
            zoomWidth: 1024,             /*缩放宽度 px*/
            quality: 0.8,                /*缩放质量 0.0~1.0*/
            onProgress: function () {},  /*进度条事件*/
            onSuccess: function () {},   /*上传成功*/
            onFailure: function () {},   /*上传失败*/
            onSelect: function () {},    /*文件选择事件*/
            fileContainer: {             /*文件集合 多文件*/
                length: 0,
                index: 1,
                fileLists: {}
            },
            /*文件上传使用的变量名，主要用于后端*/
            variableName: 'takePic'
        });
    
###注意事项： 
     obj 必须是对象 例如：document.querySelector("#test") 或者 document.getElementById("test")
     【此dom非input对象！而是他的父级，插件会动态插入一个input，插入的input无样式需要自己定义】
     type 【image/】 这个前缀要写，我也太懒了，下个版本在简化它  
     multiple  布尔型，1或true开启多图上传（限PC端） 
     zoomWidth 缩放的宽度，竖行（宽<高）的图片，会小于这个值：（原始高*zoomWidth/原始宽度）*1.4 
     quality 照片质量（0~1.0）浮点型
     onProgress，onSuccess，onFailure，onSelect 对应的事件
     fileContainer 这个无需配置 请保持原始结构 用于多图上传
     variableName 文件上传使用的变量名，主要用于后端
###3、方法
      t.error(String); 错误弹出层
      t.succ(String); 成功弹出层
      
###ios、android、pc测试通过，使用机器iPhone 5s、SONY z1；

     
     
     
     
  
  
