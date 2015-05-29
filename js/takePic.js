(function (j) {
    var takePic = function (opts) {
        if (!opts.obj || !opts.uploadURL) {
            this.error("配置错误");
            return;
        }
        var optsInitial = {
            /*dom 对象*/
            obj: {},
            /*上传地址*/
            uploadURL: "",
            /*支持格式*/
            type: "image/jpg,image/jpeg,image/png,image/gif",
            /*最大字节*/
            maxSize: 1024 * 1024 * 8,
            /*是否多文件*/
            multiple: 0,
            /*缩放宽度 px*/
            zoomWidth: 1024,
            /*缩放质量 0.0~1.0*/
            quality: 0.8,
            /*进度条事件*/
            onProgress: function () {},
            /*上传成功*/
            onSuccess: function () {},
            /*上传失败*/
            onFailure: function () {},
            /*文件选择事件*/
            onSelect: function () {},
            /*文件集合 多文件*/
            fileContainer: {
                length: 0,
                index: 1,
                fileLists: {}
            },
            /*文件上传使用的变量名，主要用于后端*/
            variableName: 'takePic'
        };
        this.opts = j.concat(optsInitial, opts);
        init(this);
    };
    takePic.prototype.error = function (str) {
        overlay(str, 0);
    };
    takePic.prototype.succ = function (str) {
        overlay(str, 1);
    };

    function init(obj) {
        var inp = document.createElement("input");
        inp.setAttribute("type", "file");
        inp.setAttribute("accept", "image/*;capture=camera");
        inp.setAttribute("id", "takePic");
        inp.setAttribute("capture", "camera");
        if (obj.opts.multiple) {
            if (!navigator.userAgent.match(/iphone/i) && !navigator.userAgent.match(/Android/i))
                inp.setAttribute("multiple", "true");
        }
        obj.opts.obj.appendChild(inp);
        obj.inp = inp;
        events(obj);
    }

    function events(obj) {
        obj.inp.addEventListener("change", function (e) {
            var files = e.target.files || e.dataTransfer.files,
                imgs = [];
            try {
                for (var i = 0; i < files.length; i++) {
                    var temp = files[i];
                    if (!temp.type || obj.opts.type.indexOf(temp.type.toLowerCase()) < 0)
                        obj.error("您选择的文件格式不支持");
                    else if (!temp.size || temp.size > obj.opts.maxSize)
                        obj.error("您选择的文件过大");
                    else {
                        var upload = function (img) {
                            imgs.push(img);
                            if (imgs.length == files.length)
                                requestUpload(files, obj);
                        };
                        readExif(temp, function (o, file) {
                            zoomImg(file, o, obj, upload);
                        });
                    }
                }
                files.index = obj.opts.fileContainer.index++;
                files.uploaded = false;
                obj.opts.fileContainer.fileLists[files.index] = files;
                obj.opts.fileContainer.length++;
                obj.opts.onSelect({
                    index: files.index,
                    target: files
                });
            } catch (e) {
                return false;
            }

        }, false);
    }

    function overlay(str, status) {
        var ol = document.createElement("div"),
            olinner = document.createElement("div"),
            olimg = document.createElement("img"),
            oltext = document.createElement("p");
        ol.style.cssText += styles(0) + styles(5);
        olinner.style.cssText += styles(1);
        olimg.style.cssText += styles(3);
        oltext.style.cssText += styles(4);
        if (status) olimg.src = images(1);
        else olimg.src = images(0);
        oltext.innerHTML = str;
        olinner.appendChild(olimg);
        olinner.appendChild(oltext);
        ol.appendChild(olinner);
        document.body.appendChild(ol);
        setTimeout(function () {
            ol.style.cssText += styles(2);
        }, 600);
        ol.onclick = function () {
            close();
        };
        setTimeout(function () {
            close();
        }, 3600);
        var close = function () {
            ol.style.cssText += styles(5);
            if (ol) j.transitionend(ol, function () {
                document.body.removeChild(ol);
            });
        };
    }

    function styles(t) {
        var re = "";
        switch (t) {
        case 0:
            re = "width: 100%;height: 100%;position: fixed;z-index: 9999;background: rgba(255,255,255,.2);top: 0;left: 0;-webkit-transition: all 0.6s;-moz-transition:all 0.6s;-o-transition:all 0.6s;transition:all 0.6s;";
            break;
        case 1:
            re = "width: 200px;height: 120px;background: rgba(0,0,0,0.9);border-radius: 8px;overflow: hidden;position: absolute;top: 50%;left: 50%;margin: -60px 0 0 -100px;color:rgb(255,255,255);text-align:center;";
            break;
        case 2:
            re = "-webkit-transform: scale(1,1);-ms-transform:scale(1,1) ;-moz-transform:scale(1,1) ;-o-transform:scale(1,1) ;transform: scale(1,1);";
            break;
        case 3:
            re = "display: block;margin: 18px auto;";
            break;
        case 4:
            re = "max-width: 96%;margin: 0 auto;height: 42px;overflow: hidden;word-break: break-all;";
            break;
        case 5:
            re = "-webkit-transform: scale(0,0);-ms-transform:scale(0,0) ;-moz-transform:scale(0,0) ;-o-transform:scale(0,0) ;transform: scale(0,0);";
            break;
        }
        return re;
    }

    function images(t) {
        var re = "";
        switch (t) {
        case 0:
            re = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAwNS8yNy8xNcKDZtAAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzVxteM2AAABeElEQVRYhe2Xu3GDQBCGP904pwWXQAMaKAF1gDtQfNFFF6sD0wGUAOMGKMEtUIEcLCcBAoMQDwf+Zkh43P7s3uPfw/V6ZRLG+kAEhIAPeJ03KqAEciDD6HLKsIdRAcZGwBkIpim9UQAXjM7mCTD2HUhmBO4TEmP0d99DNRA8QtL5anDqMcp6zAkCjI2BlMcav4IHpPXYLdolEJXp6HDhUa4m+Zdc45ya8+KegXvN1yapY3UESPAl0z6ER+NHRYCkfokJN5XATUqXgfOGwR1nESA73JZ/7wgw1lfI9roXkUL29r0IFXKw7IWv2GbpDeH1nwUb8i9AIU5mL6o35pz700++MUqFeLi9yBXwq2dbmUwMibE5z5ThNUPiKDA6dKvg8syXC3GBmx/QGeJet6Jwtqy5D8RssySrOhZtAeLb4+7bK9DqER4bE7HOnysF/8DopHmjpy/QCXBi2XJUiB1Pug8GOiOdIT5hiYlZAP5Qj/iHm9NHIau05z8fDYFS/ByQ1gAAAABJRU5ErkJggg==";
            break;
        case 1:
            re = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAwNS8yNy8xNcKDZtAAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzVxteM2AAACvUlEQVRYhc2XvW9SURiHH27qTWpLiJASXW51oEsXXGTqR6IutANNlw6aUDa3+ge0Me1idHFjkuCqAwzVxaWkiQmTjKYMKhptNBBJSxOxLQ7ncOXCuZcb7m3ib4LzHs7z43y85z2BTqeDG+VqiTiQAhaBOBDq69IEKsAeUMwY5YqbcQPDDORqiRSwASy4cvpPJeBZxigXRzKQqyWuA/kRwCoj6YxR/qQKajbwFGI6vcKRY1TkmMMN5GqJNFBgcI29KAQU5NgWWZZAuiz4CFZppXdfmAbkmlfw95+r1ATi3T3RuwR5P+G6FmR6XLmFQpKFaUBOvR8bzlQymuX21BNiE8uq8EJ3U3ZnYMNP+Fxki7Aek583mYtsqbptAASef74VB977CY9NLA20V1uv2a9v9zff1BDp9ULhAJFLM6rmlIbI7Z41G1yzhTfaVd78eKAKLWqIi0UpXQsyG1wbCo9NLJO48tAR3j4/UoXjY9gcPV0LkoxmCesxwvqMav1M+FxkUxlrnx87wQFCyrugFy4gS9yZeoquBS39pscXvMABm8uoF96VMT5PMpo1TYT1GbvjZcIb7QNHuK2B+h/1D8N6jGQ0y43Ld6WZSU9wEHngF4p94HSkoAMElJH9+g7V1q4rONDUEBeQYqBt9us7Nr/zBQ5Q0RA1nFLV1q6DCc9wgD0NcKzZqq1diof3Oe+c2vb5cFwYBQ5Q1GT1WnLq1WgfUKo/Qqy9VUenX3nXeDwKvJQxypXuKXg2rPfHk7cUv9/jrPPbAn/1bXUUuMnsrYj2cFETTI5dZfXaS07OfnqBlzJGeRFgrKcxjYuS7Pj0kBdf5kcFgyjJ0t0vZiKSNVp6oLv/srwRLJlQVqvrFwhf738pDaTijFHOAyuIqfJLTUQ5nu8PKO8C6TLOkOPpUiVEGa7MN//v41Rh5EKe538BX5YeOGFX/xYAAAAASUVORK5CYII=";
            break;
        }
        return re;
    }

    function readExif(file, fn) {
        var reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = function (e) {
            var buffer = e.target.result,
                dataView = new DataView(buffer),
                orientation;
            if (navigator.userAgent.match(/iphone/i)){
                orientation = dataView.getUint32(48, true)|| 1;
                orientation = orientation/256;
            }
            else 
                orientation = dataView.getUint16(54, true)|| 1;
            if (orientation > 8 || orientation < 1) orientation = 1;
            fn(orientation, file);
        };
    }

    function zoomImg(file, orien, obj, fn) {
        var URL = window.URL || window.webkitURL,
            blob = URL.createObjectURL(file),
            img = new Image(),
            canvas = document.createElement('canvas'),
            ctx, base64;
        img.src = blob;
        img.file = file;
        img.onload = function () {
            var that = this,
                w = that.width,
                h = that.height,
                scale = w / h;
            w = w > obj.opts.zoomWidth ? obj.opts.zoomWidth : w;
            h = w / scale;
            if (orien == 1 || orien == 3) { /*横拍*/
                canvas.width = w;
                canvas.height = h;
                ctx = canvas.getContext('2d');
                if (orien == 3) {
                    ctx.translate(canvas.width, canvas.height);
                    ctx.scale(-1, -1);
                    ctx.drawImage(that, canvas.width - w, canvas.height - h, that.width, that.height, 0, 0, w, h);
                } else {
                    ctx.drawImage(that, 0, 0, that.width, that.height, 0, 0, w, h);
                }
            } else if (orien == 6 || orien == 8) { /*竖拍*/
                w = parseInt(w * 1.4);
                h = parseInt(h * 1.4);
                canvas.width = h;
                canvas.height = w;
                ctx = canvas.getContext('2d');
                if (orien == 6) {
                    ctx.rotate(90 * Math.PI / 180);
                    ctx.translate(0, -h);
                } else {
                    ctx.rotate(-90 * Math.PI / 180);
                    ctx.translate(-w, 0);
                }
                ctx.drawImage(that, 0, 0, that.width, that.height, 0, 0, w, h);
            }
            base64 = canvas.toDataURL('image/jpeg', obj.opts.quality);
            that.file.base64Resize = base64;
            fn(that);
        };
    }

    function requestUpload(files, obj) {
        var self = obj.opts,
            httpRequest = new XMLHttpRequest();
        if (httpRequest.upload) {
            httpRequest.upload.addEventListener("progress", function (event) {
                self.onProgress({
                    total: event.total,
                    loaded: event.loaded,
                    index: files.index,
                    target: files
                });
            }, false);

            httpRequest.onreadystatechange = function (e) {
                if (httpRequest.readyState == 4) {
                    if (httpRequest.status == 200) {
                        if (!httpRequest.responseText) {
                            obj.error("无返回值");
                            return false;
                        }
                        var json = eval('(' + httpRequest.responseText + ')');
                        if (json.error == 0) { //上传成功
                            for (var i = 0; i < files.length; i++) {
                                files[i].serverData = json.files[files[i].name];
                            }
                            files.uploaded = true; //已上传
                            self.fileContainer.fileLists[files.index] = files;
                            obj.succ("上传成功");
                            self.onSuccess({
                                index: files.index,
                                target: files
                            });
                        } else {
                            obj.error(json.error);
                            self.onFailure({
                                index: files.index,
                                target: files
                            });
                            return false;
                        }
                    } else {
                        obj.error("服务器连接失败");
                        self.onFailure({
                            index: files.index,
                            target: files
                        });
                        return false;
                    }
                }
            };
            httpRequest.open("POST", self.uploadURL, true);
            var formData = new FormData();
            for (var i = 0; i < files.length; i++) {
                formData.append(self.variableName + '[' + i + '][name]', files[i].name);
                formData.append(self.variableName + '[' + i + '][size]', files[i].size);
                formData.append(self.variableName + '[' + i + '][data]', files[i].base64Resize);
            }
            httpRequest.send(formData);
        }
    }
    window.takePic = takePic;
})(jFaver);
