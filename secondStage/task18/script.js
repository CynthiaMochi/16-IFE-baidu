//插入节点，删除节点，判断方向
//让每个function做的工作尽量少而专
//用innerHTML比createElement好

//将功能封装成对象

function lineQueue(placeholder,buttons){
  //一个队伍，需要什么参数和功能
  //1.判断输入的是否为数字
  //2.创造box
  //3.按钮的功能，判断职能->执行
   this.placeholder=placeholder;//让placeholder为wrap
   this.buttons=buttons;//获得所有按钮的父元素
   this.text='';
   this.line=document.getElementById('line');

   this.queue=[];//先有一个空队列
   this.box="";

var self=this;
   delegateEvent(self.buttons,'button','click',function(){
      text=self.placeholder.getElementsByTagName('input')[0].value;
      self.lineUp(this.dataset.dir,text);

    });
if (self.queue) {
    delegateEvent(self.placeholder,'div','click',function(){ 
      self.deleteBox(event);
    });
   }
}      
lineQueue.prototype.lineUp= function(dir,text) {
  // 通过方向来执行怎么进出
 
  var self=this;
  self.prepareBox(text);
  switch (dir){
    case 'left-in':
      self.queue.unshift(self.box);
    
    break;
    case 'left-out':
      self.queue.shift();
    break;
    case 'right-in':
    
      self.queue.push(self.box);
    break; 
    case 'right-out':
      self.queue.pop();
    break;

  }

 self.showLine();
  

}; 
lineQueue.prototype.prepareBox= function(text) {
  //准备box
  var self=this;
  self.text=text;
  if(self.isNum()){
   self.box="<div class='box'>"+parseInt(this.text)+"</div>";

  }else{
    alert('Please enter an integer');//然后呢？
  }
};
lineQueue.prototype.isNum = function() {
  
  return (/^[0-9]+$/.test(this.text));
};
lineQueue.prototype.deleteBox = function(event) {
  var self=this,
      e=event||window.event,
      node=e.target,
      allBoxes=node.parentNode.children,
      index=[].indexOf.call(allBoxes, node);//和call无关，要看indexOf函数是怎么调用的。第一个传入的是数组，第二个是开始查找的位置
   
      self.queue.splice(index,1);
      self.showLine();
   
};
lineQueue.prototype.showLine= function(first_argument) {
   this.line.innerHTML=this.queue.join('');//使用join将数组连成字符串，split是将字符串分成数组
};

 
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

 function init() {
  var   oWrap=document.querySelector('#wrap'),//要用querySeletor不能直接用getElement     
        btns= document.querySelector('#btns');

var linequeue=new lineQueue(oWrap,btns);//构造要用new
 }
 init();

