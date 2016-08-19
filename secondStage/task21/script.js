/*
1.基于任务20，将任务20的代码进行抽象、封装，然后在此基础上实现如图中的两个需求：Tag输入和兴趣爱好输入
2.如示例图上方，实现一个tag输入框
3.要求遇到用户输入空格，逗号，回车时，都自动把当前输入的内容作为一个tag放在输入框下面。
4.Tag不能有重复的，遇到重复输入的Tag，自动忽视。
5.每个Tag请做trim处理
6.最多允许10个Tag，多于10个时，按照录入的先后顺序，把最前面的删掉
7.当鼠标悬停在tag上时，tag前增加删除二字，点击tag可删除
8.如示例图下方，实现一个兴趣爱好输入的功能
9.通过一个Textarea进行兴趣爱好的输入，可以通过用回车，逗号（全角半角均可），顿号，空格（全角半角、Tab等均可）等符号作为间隔。
10.当点击“确认兴趣爱好”的按钮时，将textarea中的输入按照你设定的间隔符，拆解成一个个的爱好，显示在textarea下方
11.爱好不能重复，所以在下方呈现前，需要做一个去重
12.每个爱好内容需要做trim处理
13.最多允许10个兴趣爱好，多于10个时，按照录入的先后顺序，把最前面的删掉
*/
//两个对象，tag和inerest
//tag：1.判断键盘输入
//2.生成标签，生成前对已有标签数量进行判断，对标签进行trim处理
//3.遇到重复的自动忽略
//4.hover在tag上时，修改标签的innerHTML，点击可删除
//
//代码可复用的部分多
$=function(el){return document.querySelector(el) }

function tags(input,show,button) {
	//传入输入框和显示框的元素
	//将数存在数组中，再转化为视图模式的数组
	this.input = input;
	this.show = show;// 元素
	this.button = button || null;
	this.inputText='';
    this.inputTags = [];


} 
tags.prototype.init=function(){

	var self = this,
	    value='';
		 if(self.button){
		 	//如果有button，在点击的时候获取值
            //有bug每点击一次都会重新生成新的
            addHandler(self.button,"click",function(){
            	value = self.input.value;
            	var reg = /[^\s|\r|,|\，|、|\n|\t]+/g;
            	value.match(reg).forEach(function(d){
            		self.inputTags.push(d)
            	})
            	
            	self.input.value='';
            	self.render();
            	buttonEvents();
            });
            
		 }else{

			addHandler(self.input,"keyup",function(event){
				
			     value = self.getInputValue();
			  
				if(value&&self.checkInput(value)){		
				//如果不重复				
			     self.inputTags.push(value);
			          if(self.inputTags.length>10){
			    	   self.inputTags.shift(self.inputTags[0]);
			          }     
		         self.input.value='';
		         self.render();
				}
				buttonEvents();
			})
		 	
	}
    function buttonEvents (){

	   self.show.childNodes.forEach(function(d){
					    	
					addHandler(d,"mouseover",function(event){
							var tar = event.target;
							tar.textContent="点击删除"+tar.textContent;//Node.textContent 属性可以表示一个节点及其后代节点的文本内容。       
							if(!(/deletable/g).test(tar.className)){
							tar.className+=" deletable";          
                            }

					});
					addHandler(d,"mouseout",function(event){
						var tar = event.target;
							tar.textContent= tar.textContent.replace(/点击删除/,'');
							tar.className=tar.className.replace(/ deletable/,'');
					});
					addHandler(d,"click", function(event){
						 var reg=/[^点击删除]+/,
                              tar = event.target,
                              tarContent=reg.exec(tar.textContent)[0];	
							 self.inputTags.splice(self.inputTags.indexOf(tarContent));
						     self.show.removeChild(tar);
					});
			   })
		}
}


	//使用代理
	/*console.log(this.show.children)
	self.show.children.map(function(d){
		console.log(d);
	})*/

tags.prototype.getInputValue=function(event){
	  var event=event||window.event;
			    
		var text = this.input.value,
	    check = /(,|\，|\s)$/,
	    first = /^(,|\，|\s)/;

	    if (first.test(text)) {
	    	//标签不允许为空	  
	    	this.input.value=null;
	    }
	   else if(check.test(text)||event.keyCode===13){       	   
	   	  text=text.match(/(^[^,\， ]*)/)[0];
           return text;	   
	   
	   }
}

tags.prototype.checkInput=function(value){
	//检查是否重复
   var self = this ; 
 
    if (self.inputTags.indexOf(value)==-1){
        return true;
    }else{
    	self.input.value='';
    	return false;
    }   
}
tags.prototype.render = function(match) {
	  var self = this;
	self.show.innerHTML=
	self.inputTags.map(function(d){
		var r = d;
		return "<div class='tags_item'>"+r+"</div>"
	}).join('');
};


window.onload= function(){
   
	var tagsShow = new tags($('.tags input'),$('.tag_show'));

	tagsShow.init();
	var hobbyShow = new tags($('.hobby textarea'),$('.hobby_show'),$('.hobby_button'));
     hobbyShow.init();

}

function addHandler (element,type,handler){
	if(element.addElementListener){
		element.addElementListener(type,handler,false);
	}else if(element.attachEvent){
          element.attachEvent("on"+type,handler);
	}else{
		element["on"+type]=handler;
	}
	//return addHandler(element,type,handler);

}