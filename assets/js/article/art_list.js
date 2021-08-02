$(function () {
    // 定义美化时间的过滤器
    template.defaults.imports.filtTime = function (value) {
        let date = new Date(value)
        let y = date.getFullYear()
        let m = addZero(date.getMonth() + 1)
        let d = addZero(date.getDate())
        let hh = addZero(date.getHours())
        let mm = addZero(date.getMinutes())
        let ss = addZero(date.getSeconds())
        return y + '-' + m + "-" + d + ' ' + hh + ":" + mm + ":" + ss
    }
    // 补零函数
    function addZero(num) {
        return num > 9 ? num : '0' + num
    }
    let form = layui.form
    let layer = layui.layer
    let laypage = layui.laypage
    // 定义一个查询的参数对象，在请求数据时，将请求参数对象提交到服务器
    let q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示多少条数据
        cate_id: '', //文章分类id
        state: '' //文章状态
    }
    initTable()
    initCate()
    function initTable() {
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 使用模板引擎渲染页面数据
                let htmlStr = template('list', res)
                $('tbody').html(htmlStr)
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }
    // 初始化文章分类
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
                // console.log(htmlStr);
                $('#selectCate').html(htmlStr)
                // 通知layui重新渲染表单区域的UI结果
                form.render()
            }
        })
    }
    // 实现筛选功能
    // 1为筛选的表单绑定提交事件
    $('#selectForm').on('submit', function (e) {
        e.preventDefault()
        // 2获取表单中选中项的值
        let cate_id = $('[name = "cate_id"]').val()
        let state = $('[name = "state"]').val()
        // 3为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 4根据最新的筛选条件,重新渲染表格数据
        initTable()
    })
    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用laypage.render()来渲染分页结构
        laypage.render({
            elem: 'pagebox' //注意，这里的 test1 是 ID，不用加 # 号
                ,
            count: total //数据总数，从服务端得到
                ,
            limit: q.pagesize //每页显示几条数据
                ,
            curr: q.pagenum //设置默认被选中的分页
                // 分页发生切换时，触发jump回调
                ,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5],
            jump: function (obj, first) {
                // 通过first的值来判断哪种方式触发的jump回调
                // console.log(first); //true,以第二种方式触发jump回调
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                // 根据最新的q获取对应的数据列表,并且渲染表格
                // 如果直接调用initTable(),则会发生死循环,jump回调则会一直被触发
                // 1.点击页码时，会触发jump回调
                // 2.只要调用了laypage.render()就会触发jump回调   死循环:不停的调用laypage.render()
                if (!first) {
                    initTable()
                }
            }
        });
    }

    // 删除文章的功能
    $('tbody').on('click','#del', function () {
        let len = $('.ddel').length
        // console.log(len);
        var id = $(this).attr('data-id')
        // console.log(id);
        // console.log(this);
        layer.confirm('确认删除吗?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                type: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    // 当数据删除完成后,需要判断当前这一页面中,是否还有剩余数据
                    // 如果没有剩余数据,则让页码值-1.
                    // 再重新调用initTable()
                    // 判断删除按钮的个数
                    if(len === 1){
                        // 如果len的值等于1,则证明删除完毕后,页面上没有任何数据了
                        // 页码值最小值为1
                        q.pagenum = q.pagenum == 1? 1:q.pagenum-1
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })


})