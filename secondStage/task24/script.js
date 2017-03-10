/*基于任务23，添加节点的选择、增加与删除的功能
点击某个节点元素，则该节点元素呈现一个特殊被选中的样式
增加一个删除按钮，当选中某个节点元素后，点击删除按钮，则将该节点及其所有子节点删除掉
增加一个输入框及一个“添加”按钮当选中某个节点元素后，点击增加按钮，则在该节点下增加一个子节点，节点内容为输入框中内容，插入在其子节点的最后一个位置*/
//如何减少全局变量
//不喜欢函数的堆叠运行
//关于各种原生节点的操作
//如果有多个相同的节点
//如果插入的节点名有多个
window.onload=function(){


//1.将遍历和查找存在两个数组中,如何知道是找到了的
		(function(window,undefined){
		    var timer = null,
		    list = [],
		    treeRoot=$('.root'),
		    btnsParent = $('.control'),
		    foundList = [],
		    head = null,
		    found = false,//是否找到
		    key = null,
		    insert = $('#insert'),
		    clickNode = null;//标记找到的节点
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
			//深度优先
				if(node){
					list.push(node);
					for (var i = 0; i < node.children.length; i++) {
					     deep(node.children[i])	
					}
				}
       
		}

		function broad(node){
			//广度优先
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
			found = false;
			nodeName =trim( nodeName )|| null;
			var text = '';
             if(!nodeName){
             	reset()
             	alert("please type in the node name you wanna search")
             } else {

              for (var i = 0; i < list.length; i++) {

                text = trim(list[i].firstChild.nodeValue);//注意关于文本节点！！！
                 if(text == nodeName){
                     list[i].className = "chose";//标记找到的节点
                     found = true;
                     key++;
                     foundList.push(list[i])
                     } 
                }      	
             }

		}

		function changeColor(list){

			head = list.shift();
			timer = setTimeout(function(){
		         if(head.className !== "chose")  head.style.backgroundColor = "#fff";		          
		          changeColor(list);
		    },500);
		    if(head.className == "chose"){
		    	         
                head.style.backgroundColor = "red";	
               	key--;
               	if(key==0)  clearTimeout(timer);
		    }else{
		    	head.style.backgroundColor = "yellow";
		    }
		   //console.log(i)

		    
		}
		function insertNode(){
          //判断有没有选中的节点
          //判断有没有节点名
          var nodeValue = [],
              reg = /[^,|，|\s]+/g,
              len ,i;
              nodeValue=insert.value.match(reg);
              insertNode.value='';
             for (i = 0,len = nodeValue.length; i < len; i++) {
             	

              if (nodeValue[i]&&clickNode != null) {
              	 var newNode =document.createElement("div"),
              	     newText = document.createTextNode(nodeValue[i]);
              	     newNode.appendChild(newText);

              	  clickNode.appendChild(newNode);
              }else{
              	alert("请输入节点名并选择要插入的节点")
              }
            }
		}
		function removeNode(){
          //从数组中删除
          //从HTML中删除        
          var parent = clickNode.parentNode;
          parent.removeChild(clickNode);

		}
		function reset(){
		   if(clickNode){
		   	  clickNode.style.backgroundColor ='#fff';
		   }
		   if(foundList.length > 0){		     	
		   	for (var i = 0; i < foundList.length; i++) {
		   	  console.log(foundList[i]);
		   		
		   			foundList[i].style.backgroundColor = '#fff';
		   			foundList[i].className = '';
		   		
		   	}

				list = [];
			
		   }
		   clearTimeout(timer);		   
		}
		function foundOrNot(){
              if(!found){
                	console.log('not found')
                	search.value='';
                }     
                else{
                	alert('found')
                }
		}
       delegateEvent(btnsParent,'button','click',startTraversal);
       delegateEvent(treeRoot,'div','click',function(){
       	    if(clickNode){
       	    	clickNode.style.backgroundColor = '#fff';
       	    }
       	      clickNode = this;
       	       this.style.backgroundColor = "pink"; 
       })
       function startTraversal(){
       	   reset();
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
             foundOrNot();      
            break;
            case "broadSearch":
               broad(treeRoot);
               searchNode(search.value,list);
                changeColor(list);
               foundOrNot();
            break;
            case "insert":
                 insertNode();
            break;
            case "remove":
                 removeNode();
            break;
       	 }
       	 
       }
          

		})(window)
}
