$(function () {
    // 从layui中获取form对象
    let form = layui.form
    let layer = layui.layer
    // 使用form.verify()函数自定义校验规则
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1-6个字符之间！'
            }
        }
    })

    getinfo()
    //  获取用户基本信息
    function getinfo() {
        $.ajax({
            type: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 重置表单
    $('#reset').on('click',function(e){
        // 阻止表单默认重置行为
        e.preventDefault()
        getUserinfo()
    })

    // 提交表单时，发起修改用户基本信息的ajax请求
    // 监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        let nickname = $('.layui-input-block [name=nickname]').val()
        let email = $('.layui-input-block [name=email]').val()
        $.ajax({
            type: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                // 调用父页面中的方法，重新渲染用户的头像和用户信息
                window.parent.getUserinfo()
            }
        })
    })
})