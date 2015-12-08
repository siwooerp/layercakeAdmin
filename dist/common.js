/**
 * Created by 程旭 on 15/12/8.
 */
$(document).ready(function () {

    // 重置JS页面要用到的域名地址
    window.url_dns = window.location.origin + '/layercake_admin';
    window.url_dns_erp = window.location.origin;
    // console.log(window.url_dns, window.url_dns_erp);

    // <img src="http://siwoo.oss-cn-hangzhou.aliyuncs.com/picnone.png" class="J_product_pic J_click_max" data-idx="商品ID" data-width="200 获取图片的尺寸">
    $('.J_product_pic').each(function () {
        var _self = $(this);
        _self.prop('src', url_dns_erp + '/layercake/product/pic/' + _self.data('idx') + '?width=' + _self.data('width'));
        _self.filter('.J_click_max').zoomPic({
            maxImg: url_dns_erp + '/layercake/product/pic/' + _self.data('idx')
        });
    });
});