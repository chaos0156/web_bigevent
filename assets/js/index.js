// 通过ajax获取用户基本信息
$(function () {
    getUserinfo()
    // 实现退出功能
    let layer = layui.layer
    $('#out').on('click', function () {
        layer.confirm('确定退出登录?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            // 清空本地存储的token
            localStorage.removeItem('token')
            location.href = '/login.html'
            // 关闭confirm询问框
            layer.close(index);
        });
    })
})

function getUserinfo() {
    $.ajax({
        type: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return  layui.layer.msg('获取用户信息失败')
            }
            // 渲染用户个人信息
            renderAvatar(res.data)
        },
        // 无论请求失败还是成功都会执行complete回调函数
      
    })
}

function renderAvatar(usr) {
    // 获取用户名称
    let name = usr.nickname || usr.username
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 按需渲染用户头像
    if (usr.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', usr.user_pic).show()
        $('.text-avatar').hide()
    } else {
        // 渲染文本头像
        $('.layui-nav-img').hide()
        // 获取用户名首字母
        let cap = name.charAt(0).toUpperCase()
        $('.text-avatar').html(cap).show
    }
}