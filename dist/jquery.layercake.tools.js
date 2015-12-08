/********************
 * layercake
 * PC端 JS工具集
 * 因为是内容使用，不保证通用
 * Created by 程旭 on 15/11/19.
 */
;
(function ($, window, document, undefined) {
    'use strict';

    /************
     * 绑定键值改变监控
     * jQuery 事件valuechange
     * @type {{teardown: Function, handler: Function, add: Function, triggerChanged: Function}}
     */
    $.event.special.valuechange = {
        teardown: function (namespaces) {
            $(this).unbind('.valuechange');
        },
        handler: function (e) {
            $.event.special.valuechange.triggerChanged($(this));
        },
        add: function (obj) {
            $(this).on('keyup.valuechange cut.valuechange paste.valuechange input.valuechange', obj.selector, $.event.special.valuechange.handler)
        },
        triggerChanged: function (element) {
            var current = element[0].contentEditable === 'true' ? element.html() : element.val()
                , previous = typeof element.data('previous') === 'undefined' ? element[0].defaultValue : element.data('previous');
            if (current !== previous) {
                element.trigger('valuechange', [element.data('previous')]);
                element.data('previous', current);
            }
        }
    };

    // 工具对象
    var tools = {
        isJSON: function (opt) {
            return typeof(opt) === "object" && Object.prototype.toString.call(opt).toLowerCase() && !opt.length;
        },
        isFunction: function (opt) {
            return ({}).toString.call(opt) === "[object Function]";
        },
        isString: function (opt) {
            return typeof opt === 'string';
        },
        isArray: function (opt) {
            return opt instanceof Array;
        },
        jsonStringify: function (opt) {
            return opt === undefined || typeof opt === "function" ? '' : JSON.stringify(opt);
        },
        jsonParse: function (opt) {
            return !opt || typeof opt === 'undefined' ? '' : JSON.parse(opt);
        }
    };

    $.SW = {
        /*******************
         * 数据本地存储
         * $.SW.storage.storage 是否支持存储
         * $.SW.storage.set('key', {id:1, name:'成功'}); // 设置数据 相同的key就是替换
         * $.SW.storage.add('key', {id:1, name:'成功'}); // 添加数据，返回的是个数组[{},{},'',{}]
         * $.SW.storage.get('key'); // 获取数据
         * $.SW.storage.clear(optName); // 清除所有数据 当填入optName时，只清除optName的数据
         * http://www.html-js.com/article/2635
         */
        storage: {
            storage: !!window.localStorage,
            set: function (optName, options) {
                localStorage.setItem(optName, tools.stringify(options));
                return this;
            },
            add: function (optName, options) {
                if (typeof options !== 'undefined') {
                    var opts = this.get(optName) || [];
                    opts.push(options);
                    this.set(optName, opts);
                }
                return this;
            },
            get: function (optName) {
                return tools.parse(localStorage.getItem(optName));
            },
            clear: function (optName) {
                if (typeof optName !== 'undefined') {
                    localStorage.removeItem(optName);
                } else {
                    localStorage.clear();
                }
                return this;
            }
        },
        /*****************
         * 数字格式化
         * console.log('add', $.SW.NUM.add(13.2, 13.333333333333));
         * console.log('sub', $.SW.NUM.sub(13.333333333, 12.3333));
         * console.log('mul', $.SW.NUM.mul(13.333333333, 12.3333));
         * console.log('div', $.SW.NUM.div(13.333333333, 12.3333));
         * console.log('toDecimal', $.SW.NUM.toDecimal('17%'));
         * console.log('toPercentFormat', $.SW.NUM.toPercentFormat(0.17));
         */
        NUM: {
            add: function (arg1, arg2) {
                var r1, r2, m;
                try {
                    r1 = arg1.toString().split(".")[1].length;
                } catch (e) {
                    r1 = 0;
                }
                try {
                    r2 = arg2.toString().split(".")[1].length;
                } catch (e) {
                    r2 = 0;
                }
                m = Math.pow(10, Math.max(r1, r2));
                return (this.mul(arg1, m) + this.mul(arg2, m)) / m;
            },
            sub: function (arg1, arg2) {
                return this.add(arg1, -arg2);
            },
            mul: function (arg1, arg2) {
                var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
                try {
                    m += s1.split(".")[1].length;
                } catch (e) {
                }
                try {
                    m += s2.split(".")[1].length;
                } catch (e) {
                }
                return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
            },
            div: function (arg1, arg2) {
                var t1 = 0, t2 = 0, r1, r2;
                try {
                    t1 = arg1.toString().split(".")[1].length;
                } catch (e) {
                }
                try {
                    t2 = arg2.toString().split(".")[1].length;
                } catch (e) {
                }
                r1 = Number(arg1.toString().replace(".", ""));
                r2 = Number(arg2.toString().replace(".", ""));
                return (r1 / r2) * Math.pow(10, t2 - t1);
            },
            /****
             * 转化成小数, 原函数 toDecimal(datavalue) 存在的精度问题，因涉及过多屏蔽。
             * @param datevalue
             * @returns {*}
             */
            toDecimal: function (datevalue) {
                if (datevalue.indexOf('%') != -1) {
                    datevalue = datevalue.replace(/%/g, '');
                    if (datevalue.indexOf(',') != -1) {
                        datevalue = datevalue.replace(/,/g, '');
                    }
                    // 除100精度在原有基础上增加2位。
                    var decimal = (datevalue.indexOf('.') == -1) ? 0 : (datevalue.length - datevalue.indexOf('.') - 1);
                    datevalue = this.div(datevalue, 100).toFixed(decimal + 2);
                } else {
                    if (datevalue.indexOf(',') != -1) {
                        datevalue = datevalue.replace(/,/g, '');
                    }
                }
                return datevalue;
            },
            /*****
             * 小数 转 百分比%
             * @param datevalue
             * @returns {string}
             */
            toPercentFormat: function (datevalue) {
                var aa = this.mul(datevalue, 100);
                return "" + aa + "%";
            },
            /******
             * 传入 金额 返回 大写金额
             * @param currencyDigits
             * @returns {string}
             */
            convertCurrency: function(currencyDigits){
                var MAXIMUM_NUMBER = 99999999999.99;
                // Predefine the radix characters and currency symbols for output:
                var CN_ZERO = "零";
                var CN_ONE = "壹";
                var CN_TWO = "贰";
                var CN_THREE = "叁";
                var CN_FOUR = "肆";
                var CN_FIVE = "伍";
                var CN_SIX = "陆";
                var CN_SEVEN = "柒";
                var CN_EIGHT = "捌";
                var CN_NINE = "玖";
                var CN_TEN = "拾";
                var CN_HUNDRED = "佰";
                var CN_THOUSAND = "仟";
                var CN_TEN_THOUSAND = "万";
                var CN_HUNDRED_MILLION = "亿";
                var CN_DOLLAR = "元";
                var CN_TEN_CENT = "角";
                var CN_CENT = "分";
                var CN_INTEGER = "整";
                var CN_SYMBOL = "人民币";

// Variables:
                var integral;    // Represent integral part of digit number.
                var decimal;    // Represent decimal part of digit number.
                var outputCharacters;    // The output result.
                var parts;
                var digits, radices, bigRadices, decimals;
                var zeroCount;
                var i, p, d;
                var quotient, modulus;

// Validate input string:
                currencyDigits = currencyDigits.toString();
                if (currencyDigits == "") {
                    alert("请输入小写金额！");
                    return "";
                }
                if (currencyDigits.match(/[^,.\d]/) != null) {
                    alert("小写金额含有无效字符！");
                    return "";
                }
                if ((currencyDigits).match(/^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/) == null) {
                    alert("小写金额的格式不正确！");
                    return "";
                }

// Normalize the format of input digits:
                currencyDigits = currencyDigits.replace(/,/g, "");    // Remove comma delimiters.
                currencyDigits = currencyDigits.replace(/^0+/, "");    // Trim zeros at the beginning.
                // Assert the number is not greater than the maximum number.
                if (Number(currencyDigits) > MAXIMUM_NUMBER) {
                    alert("金额过大，应小于1000亿元！");
                    return "";
                }

// Process the coversion from currency digits to characters:
                // Separate integral and decimal parts before processing coversion:
                parts = currencyDigits.split(".");
                if (parts.length > 1) {
                    integral = parts[0];
                    decimal = parts[1];
                    // Cut down redundant decimal digits that are after the second.
                    decimal = decimal.substr(0, 2);
                }
                else {
                    integral = parts[0];
                    decimal = "";
                }
                // Prepare the characters corresponding to the digits:
                digits = new Array(CN_ZERO, CN_ONE, CN_TWO, CN_THREE, CN_FOUR, CN_FIVE, CN_SIX, CN_SEVEN, CN_EIGHT, CN_NINE);
                radices = new Array("", CN_TEN, CN_HUNDRED, CN_THOUSAND);
                bigRadices = new Array("", CN_TEN_THOUSAND, CN_HUNDRED_MILLION);
                decimals = new Array(CN_TEN_CENT, CN_CENT);
                // Start processing:
                outputCharacters = "";
                // Process integral part if it is larger than 0:
                if (Number(integral) > 0) {
                    zeroCount = 0;
                    for (i = 0; i < integral.length; i++) {
                        p = integral.length - i - 1;
                        d = integral.substr(i, 1);
                        quotient = p / 4;
                        modulus = p % 4;
                        if (d == "0") {
                            zeroCount++;
                        }
                        else {
                            if (zeroCount > 0)
                            {
                                outputCharacters += digits[0];
                            }
                            zeroCount = 0;
                            outputCharacters += digits[Number(d)] + radices[modulus];
                        }
                        if (modulus == 0 && zeroCount < 4) {
                            outputCharacters += bigRadices[quotient];
                            zeroCount = 0;
                        }
                    }
                    outputCharacters += CN_DOLLAR;
                }
                // Process decimal part if there is:
                if (decimal != "") {
                    for (i = 0; i < decimal.length; i++) {
                        d = decimal.substr(i, 1);
                        if (d != "0") {
                            outputCharacters += digits[Number(d)] + decimals[i];
                        }
                    }
                }
                // Confirm and return the final output string:
                if (outputCharacters == "") {
                    outputCharacters = CN_ZERO + CN_DOLLAR;
                }
                if (decimal == "") {
                    outputCharacters += CN_INTEGER;
                }
                // outputCharacters = CN_SYMBOL + outputCharacters;
                return outputCharacters;
            }

        }
    };

    /**********
     * 弹出窗口
     * 调用方式：$('.winOpen').winOpen({url:'链接地址', width:100, height:100});
     *          url 可以是字符串，也可以是function(){ return url字符串 }
     *      例：<div id="tools1" class="tools" data-win-url="1.jsp"></div>
     *         $('.tools').winOpen({
     *              url: function(){
     *                  return $(this).data('win-url')
     *              }
     *          });
     * @param options
     */
    $.fn.winOpen = function (options) {
        return this.each(function () {
            var me = this;
            me.opt = $.extend({}, {
                width: 1104,
                height: 600,
                winName: ''
            }, options);

            if (typeof me.opt.url !== 'undefined') {
                // 处理获取水平居中参数
                if (me.opt && typeof me.opt.left === 'undefined') {
                    // 屏幕分辨率的高 window.screen.width
                    me.opt.left = (window.screen.width - 10 - me.opt.width) / 2;
                }
                (window.screen.height - 30 - me.opt.height) <= 0 && (me.opt.height = (window.screen.height - 30));
                if (me.opt && typeof me.opt.top === 'undefined') {
                    me.opt.top = (window.screen.height - 30 - me.opt.height) / 2;
                }

                winOpenFn(this, me.opt);
            }
        });

        /****
         * 为每一个绑定点击事件
         * @param $this
         * @param meOpt
         */
        function winOpenFn($this, meOpt) {
            $($this).off('click').on('click', function (event) {
                event.stopPropagation();

                if (tools.isFunction(meOpt.url)) {
                    meOpt.url = meOpt.url.call($this);
                }
                // window.open 是相对于整个屏幕的 left top
                window.open(meOpt.url, meOpt.winName, 'width=' + meOpt.width + ', height=' + meOpt.height + ', top=' + meOpt.top + ', left=' + meOpt.left + ', toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no');
            });
        }
    };

    /****************************
     * 点击小图，展示大图
     * 使用方式：
     *      <div id="picList" data-min-pic="images/pic1-min.jpg,images/pic2-min.jpg,images/pic1-min.jpg,images/pic2-min.jpg" data-max-pic="images/pic1.jpg,images/pic2.jpg,images/pic1.jpg,images/pic2.jpg">图片组效果</div>
     *      $('#picList').zoomPic();
     *
     *      <img src="images/pic1-min.jpg" data-max-pic="images/pic1.jpg" style="margin: 20px; float: left;"/>
     *      <img src="images/pic2-min.jpg" data-max-pic="images/pic2.jpg" style="margin: 20px; float: left;"/>
     *      $('img').zoomPic({
     *          maxData: 'max-pic'
     *      });
     *
     * @param options
     *          maxData:'max-pic 表示当前点击的data-max-pic内的数据，用,分隔',
     *          minData:'',
     *          maxPic:'当此处 设置了图片地址',
     *          minPic:''
     * @returns {*}
     */
    $.fn.zoomPic = function (options) {

        /*****
         * 点击的位置不是图片框内时，删除图片
         */
        function eventRemove() {
            $(document.body).off('click.zoomPic').on('click.zoomPic', function (event) {
                event.stopPropagation();
                var $target = $(event.target);
                if ($(this).find('#zoom-pic').length > 0 && $target.closest('#zoom-pic').length === 0) {
                    $('#zoom-pic').remove();
                } else if ($(this).find('#zoom-list').length > 0 && $target.closest('#zoom-list').length === 0 && $target.closest('#zoom-pic').length === 0) {
                    $('#zoom-list').remove();
                }
            });
        }

        /********
         * 显示大图
         */
        function showMaxPic(imgUrl) {
            $(document.body).find('.bd').append('<div class="zoom-pic zoom-radius zoom-shadow" id="zoom-pic"><span id="zoom-loading">正在加载图片</span><img src="' + imgUrl + '" /></div>');
            var img = new Image();
            img.onload = function () {
                picResize($('#zoom-pic'), {width: img.width, height: img.height});
            };
            img.src = imgUrl;
        }

        /*********
         * 重置图片大小尺寸
         * @param $zoom
         * @param opt
         */
        function picResize($zoom, opt) {
            $zoom.css({
                width: opt.width,
                height: opt.height,
                marginLeft: -1 * ((opt.width + 20) / 2),
                marginTop: -1 * ((opt.height + 20) / 2)
            }).addClass('show');
        }

        /**************
         * 获取图片地址列表
         * 当设置了图片地址后，就不获取data的数据了
         * @param me 当前对象
         * @param data 当前
         * @param img
         * @returns {*}
         */
        function getImgSrc(me, data, img) {
            var imgList = !img || typeof img === 'undefined' ? $(me).data(data) : img;
            if (typeof imgList !== 'undefined') {
                imgList = imgList.split(',');
            }
            return imgList;
        }

        /**********
         * 展示图片列表
         * @param me
         * @param minList
         * @param maxList
         */
        function zoomList(me, minList, maxList) {
            $('#zoom-list').remove();
            var _ = '';
            $.each(minList, function (k, v) {
                _ += '<img src="' + v + '" data-max-pic="' + maxList[k] + '" />';
            });
            var __zoomList = $('<div class="zoom-list zoom-radius zoom-shadow" id="zoom-list"><div class="zoom-overflow">' + _ + '</div></div>');
            __zoomList.css({
                left: $(me).offset().left + 'px',
                top: ($(me).offset().top + $(me).scrollTop() + $(me).outerHeight(true) + 5) + 'px'
            });
            $(document.body).find('.bd').append(__zoomList);

            __zoomList.on('click', 'img', function (event) {
                event.stopPropagation();
                $('#zoom-pic').remove();
                showMaxPic($(this).data('max-pic'));
            });
        }

        return this.each(function () {

            var me = this;
            me.opt = $.extend({}, {
                maxData: 'max-pic', // 数据存储点
                minData: 'min-pic',
                maxImg: '', // 设置好的大图
                minImg: ''
            }, options);

            $(me).on('click', function (event) {
                event.stopPropagation();
                $('#zoom-pic').remove();
                eventRemove();
                // 获取大图列表
                var maxList = getImgSrc(me, me.opt.maxData, me.opt.maxImg);

                switch (maxList.length) {
                    case 0:
                        alert('对不起，没有得到大图地址');
                        break;
                    case 1:
                        // 显示一张大图
                        showMaxPic(maxList[0]);
                        break;
                    default:
                        // 显示一组小图，点击小图展示大图
                        zoomList(me, getImgSrc(me, me.opt.minData, me.opt.minImg), maxList);
                }
            });
        });
    };


    /*******************
     * 防止重复点击
     * @param options
     */
    $.fn.disableBtn = function(options){
        var me = this;
        me.opt = $.extend({}, {
            time: 1000 // 防止重复点击，按钮的失效时间
        }, options);

        return this.each(function(){
            $(this).on('click', function(event){
                event.stopPropagation();
                $(this).prop('disabled', true);
                removeDisable(this);
            });
        });

        function removeDisable($this){
            setTimeout(function(){
                $($this).prop('disabled', false);
            }, me.opt.time);
        }
    };

    /****************
     * 截图、拖入图片、文件上传
     * @param options
     */
    $.fn.unloadPic = function (options) {
        return this.each(function(){
            var me = this;
            me.opt = $.extend({}, {
                url: '', // 上传地址
                pid: '',
                maxImg: '', // 设置好的大图
                minImg: ''
            }, options);

        });

    };

})(window.jQuery, window, document);
