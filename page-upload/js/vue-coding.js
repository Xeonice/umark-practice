/*
 *  to - do :
 *  书写 takephoto 方法中的 ajax 请求（base-64数组 -- imgData） line-76
 *  书写 tinyImgUpload 方法中的 ajax 请求（base - 64 数组--base64_upload） line-259
 *  注：可在控制台中看到相应的 base-64 数据
 */ 

//控件名：view-container
Vue.component('view-container', {
  //控件数据
  data: function () {
    return {
      //初始页面状态为显示拍照控件，不显示上传控件
      init: true,//初始标签
      video: false,//切换 video 标签
      submit: false,//切换 submit 标签
      videoReturnData: [],//回传数据，使用 this.videoReturnData 调用
      submitReturnData: [],//回传数据，使用 this.submitReturnData 调用
    }
  },
  /*控件参数（由父控件传入）：
  * titlecontent：标题数据（ 右侧的标题内容）（ 由父控件传递而来）
  * id：用于区分第几页合同
  * videoid：用于区分拍照控件中的 video 标签
  * canvasid：用于区分拍照控件中的 canvas 标签
  * submitid：用于区分上传控件中的 上传 控件
  * submitclickid：用于区分上传控件中的 提交文件 按钮
  */
  props: ['titlecontent', 'id', 'videoid', 'canvasid', 'submitid', 'submitclickid', 'pagetitle'],
  //控件方法
  methods: {
    paizhao: function (videoid, canvasid) {
      //控件切换（拍照）按钮点击后的事件
      this.init = false;//切出 init 页面
      this.video = true;//将 video 置真，从而显示拍照控件
      this.submit = false;//将 submit 置假，隐藏上传控件
      //初始化 video 标签所需的数据
      var constraints = {
        audio: false,//不需要 audio 音频流
        video: {
          width: 267,//长度为 267px（可自定义）
          height: 180//高度为 180px（可自定义）
        }
      };

      //选取控件中的 canvas 标签，清除 canvas 标签上次调用时所留下来的图像数据
      var cxt = document.getElementById(canvasid).getContext("2d");
      var canvas = document.getElementById(canvasid);
      canvas.setAttribute('style', 'display: none');
      cxt.clearRect(0, 0, 267, 180);
      //选取控件中的 video 标签
      var video = document.getElementById(videoid);
      video.setAttribute('style', 'display: block');
      //请求用户摄像头
      navigator.mediaDevices.getUserMedia(constraints)
        //成功时获取视频流（mediaStream）
        .then(function (mediaStream) {
          //切换 video 标签的 src 源为用户视频流（mediaStream）
          video.srcObject = mediaStream;
          //video 标签加载完毕时自动进行播放
          video.onloadedmetadata = function (e) {
            video.play();
          };
        })
        //失败时输出错误信息
        .catch(function (err) {
          console.log(err.name + ": " + err.message);
        });
    },
    takephoto: function (id, canvasid, videoid) {
      //选取控件中的 video 标签
      var video = document.getElementById(videoid);
      //选取控件中的 canvas 标签
      var canvas = document.getElementById(canvasid);
      //获取指定 canvas 标签中的 2d 数据
      var context = canvas.getContext("2d");
      video.setAttribute('style', 'display: none');
      canvas.setAttribute('style', 'display: block');
      //将 video 标签中视频流当前画面进行截取，并绘制于 canvas 标签上
      context.drawImage(video, 0, 0, 267, 180);
      //转换 canvas 中的图像数据为 base-64 数组
      var imgData = canvas.toDataURL("image/png");
      //请针对此数据（imgData）写一个ajax请求
      console.log('base64-takePhoto');
      console.log(imgData);
    },
    
    /*接收:
     *合同页数， 
     *上传控件 id，
     *提交文件 按钮的 id 数据
     */
    submitchange: function (id,submitid,submitclickid) {
      this.init = false;//切出 init 页面
      this.submit = true; //将 submit 置真，从而显示上传控件
      this.video = false; ////将 video 置假，从而隐藏拍照控件
      document.documentElement.style.fontSize = document.documentElement.clientWidth * 0.1 + 'px';
      //初始化将要传入上传函数中的配置参数
      var options = {
        path: '/',//上传URL
        onSuccess: function (res) {
          //成功时的方法
          console.log(res);
        },
        onFailure: function (res) {
          //失败时的方法
          console.log(res);
        }
      }
      /*
      * 参数：
      * 合同页数
      * 上传控件 id
      * 上传文件按钮 id
      * 配置参数
      */
      this.tinyImgUpload(id, submitid, submitclickid, options);
    },

    tinyImgUpload: function (id, ele, submitclickid, options) {
      // 判断容器元素合理性并且添加基础元素
      var img_container = 'img-container-' + ele;//容器
      var img_up_add = 'img-up-add-' + ele;// + 按钮
      var img_item = 'img-item-' + ele;//用于完善 + 按钮中的 css
      var img_add_icon = 'img-add-icon-' + ele; //控件中的 +
      var img_file_input = 'img-file-input-' + ele;//上传文件用的 input
      ele = '#' + ele;//将原来的 submitid（上传控件 id） 转换为 id 选择器

      var base64_upload;//base64 数组文件定义

      var eleList = document.querySelectorAll(ele);//上传控件测试（if，else 可略过）
      if (eleList.length == 0) {
        console.log('绑定的元素不存在');
        return;
      } else if (eleList.length > 1) {
        console.log('请绑定唯一元素');
        return;
      } else {
        // 测试通过时
        // 向上传控件（id=submit）中添加 html 内容（模板字符串）
        eleList[0].innerHTML =
        `<div id="${img_container}" >
          <div class="${img_up_add}  ${img_item}"> 
            <span class="${img_add_icon}">+</span> 
          </div>
          <input type="file" name="files" id="${img_file_input}" multiple>
        </div>`;
        // 选取出 #img-container 中的元素
        img_container = '#' + img_container;
        var ele = eleList[0].querySelector(img_container);
        ele.files = []; // 定义当前上传的文件数组
      }

      // 将这些内容转换为相应的选择器
      img_up_add = '.' + img_up_add;
      img_item = '.' + img_item;
      img_add_icon = '.' + img_add_icon;
      img_file_input = '#' + img_file_input;

      console.log(submitclickid);

      // 为添加按钮绑定点击事件，设置选择图片的功能
      var addBtn = document.querySelector(img_up_add);
      addBtn.addEventListener('click', function () {
        document.querySelector(img_file_input).value = null;
        // 点击 + 时，将点击事件传递给 input
        document.querySelector(img_file_input).click();
        return false;
      }, false)
      addBtn.click();

      var submitBtn = document.getElementById(submitclickid);

      // 预览图片
      //处理input选择的图片
      function handleFileSelect(evt) {
        var files = evt.target.files;

        for (var i = 0, f; f = files[i]; i++) {
          // 过滤掉非图片类型文件
          if (!f.type.match('image.*')) {
            continue;
          }
          // 过滤掉重复上传的图片
          var tip = false;
          for (var j = 0; j < (ele.files).length; j++) {
            if ((ele.files)[j].name == f.name) {
              tip = true;
              break;
            }
          }
          if (!tip) {
            // 不重复，且为图片时
            ele.files.push(f);
            // console.log(f);

            var reader = new FileReader();
            // 图片文件绑定到容器元素上
            reader.onload = (function (theFile) {
              return function (e) {
                // 创建缩略图容器
                var oDiv = document.createElement('div');
                oDiv.className = 'img-thumb img-item';
                // 向图片容器里添加元素，src 设置为 base-64 数组
                oDiv.innerHTML = 
                `<img class="thumb-icon" src="${e.target.result}" style="height: 282px; width: 200px;"/>`
                // 添加在上传控件之前
                ele.insertBefore(oDiv, addBtn);
                // 添加完毕后隐藏上传控件
                document.querySelector(img_up_add, img_item).setAttribute('style','display: none');
                // 将 base-64 数据赋值给全局变量 base64_upload
                base64_upload = e.target.result;
                uploadImg();
              };
            })(f);

            reader.readAsDataURL(f);
          }
        }
      }
      // input 改变时（ + 按钮点选并修改后）调用 handleFileSelect
      document.querySelector(img_file_input).addEventListener('change', handleFileSelect, false);

      // 上传图片
      function uploadImg() {        
        // xhr 请求
        var xhr = new XMLHttpRequest();
        var formData = new FormData();

        //回传 base-64 数组（由原有的 ele.files 改写而来）
        //请在此基础上书写 Ajax 请求
        console.log('base64-upload');
        console.log(base64_upload);

        
        for (var i = 0, f; f = ele.files[i]; i++) {
          formData.append('files', f);
        }

        // console.log('1', ele.files);
        // console.log('2', formData);

        xhr.onreadystatechange = function (e) {
          if (xhr.readyState == 4) {
            if (xhr.status == 200) {
              options.onSuccess(xhr.responseText);
            } else {
              options.onFailure(xhr.responseText);
            }
          }

          xhr.open('POST', options.path, true);
          xhr.send(formData);
        }
      }
    }
  },
  //HTML 模板文件
  template: `
  <article style="display: flex; justify-content: space-between; height: 500px; align-items: center;">
    <div class = "image">
      <div v-show = "init==true">
        <img src = "images/test.png">
      </div>
      <div v-show = "submit==true" style = "display: flex;flex-direction: column; justify-content: center; align-items: center;" >
        <div :id="submitid" ></div>
      </div>
      <div v-show = "video==true" style="display: flex; flex-direction: column; justify-content: center; align-items: center">
        <video :id="videoid" autoplay = " " style="margin-bottom: 10px;"> </video>
        <canvas :id="canvasid" width = "267" height = "180" style="margin-bottom: 10px;"> </canvas>
        <button :id = "id" v-on:click = "takephoto(id,canvasid,videoid)" class="button alt small fit" style="margin-top: 40px;"> 拍照 </button>
      </div>

      <div style="display: flex; width: 100%; justify-content: space-around; margin-top:20px;">
        <button v-on:click = "submitchange(id,submitid,submitclickid)" class="button small"> 上传 </button>
        <button v-on:click = "paizhao(videoid,canvasid)" class="button special small"> 拍照 </button>
      </div>
    </div>
    <div class = "inner" style="display: flex; align-item: center; flex-direction: column">
      <h2>{{pagetitle}}</h2>
      <p v-for="title in titlecontent">{{title}}</p>
    </div>
  </article>
  `,

})
var app = new Vue({
  // 绑定 html 页面中 id 为 container 的 div
  el: '#container',
  //标题静态数据
  data: {
    titles: [{
        id: 1,
        page: '第一页',
        titlecontents: ['项目名称：', '委托方（甲方）：', '委托方（乙方）：', '签订时间：', '签订地点：'],
        video: 'video1',
        canvas: 'canvas1',
        submit: 'submit1',
        submitclick: 'submitclick1'
      },
      {
        id: 2,
        page: '第二页',
        titlecontents: ['委托方（甲方）：', '住所地：', '法定代表人：', '联系方式：', '电子信息：'],
        video: 'video2',
        canvas: 'canvas2',
        submit: 'submit2',
        submitclick: 'submitclick2'
      },
      {
        id: 3,
        page: '第三页',
        titlecontents: ['合同总金额：', '开户银行：', '地址：', '账号：'],
        video: 'video3',
        canvas: 'canvas3',
        submit: 'submit3',
        submitclick: 'submitclick3'
      }
    ]
  },
})