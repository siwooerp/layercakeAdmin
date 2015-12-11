/**
 * Created by 程旭 on 15/12/8.
 */
$(document).ready(function () {

    // 重置JS页面要用到的域名地址
    window.url_dns = window.location.origin + '/layercake_admin';
    window.url_dns_erp = window.location.origin;
    //window.url_dns_erp = 'http://www.liblin.com.cn';
    // console.log(window.url_dns, window.url_dns_erp);


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

});

