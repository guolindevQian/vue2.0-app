import EXIF from 'exif-js'
/**
 * 压缩类
 * 构造函数，需要传两个参数
 * 一个是file，要压缩的图片文件
 * 另一个是压缩参数{maxWidth:压缩后最大宽度，maxHeight:压缩后最大高度，quality:压缩质量，取值0-1}
 */
class Compress{
		
	constructor(file, option){
		this.file = file;
		this.config = Object.assign({
			quality : 0.9
		},option);
		
		return this.process();
	}
	
	//支持压缩的格式
	get mimeTypes()  {
		return {
			PNG : "image/png",
			JPEG : "image/jpeg",
			WEBP : "image/webp",
			BMP : "image/bmp"	
		}
	}
	
	get supportTypes(){
		return Object.keys(this.mimeTypes).map(type => this.mimeTypes[type]);
	}
	//判断格式是否支持
	isSupportedType (type){
		return this.supportTypes.includes(type);
	}
	
	process(){
		this.outputType = this.file.type;
		if(this.isSupportedType(this.file.type) == false){
			return Promise.reject({status:false,file:this.file,message:'不支持该格式'});
		}
		
		return this.getOriginImage().then(img => {
			return this.getCanvas(img);
		}).then(canvas => {
			let scale = 1;
			
			if(this.config.maxWidth){
				scale = Math.min(1, this.config.maxWidth / canvas.width);
			}
			if(this.config.maxHeight){
				scale = Math.min(1, scale, this.config.maxHeight / canvas.height);
			}
			
			
			return this.doScale(canvas, scale);
		}).then(result => {
			return new Promise((resolve, reject) => {
                // console.log(reject)
				resolve(this.toBlob(result));
			})
		})
	}
	
	//通过file 初始化 image
	getOriginImage() {
		return new Promise((resolve, reject) => {
			let img = new Image();
			img.onload = () => {
				resolve(img);
			};
			img.onerror = () => {
				reject("图片加载失败");
			};
			
			img.src = URL.createObjectURL(this.file);
		})
	}
	// 通过得到图片的信息来调整显示方向以正确显示图片，主要解决 ios 系统上的图片会有旋转的问题
	getCanvas(img) {
		return new Promise((resolve, reject) => {
			
			EXIF.getData(img, () => {
				let orientation = EXIF.getTag(img, "Orientation") || 1;
				
				let canvas = document.createElement("canvas");
				
				
				let ctx = canvas.getContext("2d");
				if (orientation == 3) {
        
                    canvas.width = img.width;

                    canvas.height = img.height;

                    ctx.rotate(Math.PI);

                    ctx.drawImage(img, 0, 0, -img.width, -img.height);

                }
              
               
                else if (orientation == 8) {
        
                    canvas.width = img.height;

                    canvas.height = img.width;

                    ctx.rotate(Math.PI * 3 / 2);

                    ctx.drawImage(img, 0, 0, -img.width, img.height);

                }
				if(orientation == 6){
					canvas.width = img.height;
					canvas.height = img.width;
					ctx.rotate(90 * Math.PI / 180);
					ctx.drawImage(img, 0 , 0 , img.width, img.height, 0, -img.height ,canvas.height,canvas.width);
					
				}else{
					canvas.width = img.width;
					canvas.height = img.height;
					ctx.drawImage(img, 0, 0);
				}
				
				resolve(canvas);
            });
            // console.log(reject)
		})
	}
	
	doScale(source, scale){
		if(scale == 1){
			return Promise.resolve(source);
		}
		
		let mirror = document.createElement("canvas");
		mirror.width = Math.ceil(source.width * scale);
		mirror.height = Math.ceil(source.height * scale);
		
		let mctx = mirror.getContext("2d");
		
		mctx.drawImage(source, 0, 0, source.width, source.height, 0, 0, mirror.width, mirror.height);
		
		
		return Promise.resolve(mirror);
	}
	
	// 这里把 base64 字符串转为 blob 对象
	toBlob(result) {
		let dataURL = result.toDataURL(this.outputType, this.config.quality);
		let buffer = atob(dataURL.split(",")[1]).split("").map(char => char.charCodeAt(0));
		let blob = new Blob([ new Uint8Array(buffer) ], {
			type : this.outputType
        });
        let file= new window.File([blob], this.file.name, {type: this.file.type})
		return {
            blob: blob,
            file: file,
			url: dataURL
		};
	}
	
}
 
 export default  Compress
 
/**
 * 示例代码
 */
// function upload(file){
// 	new Compress(file,{maxWidth:1000, maxHeight:1000, quality: 0.7}).then(function(data){
// 		//这里写回调函数，data会传入两个属性，url:压缩后图片url，blob：压缩后图片blob值
// 		document.getElementById("img").src = data.url;
// 	},function(err){
// 		//这里写异常处理
// 		console.log(err);
// 	})
	
// }