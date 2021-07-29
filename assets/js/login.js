$(function () {
    // 实现登录和注册的按需切换
    $('#reg').on('click', function () {
        $('.regbox').show()
        $('.loginbox').hide()
    })
    $('#log').on('click', function () {
        $('.loginbox').show()
        $('.regbox').hide()
    })
    // 从layui中获取form对象
    let form = layui.form
    // 从layui中获取layer对象
    let layer = layui.layer
    // 使用form.verify()函数自定义校验规则
    form.verify({
        // 自定义一个pwd的规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格']
            // 校验两次密码是否一致的规则
            ,
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需拿到密码框中的内容，进行一次等于的判断
            // 如果判断失败，return一个提升消息
            let v = $('.regbox [name="password"]').val()
            if (v !== value) {
                return '两次密码不一致'
            }
        }
    })

    // 发起注册用户ajax请求
    // 监听注册表单的提交事件
    $('#regform').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        let unam = $('.regbox [name=username]').val()
        let pwd = $('.regbox [name=password]').val()
        $.ajax({
            type: 'POST',
            url: '/api/reguser',
            data: {
                username: unam,
                password: pwd
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg('注册成功，请登录!');
                // 模拟人的点击行为
                $('#log').click()
            }
        })
    })
    // 发起登录ajax请求
    // 监听登录表单的提交事件   
    $('#logform').on('submit', function (e) {
        e.preventDefault()
        let unam = $('.loginbox [name=username]').val()
        let pwd = $('.loginbox [name=password]').val()
        $.ajax({
            type: 'POST',
            url: '/api/login',
            data: {
                username: unam,
                password: pwd
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg(res.message)
                // 将登录成功得到的token字符串，保存到localstorag中
                localStorage.setItem('token',res.token)
                // console.log(res.token);
                // 跳转到后台页面
                // location.href = "./index.html"
            }

        })

    })
})