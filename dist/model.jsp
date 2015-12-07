<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<%@ include file="../include.jsp" %>

<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title></title>

	<link rel="stylesheet" href="http://siwoo.oss-cn-hangzhou.aliyuncs.com/css/common.min.css">
	
</head>
<body>

<div class="bd">

	<div class="top clear">
		<div class="title">
			<div class="con checked">售后管理</div>
			<div class="r_box">

			</div>
		</div>
	</div>
	<form method="post" name="testForm" >
	<div class="formCode clear">
		<div class="form clear">
			<div class="box">
				<div class="label">退款编号：</div>
				<input id="refundCode" name="refundCode" type="text" value="${refund.refundCode }" onblur="chooseRefundCode()" />
			</div>
			<div class="box">
				<div class="label">订单编号：</div>
				<input id="tradeCode" name="tradeCode" type="text" value="${refund.tradeCode }" />
			</div>
			<div class="box">
				<div class="label">需求付款时间:</div>
				<input type="text" name="exceptDate"  id="exceptDate" />
			</div>
		</div>
		<div class="form clear">
			<div class="box">
				<div class="label">退款状态：</div>
				<select id="r_status" name="r_status">
					<option value="0">全部状态</option>
					<c:forEach  items="${r_statusList }" var="status" >
						<option value="${status.id }"  <c:if test="${refund.r_status eq status.id }">selected="selected"</c:if> >${status.name }</option>
					</c:forEach>
				</select>
			</div>
			<div class="box">
				<div class="label"></div>
				<input type="button" value="查找" onclick="getRefundList()" />
			</div>
		</div>

	</div>
	

	<c:if test="${refundList!=null}">
	<div class="page">
		<div class="ul titleUL J_fixedNav clear">
            <div class="li li3">退单号/订单号</div>
            <div class="li li2">退款金额</div>
            <div class="li li3">申请时间</div>
            <div class="li li2">退款类型/原因</div>
            <div class="li li2">退款状态</div>
            <div class="li li2">操&nbsp;&nbsp;作</div>
        </div>
		<c:forEach items="${refundList}" var="refund">
        <div class="ul clear">
            <div class="li li3">
                ${refund.refundCode }
				<hr>
                ${refund.tradeCode }
            </div>
            <div class="li li2">
                ${refund.r_fee_double }
            </div>
            <div class="li li3">
                ${refund.applyTime }
            </div>
            <div class="li li2">
            	${refund.r_type_str }
            	<hr>
                ${refund.r_reason_str }
            </div>
            <div class="li li2">
               ${refund.r_status_str } 
            </div>
            <div class="li li2 submit-center">
				<input type="button" class="J_refundDetil" data-idx="${refund.refundCode}" value="查看" />
            </div>
        </div>
		</c:forEach>
		<div class="pageNo">
            <div class="pageTxt">
				<div>${pageHtml }</div>
            </div>
        </div>

    </div>
	</c:if>
</form>

</div>

</body>

	<script src="http://siwoo.oss-cn-hangzhou.aliyuncs.com/jquery/jquery-1.11.3.min.js"></script>
	<!-- 时间插件 -->
	<link rel="stylesheet" href="http://siwoo.oss-cn-hangzhou.aliyuncs.com/jquery/jquery.datetimepicker.css">
	<script src="http://siwoo.oss-cn-hangzhou.aliyuncs.com/jquery/jquery.datetimepicker.full.js"></script>

	<!-- layercake插件 -->
	<link rel="stylesheet" href="http://siwoo.oss-cn-hangzhou.aliyuncs.com/jquery/layercake.tools.min.css">
	<script src="http://siwoo.oss-cn-hangzhou.aliyuncs.com/jquery/jquery.layercake.tools.min.js"></script>

	<!-- common.js -->
	<script src="http://siwoo.oss-cn-hangzhou.aliyuncs.com/jquery/common.min.js"></script>

	
	<script>

	$(document).ready(function(){

	    // 弹出窗
	    $('.J_refundDetil').winOpen({
	        url: function () {
	            return CTX + "/refund/refund/detail/get?refundCode=" + $(this).data('idx');
	        },
	        width:1300,
	        height:600
	    });


	    //时间控件
    	$('#exceptDate').datetimepicker({lang:'ch',format:'Y-m-d H:i'}); //显示年-月-日 时：分
		//$('#exceptDate').datetimepicker({lang:'ch',timepicker:false,format:'Y-m-d'}); //显示年-月-日

	});

	</script>

</html>