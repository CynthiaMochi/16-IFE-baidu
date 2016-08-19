/*
1.参考示例图，在页面中展现一颗二叉树的结构
2.提供一个按钮，显示开始遍历，点击后，以动画的形式呈现遍历的过程
3.二叉树的遍历算法和方式自定，前序中序后序皆可，但推荐可以提供多种算法的展示（增加多个按钮，每个按钮对应不同的算法）
4.当前被遍历到的节点做一个特殊显示（比如不同的颜色）
5.每隔一段时间（500ms，1s等时间自定）再遍历下一个节点
*/
//1.一棵完全二叉树，深度为4，
//已经有一棵全树了
//遍历的顺序就是将这棵树怎么构建成数组再输出
//先序，中序，后序遍历
//setTimeout
$=function(el){ return document.querySelector(el)}
var btns = document.getElementsByTagName('button'),
	    prebtn = btns[0],
	    inbtn = btns[1],
	    postbtn = btns[2],
	    list = [],
	    treeRoot =$('.root'),
	    timer = null;
window.onload = function(){


	prebtn.onclick = function(){
		reset();
		preOrder(treeRoot);
		changeColor(list);
	}
	inbtn.onclick = function(){
		reset();
		inOrder(treeRoot);
		changeColor(list);
	}
	postbtn.onclick = function(){
		reset();
		postOrder(treeRoot);
		changeColor(list);
	}
}


function preOrder(node){
	//先序遍历tlr
	//一直查到最左边
	if (!(node==null)) {
		list.push(node)
		preOrder(node.firstElementChild);
		preOrder(node.lastElementChild);}
	
}
function inOrder(node){
	//中序遍历ltr
	if (!(node==null)) {
	inOrder(node.firstElementChild);
	list.push(node);
	inOrder(node.lastElementChild);
   }
}
function postOrder(node){
	//后续遍历lrt
   if (!(node==null)) {
	postOrder(node.firstElementChild);
	postOrder(node.lastElementChild);
	list.push(node);
  }
}
function changeColor(list){
   //设置间隔时间
   //逐个将数组中的项改变颜色
   var speed = 500,
       i = 0;
    list[i].style.backgroundColor =  'yellow';
   timer= setInterval(function(){
      i++;
      if (i < list.length) {
      	list[i-1].style.backgroundColor = '#fff';
      	list[i].style.backgroundColor = 'blue';
      }else{
      	clearInterval(timer);
      	list[list.length - 1].style.backgroundColor = '#fff';
      }
      console.log(i);
   },speed)
}
function reset(){
	list = [];

   clearInterval(timer);
    var divs = document.getElementsByTagName('div');
    for (var i = 0; i < divs.length; i++) {
        divs[i].style.backgroundColor = '#fff';
    }
   
}
