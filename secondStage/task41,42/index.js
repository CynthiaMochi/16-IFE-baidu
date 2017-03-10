// 日期选择面板默认隐藏，会显示一个日期显示框和一个按钮，点击这两个部分，会浮出日历面板。再点击则隐藏。
// 点击选择具体日期后，面板隐藏，日期显示框中显示选取的日期
// 增加一个接口，用于当用户选择日期后的回调处理
// 增加一个参数及相应接口方法，来决定这个日历组件是选择具体某天日期，还是选择一个时间段
// 当设置为选择时间段时，需要在日历面板上点击两个日期来完成一次选择，两个日期中，较早的为起始时间，较晚的为结束时间，选择的时间段用特殊样式标示
// 增加参数及响应接口方法，允许设置时间段选择的最小或最大跨度，并提供当不满足跨度设置时的默认处理及回调函数接口
// 在弹出的日期段选择面板中增加确认和取消按钮
(function ($) {
    var datePicker = function (element, options) {
        var picker = {},
            widget = false,
            currentDate = new Date,//需要是现在或者传入的时间,应该要在显示的时候转换成getFullTime
            nowTime = new Date,
            input,  
            maxDate ,maxObj,
            minDate, minObj,
            rangeLimit = 100,
            unset = true,
            selected, 
            verticalModes = ['top', 'bottom', 'auto'],
            horizontalModes = ['left', 'right', 'auto'],
            CAL_DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            CAL_MONTH_LABELS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            //私有方法
            getFullTime = function (now) {
                //需要传入Date对象
                var time = now || new Date(),
                    year = time.getFullYear(),
                    month = time.getMonth(),
                    week = time.getDay(),
                    day = time.getDate(),
                    timeStr = year +'-'+(month+1)+'-'+day;
                return {
                    date: time,
                    year: year,
                    week: week,
                    day: day,
                    month: month,
                    timeStr: timeStr
                }
            },
            getDatePickerTemplate = function () {
                var headTemplate = $('<thead>')
                        .append($('<tr>')
                            .append($('<th>').addClass('prev').attr('data-action', 'previous').append($('<i>').addClass(options.icons.previous)))
                            .append($('<th>').addClass('switch').attr('data-action', 'switch').attr('colspan', 5))
                            .append($('<th>').addClass('next').attr('data-action', 'next').append($('<i>').addClass(options.icons.next)))
                            );
                return ($('<div>').addClass('datepicker-days')
                    .append($('<table>').addClass('table-condensed')
                        .append(headTemplate)
                        .append($('<tbody>')))
                    )
            },
            getTemplate = function () {
                var template = $('<div>').addClass('datepicker-widget dropdown-menu'),
                    dateView = template.append(getDatePickerTemplate());
                if (options.inline) {
                    template.removeClass('dropdown-menu');
                }
                return dateView;
            },
            showMode = function (dir) {
                if (!widget) {
                    return;
                }
                widget.find('.datepicker-days').show()
            },
            updateMonth = function (dir) {
                var month = currentDate.month + dir;
                var time = new Date(currentDate.year, month, currentDate.day);
                currentDate = getFullTime(time);
                $('.switch').text(CAL_MONTH_LABELS[currentDate.month] +' '+currentDate.year);
                update()
            },
            fillDow = function () {
                var row = $('<tr>');
                CAL_DAY_LABELS.forEach(function (day) {
                    row.append($('<th>').addClass('dow').text(day));
                }) 
                widget.find('.datepicker-days thead').append(row);
                widget.append(getBtns());
            },
            getBtns = function () {
                var btnOk = $('<button>').attr('type', 'button').attr('data-action', 'ok').addClass('btn').text('确定'),
                    btnCancel = $('<button>').attr('type', 'button').attr('data-action', 'cancel').addClass('btn').text('取消'),
                    div = $('<div>').addClass('btns').append(btnOk).append(btnCancel);
                return div;
            },
            getDaysInMonth = function (year, month) {
                return (new Date(year, parseInt(month), 0)).getDate();
            },
            getDay = function (year, month, day) {
                return (new Date(year, month, day)).getDate();
            },
            fillDate = function () {
                var daysView = widget.find('.datepicker-days'),
                    daysViewHeader = daysView.find('th'),
                    time = currentDate,
                    startDay = new Date(time.year, time.month, 1).getDay(),
                    monthLength = getDaysInMonth(time.year, time.month+1),
                    current = 0,
                    html = [],
                    row,
                    clsName,
                    i, j;

                daysViewHeader.eq(1).text((CAL_MONTH_LABELS[time.month] +' '+time.year))

                var n = 1,
                    timeStr = '',
                    neStartDay = 0 - startDay;
                for (i = 0; i< 6; i++) {
                    row = $('<tr>');
                    for (j = 0; j <7; j++) {
                        clsName = '';
                        if (n <= monthLength) {
                            if (neStartDay++ >= 0) {
                                current = n++;
                                timeStr = time.year + '-' + (time.month+1) + '-' +current; 
                            } else {
                                current = getDay(time.year, time.month, neStartDay);
                                clsName += 'old';
                                timeStr = time.year + '-' + time.month + '-' +current;
                            }
                        }   else {
                            current = getDay(time.year, time.month, n++); 
                            clsName += 'new';            
                            timeStr = time.year + '-' + (time.month+2) + '-' +current;
                        } 
                        row.append('<td data-action="selectDay" data-day="'+timeStr+'" class="day '+clsName+'">'+current+'</td>')
                    }
                    html.push(row)
                }
                daysView.find('tbody').empty().append(html)

            },
            //交互方法
            actions = {
                next: function () {
                    updateMonth(1);
                },
                previous: function () {
                    updateMonth(-1);

                },
                selectDay: function (e) {
                    //不能输入2017-3-40这种
                    e.stopImmediatePropagation()
                    var time = new Date($(e.target).data('day'))
                    if (options.allowRange && minObj) {
                        //需要一个一个判断
                        selectRange(time);
                    } else  {
                        currentDate = getFullTime(time);
                        minObj = currentDate;
                        selectCurrent();                        
                    }
                },
                ok: function (e) {
                    //点击的时候再保存minDate和maxDate
                    if (maxObj && minObj) {
                        var range = (maxObj.date - minObj.date)/(60*60*24*1000);
                        if (range <= options.maxRange && range >= options.minRange) {
                            minDate = minObj;
                            maxDate = maxObj;

                        alert('选择了'+minDate.timeStr+'到'+maxDate.timeStr)   
                        } else {
                            console.error('选择不在规定范围内')
                        }
                    } 
                    if (!options.inline) {
                        hide();
                        
                    }
                },
                cancel: function () {
                    //点击就不保存
                    maxObj = maxDate;
                    minObj = minDate;
                    if (!options.inline) {
                        hide();
                        
                    }
                }
            },
            doAction = function (e) {
                //不disabled
                actions[$(e.currentTarget).data('action')].apply(picker, arguments);
                return false;//?
            },
            removeRange = function (min, max) {
                var temp;

                temp = $.extend({}, min);
                while (temp.timeStr !==  max.timeStr) {
                    getTargetDom(temp.timeStr).removeClass('active range');
                    temp = getFullTime(new Date(temp.year, temp.month, temp.day+1));
                }
                getTargetDom(min.timeStr).removeClass('active');
                getTargetDom(max.timeStr).removeClass('active');
            },
            selectRange = function (time) {
                if (minObj && maxObj) removeRange(minObj, maxObj)

                var min = minObj ,
                    max = time ? getFullTime(time) : maxObj;
                    minObj = min.date < max.date ? min : max;
                    maxObj = min.date < max.date ? max : min;

                //字符转换为时间对象，再对比是否到了
                
                var temp, tempDom;

                temp = $.extend({}, minObj);
                while (temp.timeStr !==  maxObj.timeStr) {
                    getTargetDom(temp.timeStr).removeClass('active').addClass('range');
                    temp = getFullTime(new Date(temp.year, temp.month, temp.day+1));
                }
                getTargetDom(minObj.timeStr).removeClass('range').addClass('active')
                getTargetDom(maxObj.timeStr).removeClass('range').addClass('active')                
                
            },
            getTargetDom = function (str) {
                return $('[data-day=' + str+']');
            },
            selectCurrent = function (dom) {
                var dom = getTargetDom(currentDate.timeStr);
                if (selected) {
                    selected.removeClass('active');
                }
                if (dom) {
                    dom.addClass('active')
                    selected = dom;
                    input.val(selected.data('day'))
                    unset = false;
                }
            },
            change = function (e) {
                var val = $(e.target).val().trim(),
                    parsedDate = val ? parseInputDate(val) : null;
                    if (!unset) {
                        $(e.target).val(parsedDate.timeStr);
                        update();
                        if (!options.allowRange) {
                            selectCurrent();                                               
                        } else if ( minObj && maxObj ){
                            selectRange()
                        }
                    } else {
                        $(e.target).val(currentDate.timeStr);

                    }
                    //会阻止加在该对象上的其他事件的执行
                    e.stopImmediatePropagation();
                    return false;
            },
            update = function () {
                if (!widget) {
                    return;
                }
                fillDate();
                if (!options.allowRange ) {
                    selectCurrent()   
                } else if (minObj && maxObj) {
                    selectRange();
                }
            },
            createWidget = function () {
                widget = getTemplate();                    
                fillDow();
                fillDate()
                //update();

                widget.on('click', '[data-action]', doAction)
                widget.on('mousedown', false);

                //widget.show();//外部接口
                place()

            },
            show = function () {
                //要动态创建table
                //决定显示的位置
                //绑定时间
                //显示的时候要将input上的值标记到table上
                //将输入的时间显示为标准的时间字符串
                //如果输入的无效，所以要在blur的时候判断是否符合格式,否则就不改变用unset
                if (input.val() !== undefined && input.val().trim().length !== 0) {
                    //不如直接设置,不为空
                    var time = parseInputDate(input.val().trim())
                    if (!time) {
                        console.error('the input is INVALID')

                        time = currentDate;
                    }
                    //设置成功，设置currentDate
                    currentDate = time;
                    input.val(currentDate.timeStr);
                } else if ((input.is('input') && input.val().trim().length === 0) || options.inline) {
                    //如果input没有东西就设置为现在
                    input.val(currentDate.timeStr);
                }
                if (!widget) {
                    createWidget();
                } 
                if (!options.allowRange) {
                    selected = getTargetDom(currentDate.timeStr).addClass('active')
                }

                maxObj = maxDate;
                minObj = minDate;
                if (maxObj && minObj) selectRange();

                widget.fadeIn();

                return picker;
            },
            hide = function () {
                //移除DOM
                widget.fadeOut()
                return picker;

            },
            toggle = function () {
                return (widget ? hide() : show());
            },
            parseInputDate = function (inputDate) {
                //如果输入无效的就选今天
                //返回的是getFullTime
                //转换成功就要改变currentDate
                var time = new Date(inputDate);
                if (time.toString() === "Invalid Date") {
                    console.error('Invalid Date!');
                    unset = true;
                    time = currentDate;
                } else {
                    unset = false;
                    time = getFullTime(time);
                    currentDate = time;
                }
                return time;
            },
            place = function () {
                if (element.is('input')) {
                    parent = element.after(widget)
                }
                if (parent.css('position') !== 'relative') {
                    parent = parent.parent().filter(function () {
                        return $(this).css('position') === 'relative';
                    }).first();
                }
                if (parent.length === 0) {
                    throw new Error('datepicker component should be placed within a relative positioned container');
                }
                parent.append(widget);
            },
            attachDatePickerElementEvents = function () {
                input.on({
                    'change': change,
                    'blur': options.inline ? '' : hide,
                    'focus': options.allowInputToggle ? show : ''
                })
                if (element.is('input')) {
                    input.on({
                        'focus': show
                    });
                } 
            },
            detachDatePickerElementEvents = function () {
                input.off({
                    'change': change,
                    'blur': blur,
                    'focus': options.allowInputToggle ? hide : ''
                })
                if (element.is('input')) {
                    input.off({
                        'focus': show
                    });
                }
            };


        //公共方法,向外提供接口
        picker.show = show;
        picker.hide = hide;
        picker.toggle = toggle;
        picker.defaultDate = function (defaultDate) {
            if (arguments.length === 0) {
                return options.defaultDate ? options.defaultDate.clone : options.defaultDate;
            }
            if (!defaultDate) {
                options.defaultDate = false;
                return picker;
            }
            if (typeof defaultDate === 'string') {
                if (defaultDate === 'now' || defaultDate === 'moment') {
                    defaultDate = nowTime;
                }
            }
            var parsedDate = parseInputDate(defaultDate);

            options.defaultDate = parsedDate;
            if (options.defaultDate && options.inline || (input.val().trim() === '' && input.attr('placeholder') === undefined)) {
                input.val(parsedDate)
            }

            return picker;
        };
        picker.allowInputToggle = function (allowInputToggle) {
            if (arguments.length === 0) {
                return options.allowInputToggle;
            }

            if (typeof allowInputToggle !== 'boolean') {
                throw new TypeError('allowInputToggle() expects a boolean parameter');
            }

            options.allowInputToggle = allowInputToggle;
            return picker;
        };
        picker.icons = function (icons) {
            if(arguments.length === 0) {
                //如果没有传参就是get
                return $.extend({}, options.icons);
            }

            if (!(icons instanceof Object)) {
                throw new TypeError('icons() expects parameter to be an Object');           
            }
            $.extend(options.icons, icons);
            if (widget) {
                //显示隐藏重新替换图标?
                hide();
                show();
            }
            return picker;
        };
        picker.inline = function (inline) {
            if (arguments.length === 0) {
                return options.inline;
            }
            if (typeof inline !== 'boolean') {
                throw new TypeError('inline() expects a boolean parameter');
            }

            options.inline = inline;
            return picker;
        };       
        picker.allowRange = function (allowRange) {
            //设置一个最大时间和一个最小时间
            //两个都选择后，若有点击，判断是大还是小，进行相应的切换
            //遍历给中间的日期加样式
            if (arguments.length === 0) {
                return options.allowRange;
            }

            if (typeof allowRange !== 'boolean') {
                throw new TypeError('allowRange() expects a boolean parameter');
            }

            options.allowRange = allowRange;
            return picker;
        };
        picker.minRange = function (minRange) {

            if (arguments.length === 0) {
                return options.minRange;
            }

            if (typeof minRange !== 'number') {
                throw new TypeError('minRange() expects a number parameter');
            }

            options.minRange = minRange;
            return picker;
        };
        picker.maxRange = function (maxRange) {

            if (arguments.length === 0) {
                return options.maxRange;
            }

            if (typeof maxRange !== 'number') {
                throw new TypeError('maxRange() expects a number parameter');
            }

            options.maxRange = maxRange;
            return picker;
        };
        picker.options = function (newOptions) {
            //如果后面有新设的options
            if (arguments.length === 0) {
                return $.extend(true, {}, options);
            }
            if (!(newOptions instanceof Object)) {
                throw new TypeError('options() options parameter should be an object');
            }
            $.extend(true, options, newOptions);
            $.each(options, function (key, value) {
                //options有对应的函数处理
                if (picker[key] != undefined) {
                    picker[key](value);
                } else {
                    throw new TypeError('option' + key+ 'is not recognized!')
                }
            });
            return picker;
        };


        //initializing element
        if (element.is('input')) {
            input = element;
        } else {
            input = element.find('input');
        }
        if (!input.is('input') && !options.inline) {
            throw new Error('Could not initialize DateTimePicker without an input element');
        }

        picker.options(options);
        attachDatePickerElementEvents();

        currentDate = getFullTime(currentDate);

        if (input.is('input') && input.val().trim().length !== 0) {
            input.val(parseInputDate(input.val().trim()))
            currentDate = parseInputDate(input.val().trim());
        } else if (options.defaultDate && input.attr('placeholder') === undefined) {
            input.val(parseInputDate(options.defaultDate));
            currentDate = parseInputDate(options.defaultDate)
        }
        if (options.inline) {
            //detachDatePickerElementEvents()
            show();
        }
        return picker;
    };


    $.fn.datePicker = function (options) {
        //可能是类
        return this.each(function () {
            var $this = $(this);
            if(!$this.data('DatePicker')) {
                //单例,深拷贝(true)
                options = $.extend(true, {}, $.fn.datePicker.defaults, options);
                $this.data('DatePicker', datePicker($this, options));
            }
        });
    };

    $.fn.datePicker.defaults = {
        defaultDate: false,
        icons: {
            previous: "fa fa-angle-left fa-lg",
            next: "fa fa-angle-right fa-lg"
        },
        inline: true,
        allowRange: true,
        maxRange: 100,
        minRange: 10,
        allowInputToggle: false,
    }

    $('.datepicker').datePicker();
})(jQuery)


