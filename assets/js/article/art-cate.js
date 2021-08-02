$(function () {
    let layer = layui.layer
    let form = layui.form
    initTable()
    // 获取文章分类的列表
    function initTable() {
        $.ajax({
            type: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // console.log(res);
                // 使用模板引擎渲染列表数据
                let htmlStr = template('dataT', res)
                $('tbody').html(htmlStr)
            }
        })
    }
    let index = null
    // 点击添加类别，展示弹出层
    $('#btncate').on('click', function () {
        index = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog').html()
        });
    })

    // 该表单是动态创建的，要通过代理的方式为其绑定submit事件
    // 监听添加文章分类的表单提交事件
    $('body').on('submit', '#addCate', function (e) {
        e.preventDefault()
        // console.log('ok');
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                initTable()
                // 根据索引，关闭对应的弹出层
                layer.close(index)
            }
        })
    })

    let idt = null
    // 编辑实现的功能
    $('tbody').on('click', '#edit', function () {
        idt = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        var id = $(this).attr('data-id')
        // 根据id获取文章分类
        $.ajax({
            type: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // console.log(res);
                form.val('editCate', res.data)
            }
        })

    })
    // 通过代理的形式为修改分类的表单绑定submit事件
    $('body').on('submit', '#editCate', function (e) {
        e.preventDefault()
        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                layer.close(idt)
                initTable()
            }

        })
    })

    // 删除文章分类
    $('tbody').on('click', '#del', function () {
        // let len = $(".ddel").length
        // console.log(len);
        // console.log(this);
        var id = $(this).attr('data-id')
        layer.confirm('确认删除吗?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            // console.log(this);
            // console.log(id);
            $.ajax({
                type: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    initTable()
                }
            })
            layer.close(index);
        });
    })
})