/**
 * Created by 程旭 on 15/12/8.
 */
$(document).ready(function () {

    // 重置JS页面要用到的域名地址
    window.url_dns = window.location.origin + '/layercake_admin';
    window.url_dns_erp = window.location.origin;

    /******
     * <img class="J_product_pic J_click_max" data-idx="商品ID" data-width="200 获取图片的尺寸" src="http://siwoo.oss-cn-hangzhou.aliyuncs.com/picnone.png">
     * 商品图片自动执行
     */
    $('.J_product_pic').each(function () {
        var _self = $(this);
        _self.prop('src', url_dns_erp + '/layercake/product/pic/' + _self.data('idx') + '?width=' + _self.data('width'));
        _self.hasClass('J_click_max') && _self.zoomPic({
            maxImg: url_dns_erp + '/layercake/product/pic/' + _self.data('idx') + '?width=800'
        });
    });
    // http://www.liblin.com.cn/layercake/original/getImgUrlForAll?id=215145&type=5&px=1000
    $('.J_color_code_pic').each(function () {
        var _self = $(this);
        _self.prop('src', url_dns_erp + '/layercake/original/getImgUrlForAll?id=' + _self.data('idx') + '&type=5&px=' + _self.data('width'));
        _self.hasClass('J_click_max') && _self.zoomPic({
            maxImg: url_dns_erp + '/layercake/original/getImgUrlForAll?id=' + _self.data('idx') + '&type=5&px=1000'
        });
    });
    

    /*********************************
     * 当图片不存在时,显示另外图片
     */
    $('img').each(function () {
        var $this = $(this);

        $this.on('error', function () {
            $this.prop('src', 'http://siwoo.oss-cn-hangzhou.aliyuncs.com/picnone.png');
        });
    });

    /**
     * 返回顶部
     */
    var html = $('<div class="goBack"><span></span></div>');
    $('.bd').append(html);
    var goBack = $('.goBack');

    $('.bd').scroll(function () {
        if ($('.bd').scrollTop() > 200) {
            //console.log($('.bd').scrollTop());
            goBack.fadeIn(1500);
        } else {
            goBack.fadeOut(1500);
        }
    });

    goBack.click(function () {
        $('.bd').animate({scrollTop: 0}, 1000);
        return false;
    });


    /**
     * 导航条固定
     * 只需在需要导航条的地方加上一个class：J_fixedNav就可以了
     */
    if ($('.J_fixedNav').length > 0) {
        var J_fixedNav = $('.J_fixedNav');
        J_fixedNav.attr('otop', J_fixedNav.offset().top); //存储原来的距离顶部的距离
        //console.log(J_fixedNav.offset().top);

        $('.bd').scroll(function () {
            //console.log((J_fixedNav.attr('otop')));
            if ($('.bd').scrollTop() >= parseInt(J_fixedNav.attr('otop'))) {
                if (J_fixedNav.css('position') != 'fixed')
                    J_fixedNav.css({
                        'position': 'fixed',
                        top: 0,
                        'z-index': 200,
                        'width': '986px',
                        'border-top': '10px solid #666666'
                    });
            } else if (J_fixedNav.css('position') != 'static')
                J_fixedNav.css({'position': 'static', 'border-top': '0'});
        });
    }


    /**
     * 防止重复提交
     */
    $("input:button,input:submit").on('click', function(){
        var _this = $(this),
            text = _this.val();
        _this.prop('disabled', true).val('操作中...');
        setTimeout(function(){
            _this.prop('disabled', false).val(text);
        }, 3000);
    });

});


/**
 * 模糊查询
 */
function auto(option) {

    //联想输入
    $(option.obj).wrap('<div class="check_field"></div>').after('<div class="C_check_field"></div>');
    var C_check_field = $('.C_check_field');
    C_check_field.css('width', $(option.obj).outerWidth());

    //联想列表
    $(option.obj).on('input propertychange', function (event) {

        var self = this;
        $(self).prop('autocomplete', 'off');
        if ($(self).val().length < 1) {
            C_check_field.hide().html('');
        } else {
            var dataObj = {};
            dataObj.datatime = +new Date;
            dataObj[option.dataName] = $(self).val();

            $.ajax({
                type: 'POST',
                url: option.url,
                data: dataObj
            }).done(function (data) {

                C_check_field.show().html('');
                console.log('联想列表', data);
                option.returnfn.call(option.obj, data, C_check_field);
            });
        }
    });

    C_check_field.on('click', function (event) {

        var target = $(event.target);
        var idx = target.data('idx');
        var namex = target.data('namex');
        $(option.obj).val(namex).data('idx', idx);
        /* 2015-11-25 data('idx', idx) */
        $(option.returnInput).val(idx);
        C_check_field.hide();
        /* 2015-11-25 */
        if (option.callback) {
            option.callback();
        }
    });

    $(document).on('click', function (event) {
        var target = $(event.target);
        if (target.closest('.preview').length == 0) {
            $('.C_check_field').hide();
        }
    });

}


(function ($) {
    /***************************
     * 提示并限制textarea的输入字数
     * 使用方式：
     *         $('').limitNum({
                countNum: textarea所需要的字数
              });
     */
    var defaults = {
        countNum: 20
    };

    $.fn.limitNum = function (options) {
        return this.each(function () {
            var me = this;
            me.opts = $.extend({}, defaults, options);

            //container
            var wordCount = $('<div></div>').addClass('wordCount');
            //wordWrap word
            var wordWrap = $('<span class="wordWrap"><span class="wordNum">' + me.opts.countNum + '</span>/' + me.opts.countNum + '</span>');
            $(this).wrap(wordCount).after(wordWrap);
            limitNum(this, me.opts);
        });
    };

    function limitNum($this, meopts) {
        var max = meopts.countNum;
        $($this).bind('input propertychange', function () {
            var curLength = $(this).val().length,
                wordNum = $(this).closest('.wordCount').find('.wordNum');
            wordNum.text(max - curLength);
            //console.log(curLength, max);
            /* textArea的文本长度大于maxLength */
            if (curLength > max) {
                /* 截断textArea的文本重新赋值 */
                $(this).val($(this).val().substring(0, max));
                wordNum.text(0);
            }
        });
    }
})(jQuery);