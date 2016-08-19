/*参考以下示例代码，用户输入城市名称和空气质量指数后，点击“确认添加”按钮后，就会将用户的输入在进行验证后，添加到下面的表格中，新增一行进行显示
用户输入的城市名必须为中英文字符，空气质量指数必须为整数
用户输入的城市名字和空气质量指数需要进行前后去空格及空字符处理（trim）
用户输入不合规格时，需要给出提示（允许用alert，也可以自行定义提示方式）
用户可以点击表格列中的“删除”按钮，删掉那一行的数据
*/

/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};
//aqiData是个对象不是数组
//要在有输入之后再获取值，否则undefined
/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
	//isNum判断是否为数字
var iCity=document.getElementById('aqi-city-input').value,
    iAir=document.getElementById('aqi-value-input').value;
      //判断输入的类型,且不为空
      if(!(/^[A-Za-z\u4E00-\u9FA5]+$/.test(iCity))){
           console.log('城市名称为中文或英文');
           return;
      }
      if (!(/^\d+$/.test(iAir))) {
      	console.log('空气质量为数字');
      	return;
      }else{
      	aqiData[iCity]=iAir;
      }
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
 var oTabele=document.getElementById('aqi-table'),
     trHead='<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>';
       //用这种方法trHead只是字符串，只有是节点是才能用innerHTML
       //json会自动替换相同的属性？
    for(var iCity in aqiData){
   
      trHead+='<tr><td>'+iCity+'</td>'+'<td>'+aqiData[iCity]+'</td>'+'<td><button>删除</button></td></tr>';
    }
//console.log(iCity);//iCithy并没有因为for in结束而消失
oTabele.innerHTML=iCity?trHead:'';
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  addAqiData();
  renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle() {
  // do sth.
  var tagCity=this.parentNode.previousSibling.previousSibling.innerHTML;
delete aqiData[tagCity];
  renderAqiList();
}

function init() {

  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数

  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
    var btn=document.getElementById('add-btn'),
       oTabele=document.getElementById('aqi-table');
    addEvents(btn,'click',addBtnHandle);
    delegateEvent(oTabele,'button','click',delBtnHandle);
}

init();

function addEvents(obj,sEv,fn) {
	if(obj.addEventListener){
        obj.addEventListener(sEv,fn,false);
	}
	if(obj.attachEvent){
		obj.attachEvent('on'+sEv,fn);

	}
}

function delegateEvent(element,tag,eventName,listener) {
	return addEvents(element,eventName,function (event) {
		var e=event||window.event,
		    target=e.srcElement||e.target;
		    if(target.tagName.toLocaleLowerCase()===tag){
		    	listener.call(target,event);
		    }
	});
}

//关于代理，json，表单操作