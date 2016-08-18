# First stage-task 3

标签（空格分隔）： 百度前端

---

用relative和absolution如何解决自适应高度问题
用float中间的放在最后，而且不从文档流中取出就能自适应

###**1.使用float+margin**
####a.one two three 顺序排列
```CSS
  #one {float:left}
  #two {float:left}
  #three {float：right/left}
```
  失败
  问题:1.当三者的宽度超过一行的总宽度时，超出的会被挤到下一行
       2.父类元素不被撑开
  解释:浮动元素能左右浮动，直到它的外边缘碰到包含框或者另一个浮动元素的边缘框。

  解决:b
####b.one three two
```CSS
  #one{ float:left}
  #three{ float：right ; margin:0 140px 0 210px;}
  #two {margin:220px;}/*(距离one的距离)*/
```
  成功
  问题:
  1.父元素被two撑开,不是被最长撑开
  2.当two长度超过three时，文字围绕three排列，three表现的像在two中浮动
  解释:
  文档流中的元素表现的像浮动元素不存在，但如果浮动元素后面有一个文档流元素，那么这个元素的框会表现的像浮动元素不存在，但框内文本内容会瘦到浮动元素的影响，会移动以留出空间，给浮动元素流出空间，会绕浮动框
  解决:
 1.添加一个div.clear在末尾，样式{clear：both}  
 2.#wrap{overflow:hidden} 能将float撑开 
  
###**2.使用position+margin**
####a.one two three
```CSS
  #wrap {position:relative}
  #one { positon:absolute ;   left:20px; top:20px;}  /*从父元素的边框为对照*/
  #two {margin:0 220px}   /*从父元素的内容，不包括内边距为对照*/
  #three{ positon:absolute ;   right:20px; top:20px;}
```
  成功
  问题:1.父元素被two撑开,不是被最长撑开
  解决:
  1.添加#wrap{overflow:auto;*zoom:1}//zoom配适IE6
  
###3.float+负margin
####a.two>center one three （two的p内容放在center中
```CSS
 #wrap{overfloat:hidden}  //撑开
 #one,two,three {float:left}
 .center{ margin:0 230px;}
 #one,three{margin-left:-100%}  //猜测将one和three向上调整一行
 #three{margin-left:-230px;}    //#three从最左，跨过one的宽度，到了最右
```
参考：[两栏布局，三栏布局，等高布局，流式布局][1]

###**清除浮动**
**1.使用clear属性**
```
<br style="clear:both" /> <!-- So dirty! -->
```
**2.使用伪类:after和:before**
```
#wrap:after,.wrap:before{content:'';display:block;}/*可用display:table*/
#wrap:after{clear:both}
#wrap{zoom:1}  /* For IE 6/7 (trigger hasLayout) */
```
**3.使用overflow**
````CSS
#wrap{overflow:hidden; 
      zoom:1;
      display:block;/*如果不是block的元素就要使用
      }
```
参考[Which method of ‘clearfix’ is best?][2]


  [1]: http://www.cnblogs.com/jununx/p/3336553.html
  [2]: http://stackoverflow.com/questions/211383/which-method-of-clearfix-is-best
  
  