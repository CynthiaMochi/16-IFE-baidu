//排序功能,用对象的话对象没有重复的属性
//柱子的生成yes
//输入数字的范围判断yes
//输入数字的个数判断yes
//随机生成

//先输入一个数
//再点击
//点击之后判断
//符合就加入数组并输出
//准备box(原来的方法)
//如果一个一个事先做好，到最后排序的时候反而要重新读取值再做。
//不如存了值之后统一做
function lineQueue(placeholder,buttons){
 
   this.placeholder=placeholder;//让placeholder为wrap
   this.buttons=buttons;//获得所有按钮的父元素
   this.text='';
   this.line=document.getElementById('line');

   this.queue=[];//先有一个空队列
   this.snapshots=[];
   this.timer=null;

   

var self=this;
   delegateEvent(self.buttons,'button','click',function(){
      text=self.placeholder.getElementsByTagName('input')[0].value;
      self.lineUp(this.dataset.dir,text);
     

    });
if (self.queue) {

    delegateEvent(self.line,'div','click',function(){ 

      self.deleteBox(event);
    });
   }


}      
lineQueue.prototype.lineUp= function(dir,text) {
  // 通过方向来执行怎么进出
 
  var self=this;
  switch (dir){
    case 'left-in':
    try{
        self.meetRequire(text);
         self.queue.unshift(self.text);
          self.showLine();
    }catch(e){
          alert(e.message);
    }
      
    break;
    case 'left-out':
      self.queue.shift();
      self.showLine();
    break;
    case 'right-in':
     try{
        self.meetRequire(text);
        self.queue.push(self.text);
         self.showLine();
    }catch(e){
          alert(e.message);
    }

    break; 
    case 'right-out':
      self.queue.pop();
       self.showLine();
    break;
    case 'orderby':

    if (self.queue.length==0) {
     alert('the queue is empty');
    }
      self.bubbleSort(self.queue);
 
     self.timer=setInterval(paint,200);
      function paint(){
          var snapshot=self.snapshots.shift()|| [];//返回第一个，数组也被改变         
          if (snapshot.length!==0) {
            self.showLine(snapshot);
          }else{
            clearInterval(self.timer);
            return;
          }
      }
    break;

  }


  

}; 

lineQueue.prototype.isNum = function(val) {

  return (/^[0-9]+$/.test(val));

};
lineQueue.prototype.meetRequire = function(text) {
  //不能超过60个
  //在10-100间
  // throw new Error和try catch一起
if (this.queue.length>=60) {
  throw new Error('The queue is full');
}
 if(!this.isNum(text)){
  //判断是数字
 throw new Error('Invalid input');
}
 var num=parseInt(text);
 if (num<10||num>100) {
   throw new Error('Please enter a integer between 10 and 100');
 }
   this.text=num;
       
};

lineQueue.prototype.deleteBox = function(event) {
  var self=this,
      e=event||window.event,
      node=e.target,
      allBoxes=node.parentNode.children,
      index=[].indexOf.call(allBoxes, node);//和call无关，要看indexOf函数是怎么调用的。第一个传入的是数组，第二个是开始查找的位置
   console.log(e.target);
      self.queue.splice(index,1);
   node.parentNode.removeChild(node);
   
};
lineQueue.prototype.showLine= function(arr) {
  //利用array.map()映射
var arr=arr||this.queue;
  var content=arr.map(function(val){
    
    return '<div class="box" style="height:'+parseInt(val)*4+'px"'+'>'+parseInt(val)+'</div>';
  }).join('');
 
  this.line.innerHTML=content;//使用join将数组连成字符串，split是将字符串分成数组
};


lineQueue.prototype.bubbleSort=function(arr){

  var self=this;
      //获取队列中的值
      //如何关联值和HTML的代码      
         var tempt=0;
        for (var i = 0; i < arr.length; i++) {
          for (var j = 0; j < arr.length; j++) {
            if (arr[j+1]<arr[j]) {
             
           tempt = arr[j+1];
           arr[j+1]=arr[j];
           arr[j]=tempt;    
           self.snapshots.push(JSON.parse(JSON.stringify(arr)));//记录每一次变顺序的过程，数组中存数组  
   
        }

  }
   }

}

 
function addEvents(obj,sEv,fn) {
  if(obj.addEventListener){
    obj.addEventListener(sEv,fn,false);
  }
  if (obj.attachEvent) {
    obj.attachEvent('on'+sEv,fn);
  }
}

function delegateEvent(element,tag,eventName,listener) {
  //当父元素和子元素的tagname相同时很难办，会把父元素也给影响了
  return addEvents(element,eventName,function (event) {
    var e=event||window.event,
        target=e.target||e.srcElement;
    if(target.tagName.toLocaleLowerCase()===tag){
      console.log(target.tagName)
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

