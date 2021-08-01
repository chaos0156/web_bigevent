  $(function () {
      let layer = layui.layer
      // 1.1 获取裁剪区域的 DOM 元素
      var $image = $('#image')
      // 1.2 配置选项
      const options = {
          // 纵横比
          aspectRatio: 1,
          // 指定预览区域
          preview: '.img-preview'
      }

      // 1.3 创建裁剪区域
      $image.cropper(options)

      //  为选择图片按钮绑定点击事件
      $('#btnimg').on('click', function () {
          $('#file').click()
      })
      //  使用用户上传的图片来替换
      $('#file').on('change', function (e) {
          //   console.log(e.target.files[0]);
          // 获取用户上传的图片
          let fileimg = e.target.files
          if (fileimg.length === 0) {
              return layer.msg('请选择图片！')
          }
          // 获取用户选择的文件
          let file = fileimg[0]
          //   console.log(typeof file);
          var newImgURL = URL.createObjectURL(file)
          $image
              .cropper('destroy') // 销毁旧的裁剪区域
              .attr('src', newImgURL) // 重新设置图片路径
              .cropper(options) // 重新初始化裁剪区域
      })


      //  将用户选择的图片上传
      $('#upload').on('click ', function () {
          // 拿到用户裁剪后的图片，输出为base64格式的字符串
          var dataURL = $image
              .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                  width: 100,
                  height: 100
              })
              .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
          $.ajax({
              type: 'POST',
              url: '/my/update/avatar',
              data: {
                  avatar:dataURL
              },
              success: function (res) {
                  if (res.status !== 0) {
                      return layer.msg(res.message)
                  }
                  layer.msg(res.message)
                  window.parent.getUserinfo()
              }

          })
      })

  })