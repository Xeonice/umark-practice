var constraints = {
  audio: false,
  video: {
    width: 267,
    height: 180
  }
};
var video = document.querySelector('video');
var context = canvas.getContext("2d");
navigator.mediaDevices.getUserMedia(constraints)
  .then(function (mediaStream) {
    video.srcObject = mediaStream;
    video.onloadedmetadata = function (e) {
      video.play();
    };
  }).catch(function (err) {
    console.log(err.name + ": " + err.message);
  }); // 总是在最后检查错误
document.getElementById("paizhao").addEventListener("click", function () {
  context.drawImage(video, 0, 0, 267, 180);
  var imgData = canvas.toDataURL("image/png");
  console.log(imgData);
});　

function upload() {
  mydata = document.getElementById("mydata").files[0];
  formData = new FormData();
  formData.append("mydata",
    mydata);
  $.ajax({
    contentType: "multipart/form-data",
    url: "/adata/adata/payment/PaymentAction/upload.menu?_pathName=/adata//payment.jsp",
    type: "POST",
    data: formData,
    dataType: "text",
    processData: false, // 告诉jQuery不要去处理发送的数据 contentType: false, // 告诉jQuery不要去设置Content-Type请求头
    success: function (result) {
      alert(result);
    }
  });
}