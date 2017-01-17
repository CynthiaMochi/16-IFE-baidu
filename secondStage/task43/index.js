//需要知道比例
//根据大小和比例决定大小
//两张图可以重叠，分割
//但是多个图分割怎么办，怎么控制图片大小
//使用background就需要js设置背景了
(function () {
    var $$ = function (el) {
        return document.querySelectorAll(el);
    }
    var Album = function (node) {
        var album = {},
            widget = false,
            defaults = {
                width: '600px',
                height: '600px'
            }
        setStyle = function () {
            widget.style.width = widget.dataset.width || defaults.width;
            widget.style.height = widget.dataset.height || defaults.height;
        },
        setBackground = function () {
            var divChildren = widget.children;
            [].forEach.call(divChildren, function(div) {
                div.style.backgroundImage = 'url('+div.dataset.url+')';
            })
        }

        widget = node;
        setStyle();
        setBackground();
    }

    var nodes = $$('.album');
    [].forEach.call(nodes, function(node) {
        Album(node);
    })      
    
})()
