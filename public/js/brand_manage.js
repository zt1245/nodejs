$(function(){
    var page = 1;
    //当点击新增手机的时候，出现新增的表单
    $('.add_phone').click(function(){
        $('.update_form').show();
    });
    $('.update_form i').click(function () {
        $('.update_form').hide();
    });
    $('.submit').click(function(){
        var fileObj = $('.file').get(0).files[0];
        var name = $('.name').val();
        var fileForm = new FormData();
        fileForm.append('file', fileObj);
        fileForm.append('name', name);
        var data = fileForm;
        if (typeof fileObj == 'undefined' || fileObj.size <= 0){
            alert('请选择图片');
            return;
        }
        $.ajax({
            type: 'post',
            url: '/brand/add',
            data:data,
            cach: false, //上传文件无需缓存
            processData: false,  //用于对data参数进行序列化处理 这里必须false
            contentType: false, //必须写
            success: function(res){
                console.log(res);
                getList();
            }
        })
        $('.update_form').hide();
    });
    //===========================加载信息=====================
    getList();
    function getList(){
        $.ajax({
            type: 'get',
            url: '/brand/search',
            data: {
                page: page
            },
            success: function(res){
                console.log(res);
                console.log(res.data.brandList);
                console.log(res.data.totalPage);
                var html = '';
                for (var i = 0; i < res.data.brandList.length;i++){
                    html += `<tr>
                                <td>${res.data.brandList[i]._id}</td>
                                <td>
                                    <img src="/brand/${res.data.brandList[i].imgSrc}">
                                </td>
                                <td>${res.data.brandList[i].name}</td>
                                <td>
                                    <a href="javascript:;" class="upd">修改</a>
                                    <a href="javascript:;" class="del">删除</a>
                                </td>
                            </tr>`;
                }
                $('.tbody').html(html);
                var str =  `<li>
                                <a class="Previous">
                                    <span>&laquo;</span>
                                </a>
                            </li>`;
                for (var i = 0; i < parseInt(res.data.totalPage);i++){
                    str += `<li><a>${i + 1}</a></li>`;
                }
                str += `<li>
                            <a class="Next">
                                <span>&raquo;</span>
                            </a>
                        </li>`;
                $('.pagination').html(str);
                $('.pagination').children().eq(page).attr('class', 'user_active');
            }
        })
    }
    //===========================分页操作======================
    $('.pagination').on('click','li',function(e){
        e.preventDefault();
        page = $(this).find('a').html();
        $(this).addClass('user_active').siblings().removeClass('user_active');
        console.log(page);
        $.ajax({
            type: 'get',
            url: '/brand/search',
            data: {
                page: page
            },
            success: function(res){
                console.log(res);
                var html = '';
                for (var i = 0; i < res.data.brandList.length; i++) {
                    html += `<tr>
                                <td>${res.data.brandList[i]._id}</td>
                                <td>
                                    <img src="/brand/${res.data.brandList[i].imgSrc}">
                                </td>
                                <td>${res.data.brandList[i].name}</td>
                                <td>
                                    <a href="javascript:;" class="upd">修改</a>
                                    <a href="javascript:;" class="del">删除</a>
                                </td>
                            </tr>`;
                }
                $('.tbody').html(html);
                getList();
            }
        })
    })
    //==========================修改操作======================
    $('.tbody').on('click','.upd',function(){
        $('.up_form').show();
        $('.Name').val($(this).parent().parent().find('td').eq(2).html());
        $('._id').val($(this).parent().parent().find('td').eq(0).html());
        // console.log($(this).parent().parent().find('td').eq(2).html());
        // console.log($(this).parent().parent().find('td').eq(0).html());
    })
    $('.up_form i').click(function(){
        $('.up_form').hide();
    })
    $('.Submit').click(function(){
        var _id = $('._id').val();
        var name = $('.Name').val();
        var fileObj = $('.File').get(0).files[0];
        var fileForm = new FormData();
        fileForm.append('_id', _id);
        fileForm.append('Name', name);
        fileForm.append('File', fileObj);
        var data = fileForm;
        if (typeof fileObj == 'undefined' || fileObj.size <= 0) {
            alert('请选择图片');
            return;
        }
        $.ajax({
            type: 'post',
            url: '/brand/update',
            data: data,
            cach: false, //上传文件无需缓存
            processData: false,  //用于对data参数进行序列化处理 这里必须false
            contentType: false, //必须写
            success: function(res){
                console.log(res);
                if (res.code == '0'){
                    getList();
                }
            }
        })
        $('.up_form').hide();
    })
    //============================删除操作===================
    $('.tbody').on('click','.del',function(){
        var num = $(this).parent().parent().find('td').eq(0).html();
        console.log(num);
        $.ajax({
            type: 'get',
            url: '/brand/delete',
            data: {
                num: num
            },
            success: function(res){
                console.log(res);
                if (res.code == '0'){
                    getList();
                }
            }
        })
    })
})