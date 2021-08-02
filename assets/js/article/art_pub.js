$(function () {
    let layer = layui.layer
    let form = layui.form

    initCate()
    // 初始化富文本编辑器
    initEditor()
    // 获取文章分类的方法
    function initCate() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // console.log(res);
                // 使用模板引擎渲染列表数据
                let htmlStr = template('option', res)
                $('[name = "cate_id"]').html(htmlStr)
                form.render()
            }
        })
    }
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 点击选择图片后，更换封面
    $('#btnC').on('click', function () {
        $('#chooseF').click()
    })

    $('#chooseF').on('change', function (e) {
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

    let art_state = '已发布'
    // 为存为草稿按钮绑定点击事件，将状态设置为草稿
    $('#script').on('click', function () {
        art_state = '草稿'
    })

    // 为表单绑定submit事件
    $('#pubArt').on('submit', function (e) {
        e.preventDefault()
        // 基于form表单，快速创建一个FormDate对象
        let data = new FormData($(this)[0])
        // 将文章的发布状态,存入data中
        data.append('state', art_state)
        //v是值，k是键
        // data.forEach(function (v, k) {
        //     console.log(k, v);
        // })

        // 将封面裁剪过后的图片,输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                //将输出的文件存入FormData中
                data.append('cover_img', blob)
                // 发起ajax请求
                pubArticle(data)
            })


    })

    // 定义一个发布文章的方法
    function pubArticle(data) {
        $.ajax({
            type: 'POST',
            url: '/my/article/add',
            data: data,
            // 注意如果向服务器提交的是FormData格式的数据
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                // 发布成功后,跳转至文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }
})