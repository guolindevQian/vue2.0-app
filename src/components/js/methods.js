import * as dd from 'dingtalk-jsapi';
import EXIF from 'exif-js'



const methods={
    setTitle:(title)=>{
        if (dd.env.platform !== "notInDingTalk") {
        dd.biz.navigation.setTitle({
            title : title,//控制标题文本，空字符串表示显示默认文本
            onFail :function(err){
                console.log(err)
            }
        }); 
        }else{
            document.title=title
        }
    },
    // 格式化时间
    dataFormat:(date, fmt,val=0)=>{
        if(!date) return ''
        date=new Date(date)
        var o = {
            "M+": date.getMonth() + 1,	//月份
            "d+": date.getDate()-val,		//日
            "h+": date.getHours(),		//小时
            "m+": date.getMinutes(),	//分
            "s+": date.getSeconds(),	//秒
            "q+": Math.floor((date.getMonth() + 3) / 3),//季度
            "S": date.getMilliseconds()	//毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    },
    rotateImg:(files)=>{
        console.log(files)    
    for (var i = 0, len = files.length; i < len; ++i) {

        var file = files[i].file;

        // Ensure it's an image

        if (file.type.match(/image.*/)) {

            console.log('An image has been loaded');

            // Load the image

            var reader = new FileReader();

            reader.onload = function (readerEvent) {
                let Orientation;
                var image = new Image();

                image.onload = function (imageEvent) {

                    EXIF.getData(image, function () {

                        EXIF.getAllTags(this);

                        Orientation = EXIF.getTag(this, 'Orientation');
                        console.log(Orientation)

                    });

                    var cxt = canvas.getContext('2d');

                    if (Orientation == 3) {

                        canvas.width = width;

                        canvas.height = height;

                        cxt.rotate(Math.PI);

                        cxt.drawImage(image, 0, 0, -width, -height);

                    }

                    else if (Orientation == 8) {

                        canvas.width = height;

                        canvas.height = width;

                        cxt.rotate(Math.PI * 3 / 2);

                        cxt.drawImage(image, 0, 0, -width, height);

                    }

                    else if (Orientation == 6) {

                        canvas.width = height;

                        canvas.height = width;

                        cxt.rotate(Math.PI / 2);

                        cxt.drawImage(image, 0, 0, width, -height);

                    }

                    else {

                        canvas.width = width;

                        canvas.height = height;

                        cxt.drawImage(image, 0, 0, width, height);

                    }

                    var dataUrl = canvas.toDataURL('image/jpeg');

                    var resizedImage = dataURLToBlob(dataUrl);

                    return resizedImage

                };

                image.src = readerEvent.target.result;

            };

            reader.readAsDataURL(file);

        }

    }

    },
  
}

 export default methods

