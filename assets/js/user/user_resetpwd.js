$(function(){
    let form = layui.form
    let layer = layui.layer
    // 为密码框定义校验规则
    form.verify({
        // 自定义一个pwd的规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格']
            // 校验两次密码是否一致的规则
            ,
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需拿到密码框中的内容，进行一次等于的判断
            // 如果判断失败，return一个提升消息
            let v = $('.layui-form [name="newpwd"]').val()
            if (v !== value) {
                return '两次密码不一致'
            }
        },
        // 新旧密码不能一样
        dif:function(value){
            let v = $('.layui-form [name="oldpwd"]').val()
            if(v === value){
                return '新密码不能与旧密码相同'
            }
        }
    })


    // 发起重置密码的ajax请求
    $('.layui-form').on('submit',function(e){
        e.preventDefault()
        $.ajax({
            type:'POST',
            url:'/my/updatepwd',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                // 重置表单
                $('.layui-form')[0].reset()
            }
        })
    })
    
})