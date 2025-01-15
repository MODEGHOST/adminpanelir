<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Thanachart Capital Public Company Limited</title>

<script type="text/javascript" language="JavaScript" src="./cal_files/js_si_common.js"></script>
<script type="text/javascript" language="JavaScript" src="./cal_files/js_ir_common.js"></script>

<style type="text/css">
<!--
.hdtuss {
	font-size: 24px;
	color: #03C;
}
.b11 {font-size: 13px}
-->
  .textbox { 
    height: 25px; 
    width: 175px; /*275*/
    background-color: transparent;  
    border-style: solid;  
    border-width: 0px 0px 1px 0px;  
    border-color: darkred; 
    outline:0;
	text-align:center;
  }  
.txtboxdot { 
      width: 175px; /*275*/
    border: solid 1px #ccc;
    height: 16px;
    background: #5E768D;
    background: -moz-linear-gradient(top, #546A7F 0%, #5E768D 20%);
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #546A7F), color-stop(20%, #5E768D));
    border-radius: 5px;
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-box-shadow: 0 1px 0 #f2f2f2;
    -webkit-box-shadow: 0 1px 0 #F2F2F2;
    font-family: sans-serif;
    font-size: 12px;
    color: #F2F2F2;
    text-transform: uppercase;
    text-shadow: 0 -1px 0 #334F71;
	text-align:right;
}

.textbox:focus {
    background: #728EAA;
    background: -moz-linear-gradient(top, #668099 0%, #728EAA 20%);
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #668099), color-stop(20%, #728EAA));
    outline: 0;
}
  .txtboxcolor { 
   background-color : #fcffec; 
    border: 1px solid #848484; 
    height:16px; 
    width: 175px; 
    outline:0;
	text-align:center; 
  } 
  .txtresult {
    padding: 1px 20px;
    border: 0;
    height: 25px;
    width: 175px;
    border-radius: 10px;
    -moz-border-radius: 10px;
    -webkit-border-radius: 10px;
    box-shadow: 1px 1px 0 0 #FFF, 5px 5px 40px 2px #BBB inset;
    -moz-box-shadow: 1px 1px 0 0 #FFF, 5px 5px 40px 2px #BBB inset;
    -webkit-box-shadow: 1px 1px 0 0 #FFF, 5px 5px 40px 2px #BBB inset;
    -webkit-background-clip: padding-box;
    outline: 0;
	text-align:center;
}

</style> 


</head>

<body id="onload">
<div id="wrapper">
<div id="content">
  <div id="columnRight">
<script>

function ir_calculateCommission(value)
{
	var min_comm = document.calculator.min_commission_enter.value;

	var comm = value * (document.calculator.commission_enter.value / 100);
	if (comm < min_comm) { comm = min_comm; }

	return comm;
}

function ir_calculateAmount()
{
	// Get values for Shares Held, Price Purchase and Price Sold
	document.calculator.shares_held.value = si_formatNumber(document.calculator.shares_held_enter.value, "###,###,###,###,###,###,###");
	document.calculator.price_purchase.value = si_formatNumber(document.calculator.price_purchase_enter.value, "###,###,###,###,###,###,###");
	document.calculator.price_sold.value = si_formatNumber(document.calculator.price_sold_enter.value, "###,###,###,###,###,###,###");

	if (document.calculator.shares_held_enter.value && document.calculator.price_purchase_enter.value && document.calculator.price_sold_enter.value)
	{
  	// Calculate Profit
  	var buy_value=document.calculator.shares_held_enter.value*document.calculator.price_purchase_enter.value;
  	var sell_value=document.calculator.shares_held_enter.value*document.calculator.price_sold_enter.value;
  	var profit=sell_value-buy_value;

  	document.calculator.profit.value = si_formatNumber(profit.toFixed(2), "###,###,###,###,###,###,###");

  	var commission=parseFloat(ir_calculateCommission(buy_value))+parseFloat(ir_calculateCommission(sell_value));

  	var total_fee=parseFloat(commission);
  	var vat=total_fee*(document.calculator.vat_enter.value/100);
  	var comm_vat=parseFloat(total_fee)+parseFloat(vat);

  	document.calculator.commission.value = si_formatNumber(commission.toFixed(2), "###,###,###,###,###,###,###");
  	document.calculator.vat.value = si_formatNumber(vat.toFixed(2), "###,###,###,###,###,###,###");

  	var net_profit=parseFloat(profit)-comm_vat;
  	document.calculator.net_profit.value = si_formatNumber(net_profit.toFixed(2), "###,###,###,###,###,###,###");

  	var buy_comm=parseFloat(ir_calculateCommission(buy_value));
  	    var buy_vat=parseFloat(buy_comm * (document.calculator.vat_enter.value/100));
  	    var invest_change_percent=(net_profit/(parseFloat(buy_value)+parseFloat(buy_comm)+parseFloat(buy_vat)))*100;

  	document.calculator.invest_change_percent.value = si_formatNumber(invest_change_percent.toFixed(3), "###,###,###,###,###,###,###");
  }
  else
  {
    document.calculator.profit.value='';
    document.calculator.commission.value='';
    document.calculator.vat.value='';
    document.calculator.net_profit.value='';
    document.calculator.invest_change_percent.value='';
  }

  // Calculate Dividend
	if (document.calculator.shares_held_enter.value && (document.calculator.dividend_taxed_enter.value || document.calculator.dividend_tax_exempt_enter.value))
	{
	  var dividend_taxed = document.calculator.dividend_taxed_enter.value ? document.calculator.dividend_taxed_enter.value : 0;
	  var dividend_tax_exempt = document.calculator.dividend_tax_exempt_enter.value ? document.calculator.dividend_tax_exempt_enter.value : 0;

	  var net_dividend=document.calculator.shares_held_enter.value * (parseFloat(dividend_taxed * 0.9) + parseFloat(dividend_tax_exempt));
	  document.calculator.net_dividend.value = si_formatNumber(net_dividend.toFixed(2), "###,###,###,###,###,###,###");
	}
	else
	{
	  document.calculator.net_dividend.value='';
	}
}
</script>
<form name="calculator">
<table width="600" cellspacing="1" cellpadding="3" border="0" class="ir_table">
  <tbody><tr>
    <td colspan="3"><div class="hdtuss">เครื่องคำนวณ การลงทุน</div><br>
      <br>
    </td>
  </tr>
  <tr>
    <td width="26%" class="b11">ราคาซื้อ</td>
    <td width="44%" class="b11"><input class="txtboxcolor" type="text" name="price_purchase_enter" onChange="javascript:ir_calculateAmount();"> 
      &nbsp;บาท</td>
    <td width="30%" rowspan="6" valign="top" class="b11"><b>วิธีการใช้งาน:</b><br>
        <br>
        ในการคำนวณมูลค่ากำไร หรือ ขาดทุน  กรุณากรอกข้อมูลใน 3 ช่องดังต่อไปนี้ : &nbsp;“ราคาที่ซื้อ”, “จำนวนหุ้นที่ถือ” และ “ราคาขาย”</td>
  </tr>
  <tr>
    <td class="b11">จำนวนหุ้นที่ถือ</td>
    <td class="b11"><input class="txtboxcolor" type="text" name="shares_held_enter" onChange="javascript:ir_calculateAmount();"> 
      &nbsp; หุ้น </td>
  </tr>
  <tr>
    <td class="b11">ค่าคอมมิสชั่น</td>
    <td class="b11"><input name="commission_enter" type="text" class="textbox" onChange="javascript:ir_calculateAmount();" value="0.2578" readonly="true"> 
      &nbsp; % </td>
  </tr>
  <tr>
    <td class="b11">คอมมิสชั่นขั้นต่ำ</td>
    <td class="b11"><input name="min_commission_enter" type="text" class="textbox" onChange="javascript:ir_calculateAmount();" value="50" readonly="true">
&nbsp;บาท</td>
  </tr>
  <tr>
    <td class="b11">ภาษีมูลค่าเพิ่ม</td>
    <td class="b11"><input name="vat_enter" type="text" class="textbox" onChange="javascript:ir_calculateAmount();" value="7" readonly="true"></td>
  </tr>
  <tr>
    <td class="b11">ราคาขาย</td>
    <td class="b11"><input class="txtboxcolor" type="text" name="price_sold_enter" value="" onChange="javascript:ir_calculateAmount();">
&nbsp;บาท</td>
  </tr>
  <tr>
    <td colspan="3"><div class="ir_textDivider"></div></td>
  </tr>
  <tr>
    <td colspan="3" class="b11"><b>เงินปันผลต่อหุ้น</b></td>
  </tr>
  <tr>
    <td class="b11">หักภาษี </td>
    <td colspan="2" class="b11"><input type="text" name="dividend_taxed_enter" onChange="javascript:ir_calculateAmount();" style="text-align:center; background-color:#FFFFCC">      &nbsp;บาท</td>
  </tr>
  <tr>
    <td class="b11">ยกเว้นภาษี</td>
    <td colspan="2" class="b11"><input type="text" name="dividend_tax_exempt_enter" onChange="javascript:ir_calculateAmount();" style="text-align:center; background-color:#FFFFCC">
&nbsp;บาท</td>
  </tr>
</tbody></table>

<br>

<table width="600" cellspacing="1" cellpadding="3" border="0" class="ir_table ir_tableBorder">
  <tbody><tr class="row2">
    <td width="47%" class="b11">จำนวนหุ้นที่ถือ</td>
    <td width="53%" class="b11"><input type="text" name="shares_held" onFocus="document.calculator.shares_held_enter.select();" class="txtboxdot">
&nbsp;หุ้น</td>
  </tr>
  <tr class="row2">
    <td class="b11">ราคาที่ซื้อต่อหุ้น</td>
    <td class="b11"><input type="text" name="price_purchase" onFocus="document.calculator.price_purchase_enter.select();"  class="txtboxdot" >
&nbsp;บาท</td>
  </tr>
  <tr class="row2">
    <td class="b11">ราคาที่ขาย</td>
    <td class="b11"><input type="text" name="price_sold" onFocus="document.calculator.price_sold_enter.select();" class="txtboxdot">
&nbsp;บาท</td>
  </tr>
  <tr class="row2">
    <td class="b11">กำไร(ขาดทุน) ขั้นต้น ก่อนหักค่าคอมมิชชั่น</td>
    <td class="b11"><input type="text" name="profit" onFocus="document.calculator.shares_held_enter.select();" class="txtboxdot">
&nbsp;บาท</td>
  </tr>
  <tr class="row2">
    <td class="b11">จำนวนค่าคอมมิชชั่น</td>
    <td class="b11"><input name="commission" type="text" class="txtboxdot" onFocus="document.calculator.commission_enter.select();" readonly="true">
&nbsp;บาท</td>
  </tr>
  <tr class="row2">
    <td class="b11">ภาษีมูลค่าเพิ่มขั้นต่ำ</td>
    <td class="b11"><input name="vat" type="text" class="txtboxdot" onFocus="document.calculator.vat_enter.select();" readonly="true">
&nbsp;บาท</td>
  </tr>
  <tr class="row2">
    <td class="b11">กำไร(ขาดทุน)สุทธิ</td>
    <td class="b11"><input type="text" name="net_profit" onFocus="document.calculator.shares_held_enter.select();" class="txtboxdot">
&nbsp;บาท</td>
  </tr>
  <tr class="row2">
    <td class="b11">คิดเป็นเป็นร้อยละของหน่วยลงทุน</td>
    <td class="b11"><input type="text" name="invest_change_percent" onFocus="document.calculator.shares_held_enter.select();" class="txtboxdot">
&nbsp;%</td>
  </tr>
</tbody></table>

<br>

<table width="600" cellspacing="1" cellpadding="3" border="0" class="ir_table ir_tableBorder">
  <tbody><tr class="row1">
    <td width="54%" class="b11">เงินปันผลขั้นต้น</td>
    <td width="46%" class="b11"><input class="txtresult" type="text" name="net_dividend" onFocus="document.calculator.dividend_taxed_enter.select();" class="ir_investmentCalculator">
&nbsp;บาท</td>
  </tr>
</tbody></table>

</form>
</div>
            
</div>
<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-17781388-4']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>
</div></body></html>