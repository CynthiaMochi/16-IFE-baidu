function addHandler(element,type,handler) {
	//元素，事件，函数
	//不断重写
	if(element.addEventListener){
		addHandler=function(element,type,handler){
			element.addEventListener(type,handler,false);
		}	
	}
	else if (element.attachEvent) {
		addHandler=function(element,type,handler){
			element.attachEvent("on"+type,handler);
		}
	}
	else{
		element["on"+type]=handler;
	}
	return addHandler(element,type,handler);

}
function removeHandler(element, type, handler) {
	//移除的handler要和添加时一样
	if(element.removeEventListener){
		removeHandler=function(element,type,handler){
			element.removeEventListener(type,handler,false);
		}	
	}
	else if (element.attachEvent) {
		removeHandler=function(element,type,handler){
			element.detachEvent("on"+type,handler);
		}
	}
	else{
		element["on"+type]="";
	}
	return removeHandler(element,type,handler);
}
function getTarget(event){
      var event=event||window.event;

      return event.target||event.srcElement;
}

function preventDefault(event){

	if(event.preventDefault){
		preventDefault=function(event){
			event.preventDefault;
		}
	}else{
		//event.returnValue的作用就是：当捕捉到事件(event)时，做某些判断，如果判断失败，则阻止当前事件继续运行
		preventDefault=function(event){
			event.returnValue=false;
		}
	}
	return preventDefault(event);
	
}

function trim(word){
	return word.replace(/^\s+|\s+$/g,"");
}

function delegateEvent(element,tag,eventName,listener){
	//代理
	return addHandler(element,eventName,function(event){
		var e=event||window.event,
		    target=getTarget(e);
		    if (target.tagName.toLocaleLowerCase()===tag) {
		    	    listener.call(target,e);
		    }
	})      
}
var $ = function (el, parent) {
	var parent = parent || document;
	return parent.querySelector(el);
}
var $$ = function (el, parent) {
	var parent = parent || document;
	return parent.querySelectorAll(el);
}

function addClass(dom, newClass) {
	dom.classList.add(newClass);
}
function removeClass(dom, targetClass) {
	dom.classList.remove(targetClass)
}
function beUnique(arr) {
	var hash = {};
	var result = [];
	arr.forEach(function (item) {
		item = trim(item);
		if (item && !hash[item]) {
			hash[item] = true;
			result.push(item);
		}
	})
	return result;
}

