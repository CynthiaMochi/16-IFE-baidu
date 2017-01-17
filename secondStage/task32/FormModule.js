
  // {
  //       label: '名称',                    // 表单标签
  //       type: 'input',                   // 表单类型
  //       input_type: 'number'             //input表单的种类
  //       validator: function () {...},    // 表单验证规
  //       min_length: 0,
  //       max_length: 1,
  //       necessary: true,
  //       id: 0,                           //表单的id
  //       default_text '必填，长度为4-16个字符',    // 填写规则提示
  //       success_text: '格式正确',              // 验证通过提示
  //       fail_text: ['名称不能为空'  ]             // 验证失败提示
  //   }
  //一个创建工厂
  //不知道怎么动态设名称，怎么把设的验证传过去

  //工厂的：sections，和各种验证方法都只有一套

    //添加组件 
    function createData (dataOp) {
        this.typeBox = dataOp.type_box || null;//类型
        this.optionBox = dataOp.option_box || null;//配置
        this.ruleBox = dataOp.rule_box || null;//规则
        this.limitBox = dataOp.limit_box || null;//长度限制
        this.tagBox = dataOp.tag_box || null;//标签，用于单选框，多选框，下拉框
        this.btnAdd = dataOp.btn_add || null;//添加的按钮
        this.btnSubmit = dataOp.btn_submit || null;//添加的按钮

        this.displayBox = dataOp.display_box;//用于展示的地方
        this.diyBox = dataOp.diy_box;//添加表单的组件
        this.label = dataOp.label;//表单的名称
        this.min_length = dataOp.min_length;//最小长度
        this.max_length = dataOp.max_length;//最大长度
        this.tagInput = dataOp.tag_input;
        this.tagDisplay = dataOp.tag_display;
        this.dataArr = [];//创建一个就遍历
        this.newPart = "";
        this.count = 0;
    }
    createData.prototype = {
        init: function () {
            var self = this;
            Array.prototype.forEach.call($$("input[type=radio]"), function (dom) {
                addHandler(dom, "click", function (e) {
                    e.target.parentNode.dataset.chosen = e.target.id;
                })
            })
            console.log(this.tagInput,  this.tagDisplay)
            this.selectDom = new Tag(this.tagInput, this.tagDisplay);//创建选项
            this.selectDom.init();

            addHandler(this.btnAdd, 'click', function (e) {
                e.preventDefault();
                self.render();
            })
            addHandler(this.btnSubmit, 'click', function (e) {
                e.preventDefault();
                self.dataArr.forEach(function (arr) {
                    arr.validator();
                })

            })
        },
        newForm: function () {
            var data = this.setData();
            switch (data.type) {
                case "input":
                    switch (data.inputType) {
                        case "text":
                        case "password":
                            data = this.getLengthVali(data);
                            break;
                        case 'number':
                        case 'email':
                        case 'phone':
                            data = this.getInputVali(data);
                            break;
                    }
                    this.addInput(data)
                break;
                case "textarea":
                    data = this.getLengthVali(data);
                    this.addTextarea(data)
                break;
                case "radio":
                    data = this.getItemVali(data);
                    if (data != null) {
                        this.addRadio(data); 
                    }                       
                break;
                case "checkbox":
                    data = this.getItemVali(data);
                    if (data != null) {
                        this.addCheckbox(data);
                    }
                break;
                case "select":
                    data = this.getItemVali(data);
                    if (data != null) {
                        this.addSelect(data);                        
                    }
                break;
            }
            return data;

        },
        addInput: function (data) {
            var self = this;
            this.newPart = "<label>"+data.label+"</label><input id='"+data.id+ "' type='"+data.type+"'><span></span>";
        },
        addRadio: function (data) {
            var self = this;
            var str = data.tags.map(function (tag, index) {
                return "<input type='radio' id='"+data.id+index+"' name='"+data.id+"'><label for='"+data.id+index+"'>"+tag+"</label>"        
                }).join('');
            self.newPart = "<div id='"+data.id+"'><label>"+data.label+"</label>" + str + "</div><span></span>";
        },
        addCheckbox: function (data) {
            var self = this;
            var str = data.tags.map(function (tag, index) {
                return "<input type='checkbox' id='"+data.id+index+"' name='"+data.id+"'><label for='"+data.id+index+"'>"+tag+"</label>"        
                }).join('');
            self.newPart = "<div id='"+data.id+"'><label>"+data.label+"</label>"+ str + "</div><span></span>";
        },
        addSelect: function (data) {
            var self = this;
            var str = data.tags.map(function (tag, index) {
                return "<option for='"+data.id+index+"'>"+tag+"</option>"        
                }).join('');
            self.newPart = "<div id='"+data.id+"'><label>"+data.label+"</label><select id='"+data.id+"'>" + str + "</select></div><span></span>"
        },
        addTextarea: function (data) {
            this.newPart = "<label>"+data.label+"</label><textarea id='"+data.id+"'></textarea><span></span>"
        },
        setData: function () {
            var data = {};
            data.label = this.label.value || '';
            data.type = this.typeBox.dataset.chosen || '';
            data.necessary = (this.optionBox.dataset.chosen == "necessary" ? true : false) || true;
            data.inputType = this.ruleBox.dataset.chosen || '';
            data.id = "form"+this.count;
            //输入框和文本域有验证
            return data;

        },
        //text,password
        getLengthVali: function (data) {
            data.minLength = this.min_length.value;
            data.maxLength = this.max_length.value;
            data.failText = {
                void: data.label + "不能为空",
                min: data.label + "长度不能小于" + data.minLength + "个字符",
                max: data.label + "长度不能大于" + data.maxLength + "个字符"
            }
            data.successText = data.label + "格式正确"
            data.defaultText = (data.necessary ? "必填" : "选填") + ",请输入您的" + data.label;
            data.validator = validator["length"];
            return data;        
        },
        //number,email,phone
        getInputVali: function (data) {
            data.inputType = this.ruleBox.dataset.chosen;
            data.failText = {
                void: data.label + "不能为空",
                warn: data.label + "格式不正确",
            }
            data.successText = data.label + "格式正确";
            data.defaultText = (data.necessary ? "必填" : "选填") + ",请输入您的" + data.label;
            data.validator = validator[data.inputType];    
            return data;
        },
        getItemVali: function (data) {
            var items = this.selectDom.tags;
            if (items.length === 0) {
                alert("还没有添加" + data.label + '的选项');
                data = null;
            } else if ( items.length === 1) {
                alert('只添加了一个选项，无法创建' + data.label);
                data = null;
            } else {
                data.tags = items;
                data.failText = {
                    warn: data.label + "未选择",
                    void: '请选择' + data.label
                }
                data.successText = data.label + "已选择";
                data.defaultText = (data.necessary ? "必填" : "选填") + ",请选择您的" + data.label;
                data.validator = validator[data.type];    
            }
            return data;
        },
        render: function () {
            var data = this.newForm();
                this.count++;

            if(this.newPart != "") {
                var newDiv = document.createElement('div');
                    newDiv.innerHTML = this.newPart;
                this.displayBox.insertBefore(newDiv, this.btnSubmit);
                this.newPart = "";     
                this.dataArr.push(new Form(data));
            }
        }
    };

function Form(data) {
    this.data = data;
    this.dom = document.getElementById(data.id);
    this.notice = this.dom.nextElementSibling;
    this.validator = data.validator;
    console.log(data, this.dom, this.notice);
    this.init();
}
Form.prototype = {
    init: function () {
        addHandler(this.dom, 'focus', this.defaultNotice.bind(this));
        addHandler(this.dom, 'blur', this.validator.bind(this));
        addHandler(this.dom, 'change', this.validator.bind(this));
    },
    defaultNotice: function () {
        this.notice.innerHTML = this.data.defaultText;
        this.notice.className = 'default';
        this.dom.className = 'default';
    },
    failNotice: function (name) {
        this.notice.innerHTML = this.data.failText[name];
        this.notice.className = 'warn';
        this.dom.className = 'warn';
    },
    successNotice: function () {
        this.notice.innerHTML = this.data.successText;
        this.notice.className = 'right';
        this.dom.className = 'right';
    }

}
