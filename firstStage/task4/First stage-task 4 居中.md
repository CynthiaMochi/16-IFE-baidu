# First stage-task 4 居中

标签（空格分隔）： 百度前端

---

##**任务四：定位和居中问题**

###**块元素**
####*水平居中*
1.
``` CSS
.grey{position:relative;margin:0 auto;}
```
2.
```CSS
#wrap{
 position:relative;
}
.grey{left:50%;margin-left:-200px;position: absolute; } /*宽度的一半,要有position*/
```
3.


```CSS

#wrap{text-align:center}
div.grey{display:inline-block}/*父元素有定宽,在table的定位中是针对inline-block，block无效*/
```

####*垂直居中*
1.
```
#wrap{position: relative;}
.grey{position:absolute;top: 50%;margin-top:-100px;}/*若父元素没有高度则top不起作用,设置所有父元素（到html,body,#wrap{height:100%;}*/
}
```
2.
```CSS
#ex{display: table;}/*#wrap多加一个外层。table层和所有父元素都要有定高或者100%*/
#wrap{display: table-cell;vertical-align: middle;}/*要有fixed height*/
.grey{position: relative;}/*不能是absolute,在wrap中居中*/
```
3.
```CSS
#wrap{
   display:flex; 
   justify-content:center;
   align-items:center;}/*父元素要有fixed height，子元素（.grey有宽高*/
```
flex参考[flexbox][1]
[Flex 布局教程：语法篇][2]
或者
```CSS
#wrap{
   display:flex; 
   }/*父元素要有fixed height，子元素（.grey有宽高*/
.grey{
  width: 400px;/*要有高度*/
  height: 200px;/*不是必须*/
  margin: auto; /*在Flex容器中，当项目边距设置为“auto”时，设置自动的垂直边距将使该项目完全集中两个轴。*/
}
```
注意兼容性
4.
```CSS
#wrap{position: relative;}
.grey{position:absolute; 
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      margin: auto;}
/*若父元素没有高度则top不起作用,设置所有父元素（到html,body,#wrap{height:100%;}*/
```
5.新增一个div.ex在.grey之前
```
   .ex{
        height: 50%;
    	float: left;
    	margin-bottom: -100px;      
    }
    .grey{
       height: 200px;
       position: relative;
       clear: both;
       }/*父元素要有高，height：100%，grey要有高度，用float的元素占去空间*/
```
###**内联元素**
####*水平居中*
1.
```
p{text-align: center;}
```
####*垂直居中* 
1.
```
#wrap{display: table;}
.grey{display: table-cell;vertical-align: middle;}/*grey中的p和div均居中*/
```
2.
```
.grey p{
	height: 200px;
    line-height: 200px;
}/*设置一行居中，为父元素高度一半，有些疑问*/
```
参考
[CSS实现垂直居中的5种方法][3]
[HOW TO CENTER IN CSS][4]
更多方法
[CSS布局奇淫技巧之--各种居中][5]

  
  


  [1]: http://zh.learnlayout.com/flexbox.html
  [2]: http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html
  [3]: https://www.qianduan.net/css-to-achieve-the-vertical-center-of-the-five-kinds-of-methods/
  [4]: http://howtocenterincss.com/
  [5]: http://www.cnblogs.com/2050/p/3392803.html