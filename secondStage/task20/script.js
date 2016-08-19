
//允许一次批量输入多个内容，格式可以为数字、中文、英文等，可以通过用回车，逗号（全角半角均可），顿号，空格（全角半角、Tab等均可）等符号作为不同内容的间隔
//增加一个查询文本输入框，和一个查询按钮，当点击查询时，将查询词在各个元素内容中做模糊匹配，将匹配到的内容进行特殊标识，如文字颜色等。举例，内容中有abcd，查询词为ab或bc，则该内容需要标识
//filter()、map()、some()、every()、forEach()、lastIndexOf()、indexOf()

  $ = function (el) { return document.querySelector(el); };
    var data = [];

    function render(match) {
      //
      $('#result').innerHTML =
        data.map(function(d) {
          var r = d;//保存原本的数组成员
          if (match != null && match.length > 0) {
            r = r.replace(new RegExp(match, "g"), "<span class='select'>" + match + "</span>");//给选中的词加样式
          }
          return "<div>" + r + "</div>";
        }).join('');//map执行完回调函数会生成新的数组变成innerHtml的内容，data再调用join（把数组中所有元素用某个符号连成字符串
        console.log(data)//map返回了新建的数组，所以原来的data没有被影响
    }

    function deal(func, succ) {
      //参数为按钮执行的方法，是否提示，回调函数
      var args = [].slice.call(arguments, 2);
      //传入参数从第二个开始切，取第二个之后的，可能是函数或者空数组。回调函数
      console.log(arguments)
    console.log(args)
      return function(e) {
        //闭包
        try {
          var arg = args.map(function(item) {
            //遍历判断是否参数为函数，并且返回新数组
            return typeof item === "function" ? item(e) : item;
          });
          var result;
        //就跟着一个函数或者数组,回调函数返回的是数组，是输入的值
          if (Object.prototype.toString.call(arg[0]) === '[object Array]') {
         
            arg[0].forEach(function(d) {
              //最后传入的是数组调用的函数，在data数组上实现方法，传入值或出
      console.log(d)
             result = func.apply(data, [d].concat(arg.slice(1)));//concat连接两个或多个数组，不影响原来的
           //func是执行数组
            });
          }
          else {
            result = func.apply(data, arg)
          }

          if (succ != null) {
            //succ为弹出提醒，只有出队才有
            succ(result);
          }
        } catch (ex) {
          if (ex.message != '')
            alert(ex.message);
        }
        render();
      };
    }

    function getInputValue() {
      return $('#input').value.split(/[^0-9a-zA-Z\u4e00-\u9fa5]+/).filter(function(d){return d != '';});//最后遍历返回判断是否为空
    }

    function getClickIndex(e) {
      var node = e.target;
      if (node.id == "result") throw new Error('');
      return [].indexOf.call(node.parentNode.children, node);//children 属性为只读属性，对象类型为 HTMLCollection
    }

    $('#left-in').onclick = deal([].unshift, null, getInputValue);
    $('#right-in').onclick = deal([].push, null, getInputValue);
    $('#left-out').onclick = deal([].shift, window.alert);
    $('#right-out').onclick = deal([].pop, window.alert);
    $('#result').onclick = deal([].splice, null, getClickIndex, 1);//删除原来的用加了类的替代
    $('#search').onclick = function(){
      render($('#search-text').value);
    }



