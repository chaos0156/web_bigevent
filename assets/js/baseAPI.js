$.ajaxPrefilter(function (options) {
    // options.url = 'http://api-breakingnews-web.itheima.net' + options.url
    options.url = 'http://127.0.0.1:3007' + options.url
    // 统一为有权限的接口设置headers请求头
    // 只有url中包含/my的才需要发headers
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 全局统一挂载complete回调函数
    options.complete = function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 强制清空token
            localStorage.removeItem('token')
            // 强制跳转至登录页面
            location.href = '/login.html'
        }
    }
})