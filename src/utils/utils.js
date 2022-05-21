import Vue from 'vue'
import {
    biz,
    env
} from 'dingtalk-jsapi';
const utils = {
    setTitle: (title) => {
        if (env.platform !== 'notInDingTalk') {
            biz.navigation.setTitle({
                title: title,
                onFail: function (err) {
                    console.log(err)
                }
            })
        } else {
            document.title = title
        }
    },
    //钉钉扫描
    starScaning(callback,back){
        let _this = Vue.prototype;
        if (env.platform == 'notInDingTalk') {
            _this.$message.fail('请在钉钉中打开');
            return;
        }
        biz.util.scan({
            type: 'all', // type 为 all、qrCode、barCode，默认是all。
            onSuccess: function (res) {
                callback && callback(res.text)
            },
            onFail: function (err) {
                if (err.errorCode == -1) {
                    _this.$message.fail('已取消')
                    back && back()
                } else _this.$message.fail(err.errorMessage)
            }
        })
    },
    formTime:(date,format)=>{
        let timeobj = {
            'YYYY':date.getFullYear(),
            'MM':date.getMonth()+1>=10?date.getMonth()+1:'0'+(date.getMonth()+1),
            'DD':date.getDate()>=10?date.getDate():'0'+date.getDate(),
            'HH':date.getHours()>=10?date.getHours():'0'+date.getHours(),
            'NN':date.getMinutes()>=10?date.getMinutes():'0'+date.getMinutes(),
            'SS':date.getSeconds()>=10?date.getSeconds():'0'+date.getSeconds()
        }
        for(let item in timeobj){
            format =  format.replace(item,timeobj[item])
        }
        return format;
    },
    // 深拷贝
    deepCopy(object){
        let obj = object instanceof Array?[]:{};
        for(const [k,v] of Object.entries(object)){
            obj[k] = typeof v == 'object'? this.deepCopy(v):v;
        }
        return obj;
    },
    // 校正手机
    checkPhone:(phone)=>{
        let reg = /^1[3456789]\d{9}$/;
        return reg.test(phone);
    }
}

export default utils