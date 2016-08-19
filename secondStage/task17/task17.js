/*
1.参考以下示例代码，原始数据包含几个城市的空气质量指数数据
2.用户可以选择查看不同的时间粒度，以选择要查看的空气质量指数是以天为粒度还是以周或月为粒度
天：显示每天的空气质量指数
周：以自然周（周一到周日）为粒度，统计一周7天的平均数为这一周的空气质量数值，如果数据中缺少一个自然周的几天，则按剩余天进行计算
月：以自然月为粒度，统一一个月所有天的平均数为这一个月的空气质量数值
3.用户可以通过select切换城市
通过在"aqi-chart-wrap"里添加DOM，来模拟一个柱状图图表，横轴是时间，纵轴是空气质量指数，参考图（点击打开）。天、周、月的数据只根据用户的选择显示一种。
天：每天的数据是一个很细的矩形
周：每周的数据是一个矩形
月：每周的数据是一个很粗的矩形
4.鼠标移动到柱状图的某个柱子时，用title属性提示这个柱子的具体日期和数据
 */



/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;//返回年月日
}
function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");//开始日期
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);//获得目标格式
    returnData[datStr] = Math.ceil(Math.random() * seed);//获取随机空气质量,每一月的每一天根据seed产生不同质量
    dat.setDate(dat.getDate() + 1);//更新日期
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),//返回了数组
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: '',
  nowGraTime: "day"
}

/**
 * 渲染图表
 */
function renderChart() {
   //创建图表
   
   var oDchart=document.getElementsByClassName('aqi-chart-wrap')[0];//注意兼容，在 Internet Explorer 5,6,7,8 中无效。
  oDchart.innerHTML='';

  setStyle(oDchart,'width:100%;height:600px;border:1px #aaa solid;margin-top:10px;');
   
  for(var d in chartData){
 // console.log(d);
   var oDiv=document.createElement('div'),
       oSpan=document.createElement('span'),
       color='',
       height='';

       color='rgb('+parseInt(256*Math.random())+','+parseInt(256*Math.random())+','+parseInt(256*Math.random())+')';
       height=chartData[d];
       //console.log(pageState.nowGraTime);
       oSpan.innerHTML='data:'+d+'<br>'+'num:'+height;
      oDiv.className='bar '+pageState.nowGraTime;//添加类来控制对应宽度
      oSpan.className='intro';
      setStyle(oDiv, 'height:'+height+'px;background:'+color+';');
      //setStyle(oSpan,'display:none;');
      oDiv.appendChild(oSpan);
      oDchart.appendChild(oDiv);

      oDiv.onmouseover=hoverShow;
      oDiv.onmouseout=hoverHide;
  }
 
 
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  // 确定是否选项发生了变化 /判断.checked
   var oTime=this.value;
    pageState.nowGraTime=oTime;

  // 设置对应数据
    
  // 调用图表渲染函数
  initAqiChartData();
  renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 
  var nowCindex=this.selectedIndex,
      oPcity=this.getElementsByTagName('option');
      console.log(this);  
 // this.value直接就是oPcity[0].value
  if(nowCindex===0){
     pageState.nowSelectCity=oPcity[0].value;
  }
  else {
   pageState.nowSelectCity=oPcity[this.selectedIndex].value;
   initAqiChartData();
  }



 
  // 设置对应数据

  // 调用图表渲染函数
  renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
      var oField=document.getElementById('form-gra-time');
      
      delegateEvent(oField,'input','click',graTimeChange);
          
}
/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var oScity=document.getElementById('city-select'),
      oPcity=oScity.getElementsByTagName('option'); 
      oPcitycon='';
      pageState.nowSelectCity=oPcity[0].value;
  for(var city in aqiSourceData){
   //获得对应city的object
    oPcitycon+='<option '+'value='+city+'>'+city+'</option>';
  }
   
  oScity.innerHTML=oPcitycon;
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
    oScity.onclick=citySelectChange;

    //变化使用onchange函数
   //change是发生在父元素上的，所以不用代理
//option和select都没有click事件

}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中

  var city=pageState.nowSelectCity,
      type=pageState.nowGraTime;
 
   switch(type){
      case 'day':
        chartData=aqiSourceData[city];
  
        break;
      case 'week':
      //getDay返回星期0-6
      var week=1,count=0,totalNum=0;
          chartData={};//清空原有的数据
    for(var d in aqiSourceData[city]){
      
      var date=new Date(d),
          weekDay=date.getDay();
     
         if(weekDay===6){
          count++;
          totalNum+=aqiSourceData[city][d];         
          chartData['week'+week]=Math.round(totalNum/count);
           week++;
           count=0;
           totalNum=0;
          
         }else{
          count++;//统计多少天
           totalNum+=aqiSourceData[city][d];
         }
    }
      
        break;
      case 'month':
      var month=1,count=0,totalNum=0;
          chartData={};//清空原有的数据
       for(var d in aqiSourceData[city]){
          var date=new Date(d),
          monthDay=date.getMonth();

       if(month===monthDay+1){
        count++;
        totalNum+=aqiSourceData[city][d];
       }else{
         
         count=1;
         totalNum=aqiSourceData[city][d];
         month++;
         
       }
      
       chartData['month'+month]=Math.round(totalNum/count);//在同一个月时月份不变，但是平均值是在不断更新的，最后得出最终一个月的平均值
    }
        break;
    } 
  renderChart();
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
 initCitySelector();
  initAqiChartData();

}

init();

function addEvents(obj,sEv,fn) {
  if(obj.addEventListener){
    obj.addEventListener(sEv,fn,false);
  }
  if (obj.attachEvent) {
    obj.attachEvent('on'+sEv,fn);
  }
}

function delegateEvent(element,tag,eventName,listener) {
  return addEvents(element,eventName,function (event) {
    var e=event||window.event,
        target=e.target||e.srcElement;
    if(target.tagName.toLocaleLowerCase()===tag){
      listener.call(target,e);
    }

  });
}

function setStyle(obj,strCss) {
    function endWith(str,suffix) {
      var l=str.length-suffix.length;
      return l>=0 &&str.indexOf(suffix,l) == l;//分号要在对应位置上
    }
  var sty = obj.style,
      cssText=sty.cssText;
   if(!endWith(cssText,';')){
    cssText+=';';//只有返回的最后一个样式可能缺少;
   }

    sty.cssText=cssText+strCss;
}

function hoverShow() {
  //给span加displaynone和block不起作用,不过是否有必要改变它的属性？
  var intro=this.childNodes[0];
  intro.style.visibility='visible';
}
function hoverHide() {
//visibility 属性规定元素是否可见。即使不可见的元素也会占据页面上的空间。请使用 "display" 属性来创建不占据页面空间的不可见元素。
  var intro=this.childNodes[0];
  intro.style.visibility='hidden';
}
//document.form[0].name可以直接调用表单下name为某值的节点，http://blog.kkbruce.net/2012/02/javascript-form-element.html#.Vvtwa9wabBI
