/*
1.基于任务22，参考示例图，将二叉树变成了多叉树，并且每一个节点中带有内容
2.提供一个按钮，显示开始遍历，点击后，以动画的形式呈现遍历的过程
3.当前被遍历到的节点做一个特殊显示（比如不同的颜色）
4.每隔一段时间（500ms，1s等时间自定）再遍历下一个节点
5.增加一个输入框及一个“查询”按钮，点击按钮时，开始在树中以动画形式查找节点内容和输入框中内容一致的节点，找到后以特殊样式显示该节点，找不到的话给出找不到的提示。查询过程中的展示过程和遍历过程保持一致
*/
/*
1.树的遍历算法和方式自定，但推荐可以提供多种算法的展示（增加多个按钮，每个按钮对应不同的算法）
2.如果按照示例图中展示树，可以使用flexbox布局
3.实现简单功能的同时，请仔细学习JavaScript基本语法、事件、DOM相关的知识
*/
//深度和广度两种，顺序不同保存的数组不同
//查找子节点
//按照顺序调用
//要改变颜色，通过遍历，用类
//要清空模型数组
//要渲染数组
window.onload=function(){



		(function(window,undefined){
		    var timer = null,
		    list = [],
		    treeRoot=$('.root'),
		    btnsParent = $('.control'),
		    head = null,
		    found = false;
		    search = $('#search');

		function $(el) { return document.querySelector(el)}
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
		function delegateEvent(element,tag,eventName,listener){
			//在父元素上绑定
			//当在子元素上触发事件的时候
			addHandler(element,eventName,function(){
			var	event = event || window.event,
			    target = event.target || event.srcElemet;
			    if (target.tagName === tag.toUpperCase()) {
		              listener.call(target,event)
			    }
			})
			
		};
		   function trim(str) {
            return str.replace(/^\s+|\s+$/g, "");
        }

		function deep(node) {
			//中序
				//深度优先
				//遍历一个节点所有子节点后，找到他的兄弟节点遍历子节点
				//直到没有兄弟节点
				if(node){
					list.push(node);
					for (var i = 0; i < node.children.length; i++) {
					     deep(node.children[i])	
					}
				}
       
		}

		function broad(node){
		       if(node){
		    
				   	if(!list[0]){

				     	list.push(node);
				     }
		   	      for (var i = 0; i < node.children.length; i++) {
		   	      	list.push(node.children[i])

		   	      }
		   	      for (var i = 0; i < node.children.length; i++) {
		   	      	broad(node.children[i])
		   	      }
		      }
		   	     
		}
		function searchNode(nodeName,list){
			nodeName =trim( nodeName )|| null;
			var tempList=[],
			    text = '';
             if(!nodeName){
             	reset()
             	alert("please type in the node name you wanna search")
             }else {
              for (var i = 0; i < list.length; i++) {
                text = trim(list[i].firstChild.nodeValue)//注意关于文本节点！！！
                 if(text == nodeName){
                     list[i].className = "chose";
                     found = true;
                     } 
              }      	
             }

		}

		function changeColor(list){

			head = list.shift();
		    if(head.className == "chose"){
                head.style.backgroundColor = "red";	
                reset();	    	
		    }else{
		    	head.style.backgroundColor = "yellow";
		    }
		   //console.log(i)
		    timer = setTimeout(function(){
		         
		          head.style.backgroundColor = "#fff";
		          changeColor(list);
		    },500)
		    
		}
		function reset(){
		     
		   if(list.length > 0){
				head.style.backgroundColor = '#fff';		   
				for (var i = 0; i < list.length; i++) {	   
						list[i].className == '';
						list[i].style.backgroundColor = '#fff';
					 		
				}
				list = [];

				clearTimeout(timer);
		   }
		   	
		   
		}
       delegateEvent(btnsParent,'button','click',startTraversal);
       function startTraversal(){
       	   reset();
       	   console.log(list)
       	 switch (this.className){
       	 	case "deep":      	 
               deep(treeRoot);   
                changeColor(list);           
            break;
            case "broad":              
               broad(treeRoot);
                changeColor(list);
            break;
            case "deepSearch":
              deep(treeRoot);
               searchNode(search.value,list);
                changeColor(list);  
                if(!found){
                	console.log('not')
                	search.value='';
                }          
            break;
            case "broadSearch":
               broad(treeRoot);
               searchNode(search.value,list);
                changeColor(list);
                if(!found){
                	console.log('not')
                	search.value='';
                }      
            break;
       	 }
       	 
       }

		})(window)
}
