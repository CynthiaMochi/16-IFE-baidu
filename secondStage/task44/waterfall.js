//图片是动态加载上去的，因为要计算每一列最后一个距离顶部的top，选择最小的top的那一列
//图片懒加载
//需要生成图片item
//如果resize还要调整，重新计算
//需要只当当前可视窗口的宽度，让item的宽度固定
//pinterest是根据不同的浏览器宽定的
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory(root));
    } else if (typeof exports === 'object') {
        module.exports = factory(root);
    } else {
        root.waterFall = factory(root);
    }
})(typeof global !== 'undefined' ? global : this.window || this.global, function (root) {

    'use strict';

    //
    // Variables
    //

    var waterFall = {};
    var supports = !!document.querySelector && !!root.addEventListener;//Feature test
    var settings, eventTimeout;
    var BASE_IMG_URL = 'https://placehold.it/';
    var SIZE = ['660x250', '300x400', '350x500', '200x320', '300x300'];

    //Default settings
    var defaults = {
        initClass: 'waterfall',
        columnClass: 'waterfall-col',
        itemClass: 'waterfall-item',
        diaplayClass: 'waterfall-gal',
        columnNum: 4,
        lazyLoad: true,
    }

    //
    //Methods
    //

    /**
     * A simple forEach() implementation for Array,,Objects and NodeLists
     * @private
     * @param {Array|Object|NodeList} <collection> {Collection of items to iterate}
     * @param {Function} <callback> { Callback function for each iteration }
     * @param      {Array|Object|NodeList} <scope> { Object/NodeList/Array taht forEach is iterating over (aka)`this` }
     */
    var forEach = function (collection, callback, scope) {
        if (Object.prototype.toString.call(collection) === '[object Object]') {
            for (var prop in collection) {
                if (Object.prototype.hasOwnProperty.call(collection, prop)) {
                    callback.call(scope, collection[prop], prop, collection);
                }
            }
        } else {
            for (var i = 0, len = collection; i < len; i++) {
                callback.call(scope, collection[i], i, collection);
            }
        }
    }

    /**
     * Merge defaults with user options
     * @private
     * @param      {Object} <defaults> { Defaults settings }
     * @param      {Object} <options> { User options }
     * @returns    {Object} { Merged values of dafaults and options }
     */
    var extend = function (defaults, options) {
        var extended = {};
        forEach(defaults, function (value, prop) {
            extended[prop] = defaults[prop];
        });
        forEach(options, function (value, prop) {
            extended[prop] = options[prop];
        })
        return extended;
    }

    /**
     * Convert data-options attribute into an object of key/value pairs
     * @private
     * @param      {String} <options> { Link-specific options as a data attribute string }
     * @returns    {Object} 
     */
    var getDataOptions = function (options) {
        return !options || !(typeof JSON === 'object' && typeof JSON.parse === 'function') ? {} : JSON.parse(options)
    }

    /**
     * Get the closest matching element up the DOM tree
     * @param      {Element} <elem> { Starting element }
     * @param      {String} <selector> { Selector to match against (class, ID, or data attribute) }
     * @return     {Boolean|Element} { Return false if not match found }
     */
    var getClosest = function (elem, selector) {
        var firstChar = selector.charAt(0);
        for ( ; elem && elem !== document; elem = elem.parentNode) {
            if (firstChar === '.') {
                if (elem.classList.contains(selector.substr(1))) {
                    return elem;
                }
            } else if (firstChar === '#') {
                if (elem.id === selector.substr(1)) {
                    return elem;
                }
            } else if (firstChar === '[') {
                if (elem.hasAttribute(selector.substr(1, selector.length - 2))) {
                    return elem;
                }
            }
        }
        return false;
    };
    //@todo Do something
    
    /**
     * getRandomColor
     * @private
     * @return     {color} { 16位颜色值 }
     */
    var getRandomColor = function () {
        return '0123456789abcdef'.split('').map(function(v, i, a) {
            return i > 5 ? null : a[Math.floor(Math.random() * 16)]
        }).join('');
    };

    /**
     * getRandomSize
     * @private
     * @returns    {size} { 类似300x400 }
     */
    var getRandomSize = function () {
        return SIZE[parseInt(Math.random() * 5)];
    }

    /**
    * getMinHeightIndex
    *
    * @return     {<Number>}  { 最小长度的那列的index值 }
    */
    var getMinHeightIndex = function () {
        var min = waterFall.columns[0].clientHeight;
        var index = 0;
        for (var i = 0, len = waterFall.columns.length; i < len; i++) {
            if (waterFall.columns[i].clientHeight < min) {
                min = waterFall.columns[i].clientHeight;
                index = i;
            }
        }
        return index;
    }


    /**
    * Gets the item.
    *
    * @return     {<DOM>}  The item.
    */
    var getItem = function () {
        var item = document.createElement('div'),
            image = document.createElement('img'),
            content = document.createElement('div'),
            title = document.createElement('h3'),
            p = document.createElement('p');

        item.classList.add("waterfall-item");
        content.classList.add('content');
        image.src = BASE_IMG_URL + getRandomSize() +'/'+ getRandomColor() + '/fff'; 
        title.appendChild(document.createTextNode('Heading'));
        p.appendChild(document.createTextNode('content'));

        content.appendChild(title);
        content.appendChild(p);
        item.appendChild(image);
        item.appendChild(content);

        return item;
    }

    /**
     * Gets the column.
     *
     * @return     {<DOM>}  The column.
     */
    var getColumn = function () {
        var column = document.createElement('div');

        column.classList.add(settings.columnClass);
        column.style.width = 100 / settings.columnNum + '%'; 

        return column;
    }

    /**
     * Adds an item.
     */
    var addItem = function (item) {
        var index = getMinHeightIndex();
        waterFall.columns[index].appendChild(item);

    }

    var lazyLoad = function (event) {
        //生成随机的
        var screenHeight = (document.documentElement.scrollTop || document.body.scrollTop) + (document.documentElement.clientHeight || document.body.clientHeight),
            container = waterFall.columns[getMinHeightIndex()],
            containerHeight = container.offsetTop + container.offsetHeight;

        if (containerHeight < screenHeight) {
            //还有页面上可能不止waterfall
            //滑动超过了waterfall
            addItem(getItem());

        }
    };

    var display = function (event) {
        if (event.target.tagName === 'IMG') {
            var display = document.querySelector('.'+ settings.diaplayClass),
                img = display.querySelector('img');
            img.setAttribute('src', event.target.getAttribute('src'));
            display.classList.add('show');

            display.addEventListener('click', function (){
                display.classList.remove('show');
            })
        }
    }

    var removeCol = function () {
        for (var i = 0; i < waterFall.columns.length; i++) {
            waterFall.columns[i].remove();
        }
    }

    var render = function () {

        waterFall.columns = []; 

        for (var i = 0; i < settings.columnNum; i++) {
            var column = getColumn();
            waterFall.columns.push(column);
            waterFall.container.appendChild(column);
        }      
        
        for (var j = 0, len = waterFall.items.length; j < len; j++) {
            //不用清空直接添加
            addItem(waterFall.items[j]);
        }
    }

    var attachEvents = function () {

        //Listen for events
        if (settings.lazyLoad) {
            window.addEventListener('scroll', scrollThrottler , false);            
        }

        waterFall.container.addEventListener('click', display
        , false);
    }

    /**
     * Destory the current initialization
     * @public
     */
    waterFall.destory = function () {
        //if plugin isn't already initialized, stop
        if (!settings) return;

        //@todo Undo any other init functions...
        removeCol();

        //Remove event listeners
        window.removeEventListener('scroll', scrollThrottler, false);
        waterFall.container && waterFall.container.removeEventListener('click', display, false);

        //Reset variables
        settings = null;
        eventTimeout = null; 
    }

    /**
     * On window scroll and resize, only run events at a rate of 15fps for better performance
     * @private
     * @param      {Function} <eventTimeout> { Timeout function }
     * @param      {Object} <settings> 
     */
    var scrollThrottler = function () {
        //在resize触发时要执行的函数外包裹一层
        //若连续触发该事件，就不会一直注册函数
        //直到一个轮回完
        if (!eventTimeout) {
            eventTimeout = setTimeout(function() {
                eventTimeout = null;
                lazyLoad();
            }, 66)
        }
    }

    /**
     * Initialize Plugin
     * @public
     * @param      {Object} <options> { User settings }
     */
    waterFall.init = function (options) {
        //feature test
        if (!supports) return;

        //Destory any existing initializations
        waterFall.destory();

        //Merge user options with defaults
        settings = extend( defaults, options || {});

        //@todo Do something

        waterFall.container = document.querySelector('.'+settings.initClass);
        waterFall.items = waterFall.container ? Array.prototype.slice.call(waterFall.container.querySelectorAll('.' + settings.itemClass)) : [];

        render();
        attachEvents();

    };

    waterFall.addColumn = function () {
        removeCol();
        settings.columnNum++;
        render();
        attachEvents();
    }

    waterFall.deleteColumn = function () {
        if (settings.columnNum > 0) {
            removeCol();
            settings.columnNum--;
            render();
            attachEvents();
        }
    }

    //
    //Public APIs
    //
    waterFall.addItem = addItem;

    return waterFall;
});

