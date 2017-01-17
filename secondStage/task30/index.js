(function () {
    //少用一些id
    //代码结构太相似，能不能简化
    //好的代码https://github.com/fujisheva/BaiduTest/blob/gh-pages/JSTask18.html
    var validate = {
        flag: false,
        hint: [
            {warn: "名称格式错误", right: "名称格式正确", isPass: false},
            {warn: "密码格式错误", right: "密码可用", isPass: false},
            {warn: "请再输入一次密码", right: "密码输入一致", isPass: false},
            {warn: "邮箱无效", right: "邮箱有效", isPass: false},
            {warn: "手机有效", right: "手机有效", isPass: false}            
        ],

        onUsername: function (inputDom, notice) {
            // 不为空，且在4到16个字符
            var value = inputDom.value,
                textLength = 0;
            if (value === "" || value === null) {
                this.setWarnStyle(inputDom, notice, "名称不能为空");

            } else {
                textLength = countLength(value);
                if (textLength <= 16 && textLength >= 4) {
                    this.setRightStyle(inputDom, notice, "名称格式正确");
                } else {
                    this.setWarnStyle(inputDom, notice, "名称格式错误");
                }
            }
            return this.flag;
        },
        onPassword: function(inputDom, notice) {
            //不为空，且由数字和字母组成，不少于6位,不多于20
            var value = inputDom.value;

            if (value === "" || value === null) {
                this.setWarnStyle(inputDom, notice, "密码不能为空");


            } else {
                if (/\d+\w+/g.test(value) && value.length >= 6 && value.length <= 20) {
                    this.setRightStyle(inputDom, notice, "密码可用");
                      
                } else {
                    this.setWarnStyle(inputDom, notice, "密码格式错误");
        
                }
            }
            return this.flag;
        },
        onConfirm: function(formal, inputDom, notice) {
            //和之前输入的密码相同
            var value = inputDom.value;

            if (value === "" || value === null) {
                this.setWarnStyle(inputDom, notice, "请再输入一次密码");

            } else {
                if (formal.value === value) {
                    this.setRightStyle(inputDom, notice, "密码输入一致");
                      
                } else {
                    this.setWarnStyle(inputDom, notice, "密码输入不一致");
        
                }
            }
            return this.flag;
        },
        onEmail: function(inputDom, notice) {
            //有效的邮箱
            var value = inputDom.value;

            if (value === "" || value === null) {
                this.setWarnStyle(inputDom, notice, "邮箱不能为空")

            } else {
                if (/^([\w\.\-]+)\@(\w)+((\.\w+)+)$/.test(value)) {
                    this.setRightStyle(inputDom, notice, "邮箱有效");
                           
                } else {
                    this.setWarnStyle(inputDom, notice, "邮箱无效");
        
                }
            }
            return this.flag;
        },
        onPhone: function(inputDom, notice) {
            //有效的电话
            var value = inputDom.value;

            if (value === "" || value === null) {
                this.setWarnStyle(inputDom, notice, "电话不能为空")

            } else {
                if (/^1([34578])\d{9}$/g.test(value)) {
                    this.setRightStyle(inputDom, notice, "手机有效") 
                        
                } else {
                    this.setWarnStyle(inputDom, notice, "手机无效");
        
                }
            }
            return this.flag;
        },
        setWarnStyle: function (inputDom, notice, text) {
            if (typeof inputDom !== "undefined" && typeof notice !== "undefined") {
                inputDom.setAttribute('class', 'warn');
                notice.setAttribute('class', 'warn');
                notice.innerHTML = text;
                this.flag = false;
            }
        },
        setRightStyle: function (inputDom, notice, text) {
            if (typeof inputDom !== "undefined" && typeof notice !== "undefined") {
                inputDom.setAttribute('class', 'right');
                notice.setAttribute('class', 'right');
                notice.innerHTML = text;
                this.flag = true;
            }
        }
    }

    function countLength(value) {
        if (value.length !== 0) {

            return  value.match(/[\u4E00-\u9FA5\uF900-\uFA2D]/g) ? value.match(/[\u4E00-\u9FA5\uF900-\uFA2D]/g).length + value.length : value.length;
        }
    }


    var myForm = document.querySelector('#myForm');
    var userDom = document.querySelector('#username'),
        passwordDom = document.querySelector('#password'),
        confirmDom = document.querySelector('#confirm'),
        emailDom = document.querySelector('#email'),
        phoneDom = document.querySelector('#phone');
    var userNote = document.querySelector('#userNotice'),
        passwordNote = document.querySelector('#passwordNotice'),
        confirmNote = document.querySelector('#confirmNotice'),
        emailNote = document.querySelector('#emailNotice'),
        phoneNote = document.querySelector('#phoneNotice');
    myForm.onsubmit = function (e) {
        e.preventDefault();
        var isValidate = validateForm();
        if(isValidate) alert("输入有效")
        else alert("输入有误")
    }
    var $ = function (el) {
       return document.querySelector(el);
    }
    var $$ = function (el) {
        return document.querySelectorAll(el);
    }
    function validateForm() {
        // body...
        return validate.onUsername(userDom, userNote)
            && validate.onPassword(passwordDom, passwordNote)
            && validate.onPassword(passwordDom, passwordNote)
            && validate.onEmail(emailDom, emailNote)
            && validate.onPhone(phoneDom, phoneNote)
    }
            addHandler(userDom, 'blur', function (e) {
                validate.onUsername(userDom, userNote)
            });
            addHandler(passwordDom, 'blur', function (e) {
                validate.onPassword(passwordDom, passwordNote)
            });
            addHandler(confirmDom, 'blur', function (e) {
                validate.onConfirm(passwordDom, confirmDom, confirmNote)
            });
            addHandler(emailDom, 'blur', function (e) {
                validate.onEmail(emailDom, emailNote)
            });
            addHandler(phoneDom, 'blur', function (e) {
                validate.onPhone(phoneDom, phoneNote)
            });
})()
