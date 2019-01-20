$(function(){
    // var page = parseInt(location.search.split('=')[1]);
    // if (page){
    //     page = page;
    // }else {
    //     page = 1;
    // }
    var page = 1;
    //=====================================新增===========================
    //点击新增手机出现添加手机信息的表单
    $('.add_phone').click(function () {
        $('.update_form').css('display', 'block');
    });
    //点击取消添加信息的表单隐藏
    $('.update_form i').click(function () {
        $('.update_form').css('display', 'none');
    });
    //点击提交
    $('.submit').click(function(){
        var name = $('.name').val();
        var brand = $('#brand').val();
        var official_price = $('.official_price').val();
        var recovery_price = $('.recovery_price').val();
        //获取图片的对象
        var fileObj = $('.file').get(0).files[0];//注意，这个需要转换成dom对象，才有files
        //自己模拟form表单
        var fileForm = new FormData();
        fileForm.append('name', name);
        fileForm.append('brand', brand);
        fileForm.append('official_price', official_price);
        fileForm.append('recovery_price', recovery_price);
        fileForm.append('file', fileObj);
        var data = fileForm;
        console.log(name, brand, official_price, recovery_price);
        //当没有选择图片的时候弹出请选择图片
        if (typeof fileObj == 'undefined' || fileObj.size <= 0){
            alert('请选择图片');
            return;
        }
        //发送ajax
        $.ajax({
            type: 'post',
            url: '/mobile/add',
            data: data,
            cach: false, //上传文件无需缓存
            processData: false,  //用于对data参数进行序列化处理 这里必须false
            contentType: false, //必须写
            success: function(res){
                console.log(res);
                getList();
            }
        });
        $('.update_form').css('display', 'none');
    })
    //==================================加载信息=======================================
    getList();
    function getList(){
        $.ajax({
            type: 'get',
            url: '/mobile/search',
            data: {
                page: page
            },
            success: function(res){
                console.log(res.data.totalPage);
                console.log(res.data.phoneList);
                //循环下面的页码
                var str = `<li>
                                <a class="Previous">
                                    <span>&laquo;</span>
                                </a>
                            </li>`;
                for (var i = 0; i < res.data.totalPage;i++){
                    str += `<li><a>${i+1}</a></li>`;
                }
                str += `<li>
                            <a class="Next">
                                <span>&raquo;</span>
                            </a>
                        </li>`;
                $('.pagination').html(str);
                //循环拼接数据
                var html = '';
                for (var i = 0; i < res.data.phoneList.length;i++){
                    html += `<tr>
                                <td>${res.data.phoneList[i]._id}</td>
                                <td>
                                    <img src='/phone/${res.data.phoneList[i].imgSrc}'>
                                </td>
                                <td>${res.data.phoneList[i].name}</td>
                                <td>${res.data.phoneList[i].brand}</td>
                                <td>${res.data.phoneList[i].official_price}</td>
                                <td>${res.data.phoneList[i].recovery_price}</td>
                                <td>
                                    <a href="javascript:;" class="upd">修改</a>
                                    <a href="javascript:;" class="del">删除</a>
                                </td>
                            </tr>`;
                }
                $('.tbody').html(html);
                $('.pagination').children().eq(page).attr('class', 'user_active');
            }
        });
    }
    //下面的页数点击，每个页面的数据变化
    $('.pagination').on('click','li',function(e){
        e.preventDefault();
        page = $(this).find('a').html();
        $(this).addClass('user_active').siblings().removeClass('user_active');
        console.log(page);
        $.ajax({
            type: 'get',
            url: '/mobile/search',
            data: {
                page: page
            },
            success: function(res){
                console.log(res);
                //循环拼接数据
                var html = '';
                for (var i = 0; i < res.data.phoneList.length; i++) {
                    html += `<tr>
                            <td>${res.data.phoneList[i]._id}</td>
                            <td>
                                <img src='/phone/${res.data.phoneList[i].imgSrc}'>
                            </td>
                            <td>${res.data.phoneList[i].name}</td>
                            <td>${res.data.phoneList[i].brand}</td>
                            <td>${res.data.phoneList[i].official_price}</td>
                            <td>${res.data.phoneList[i].recovery_price}</td>
                            <td>
                                <a class="upd">修改</a>
                                <a class="del">删除</a>
                            </td>
                        </tr>`;
                }
                $('.tbody').html(html);
            }
        })
    })
    //====================================修改=======================
    //修改
    //点击修改的时候，表单出现
    $('.tbody').on('click','.upd',function(){
        $('.up_form').css('display', 'block');
        // console.log($(this).parent().parent().find('td').eq(1).html());
        $('._id').val($(this).parent().parent().find('td').eq(0).html());
        $('.Name').val($(this).parent().parent().find('td').eq(2).html());
        $('#Brand').val($(this).parent().parent().find('td').eq(3).html());
        $('.Official_price').val($(this).parent().parent().find('td').eq(4).html());
        $('.Recovery_price').val($(this).parent().parent().find('td').eq(5).html());
    })
    //点击取消的时候，表单隐藏
    $('.up_form i').click(function(){
        $('.up_form').css('display', 'none');
    })
    //点击提交，发送ajax请求
    $('.Submit').click(function(){
        console.log(page);
        var _id = $('._id').val();
        var name = $('.Name').val();
        var brand = $('#Brand').val();
        var official_price = $('.Official_price').val();
        var recovery_price = $('.Recovery_price').val();
        var fileObj = $('.File').get(0).files[0];
        var fileForm = new FormData();
        fileForm.append('Name', name);
        fileForm.append('Brand', brand);
        fileForm.append('Official_price', official_price);
        fileForm.append('Recovery_price', recovery_price);
        fileForm.append('File', fileObj);
        fileForm.append('_id', _id);
        console.log(fileForm);
        var data = fileForm;
        // console.log(name, brand, official_price, recovery_price);
        if (typeof fileObj == 'undefined' || fileObj.size <= 0) {
            alert('请选择图片');
            return;
        }
        $.ajax({
            type: 'post',
            url: '/mobile/update',
            data: data,
            cach: false, //上传文件无需缓存
            processData: false,  //用于对data参数进行序列化处理 这里必须false
            contentType: false, //必须写
            success: function(res){
                console.log(res);
                // location.href = `/mobile_manage.html?page=${page}`;
                getList();
            }
        })
        $('.up_form').css('display', 'none');
    })

    //===================================删除=============================
    $('.tbody').on('click','.del',function(){
        var num = $(this).parent().parent().find('td').eq(0).html();
        console.log(num);
        $.ajax({
            type: 'get',
            url: '/mobile/del',
            data: {
                num: num
            },
            success: function(res){
                console.log(res);
                getList();
            }
        })
    })
    //===================option信息=================
    $.ajax({
        type: 'get',
        url: '/mobile/option',
        success: function(res){
            console.log(res);
            var str ='';
            for(var i = 0; i < res.data.length; i++){
                str += `<option value="${res.data[i].name}">${res.data[i].name}</option>`
            }
            $('#brand').html(str);
            $('#Brand').html(str);
        }
    })
})