/*基于任务24的基本代码，实现一个树形组件，可参考如图示例，样式自定义，不做限制
要求有以下功能：
1.节点的折叠与展开
2.允许增加节点与删除节点
3.按照内容进行节点查找，并且把找到的节点进行特殊样式呈现，如果找到的节点处于被父节点折叠隐藏的状态，则需要做对应的展开*/

//分支组成树
//增加和删除，hover的时候显示
//收缩分支,有子元素的时候添加，点击的时候
//新建子node
//1.用innerHTML
//2.用createElement()
//可以将方法再细分
//判断是否为叶子节点，来决定一些效果
//通过改变类名来改变效果
//将类数组变为数组
function TreeNode(obj){
	this.title = obj.title;
	this.child = obj.child ||[];
	this.parent = obj.parent;
	this.selfElement = obj.selfElement;
	this.selfElement.treeNode = this;//dom和模型相互指

};

TreeNode.prototype.addOne = function(title,clickParent) {
	//一个基本的分支，div.node
	// 需要一个名称 label.node-header,span.title
	// hover的时候有出现添加和删除选项
	// 将node添加到label标签后面
	// 不能有相同的子节点
	
	var domParent = clickParent.treeNode;
	   
			    function render(t){
                   var title = '<span class="title">'+t+'</span>',			     	    
			     	    buttons ='<span class="add">+</span><span class="remove">X</span>';
			         return '<label class="node-header">'+title+buttons+'</label>'
			    };
    //创建

    var newTreeNode = document.createElement("div");
        newTreeNode.className = "node";
        newTreeNode.innerHTML = render(title);
    var newNode = new TreeNode({
    	title:title,
    	child:[],
    	parent:domParent,
    	selfElement:newTreeNode
    })
        domParent.child.push(newNode);
        clickParent.appendChild(newTreeNode);
    if(domParent.child.length==1){
    	//有child的时候
    	clickParent.className+=" arrow-down";
    }
};
TreeNode.prototype.removeOne = function(clickParent){
	//有bug
	var domParent = clickParent.parentNode.treeNode;
        parentTitle = clickParent.parentNode;
    if(domParent.child.length==1){
    	//有child的时候
    	parentTitle.className = parentTitle.className.replace("arrow-down","");//replace不改变原来的
    }
  
    domParent.child = domParent.child.filter(function(c){
        if( c.title!== clickParent.treeNode.title )
        	return c;
    })

    clickParent.parentNode.removeChild(clickParent);
};
TreeNode.prototype.searchTreeNode = function(searchTitle) {
     var childResult = [];
      childResult = this.traverse();
      childResult.map(function(d){
      	if(searchTitle ==null){
      		d.selfElement.getElementsByClassName('title')[0].style.color = "#ee6734"
      	}
      	else if(trim(d.title) == searchTitle){
      	   //关于className的支持
      	   d.selfElement.getElementsByClassName('title')[0].style.color = "blue";
      	}
      	return d;
      }) 
};
TreeNode.prototype.traverse =function(){
	var childResult = [];
    inOrder(this);
	function inOrder(node){   
	     childResult.push(node)     
     for (var i = 0; i < node.child.length; i++) {
     	 inOrder(node.child[i])
     }
	}
	return childResult;
};
TreeNode.prototype.toggleFold = function(clickParent){
  //将父节点下的node都隐藏起来
  var arrow = clickParent.className,
      domParent = clickParent.treeNode;
  if(/down/.test(arrow)){
  	arrow = arrow.replace("down","right");
  	domParent.child.map(function(n){
  		n.selfElement.style.display="none";
  	});
  }else if(/right/.test(arrow)){
  	arrow = arrow.replace("right","down");
  	domParent.child.map(function(n){
  		n.selfElement.style.display="block";
  	});
  }
    clickParent.className = arrow;

};


//帮助函数
function $ (el){
	return document.querySelectorAll(el);
}
function addHandler(element,type,handler){
			if (element.addEventListener) {
		          element.addEventListener(type,handler,false);
			}
			else if(element.attachEvent){
		           element.attachEvent(type,handler);
			}
			else{
		         element["on"+type] = handler;
			}
		};
function trim(text){
	return text.replace(/^\s+|\s$/);
}
var  treeRoot = $('#root')[0],
     treeCom = $(".treeComponent")[0];

var	treeNode = new TreeNode({
      title:'前端技能树',
      parent:null,
      child:[],
      selfElement:treeRoot,
	});

addHandler(treeRoot,"click",function(){
	event = event||window.event;
	var target = event.target || event.srcElement,
	    clickParent = target;
	while(!/node/.test(clickParent.className)){
		//会导致死循环，如果绑定root外的button
		clickParent = target.parentNode;
	}
	 clickParent = clickParent.parentNode;//dom上的点,node
	    if (/add/.test(target.className)) {
	    	var title = prompt("输入你想插入的节点名字");
	    	if(title){    		
	        treeNode.addOne.call(target,title,clickParent);
	    	}else{
	    		alert("输入你想插入的节点名字")
	    	}
	    }
	    if (/remove/.test(target.className)) {
	    	treeNode.removeOne.call(target,clickParent);
	    }
	    if (/title/.test(target.className)) {
	        treeNode.toggleFold.call(target,clickParent);
	    }
})
addHandler(treeCom,"click",function(){
    	event = event||window.event;
	var target = event.target || event.srcElement,
	    searchTitle = trim($('#searchText')[0].value);
    if (target.className.indexOf("searchbtn")!==-1){
    	if(searchTitle){
	        treeNode.searchTreeNode(searchTitle);
	    }else{
	    	alert("请输入要查找的节点名")
	    }
	}
	if (/clearbtn/.test(target.className)) {
	        $('#searchText')[0].value = '';
	       treeNode.searchTreeNode(null);

	    }
})
treeNode.addOne('HTML',treeRoot);
treeNode.addOne('CSS',treeRoot);
treeNode.addOne('Javascript',treeRoot);
