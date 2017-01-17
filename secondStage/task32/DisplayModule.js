
var validator = {
    'length': function () {
        var minLength = this.data.minLength;
        var maxLength = this.data.maxLength;
        var text = this.dom.value;
        if(text === "") {
            if (this.data.necessary) {
                this.failNotice("void");
            } else {
                this.defaultNotice();
                return true;
            }
        } else {
            var valueLength =  text.match(/[\u4E00-\u9FA5\uF900-\uFA2D]/g) ? text.match(/[\u4E00-\u9FA5\uF900-\uFA2D]/g).length + text.length : text.length;
            if (valueLength < minLength ) {
                this.failNotice("min");
            } else if (valueLength > maxLength) {
                this.failNotice("max");
            } else {
                this.successNotice();
                return true;             
            }
        }
        return false;   
    },
    'password': function () {
        var text = this.dom.value;

        if(text === "") {
            if (this.data.necessary) {
                this.failNotice("void");
            } else {
                this.defaultNotice();
                return true;
            }
        } else {
            if (/\d+\w+/g.test(dom.value)) {
                this.successText();
                return true;
            } else {
                this.failNotice("warn");
            }
        }   
        return false;     
    },
    'email': function () {
        var text = this.dom.value;
        if(text === "") {
            if (this.data.necessary) {
                this.failNotice("void");                
            } else {
                this.defaultNotice();
                return true;
            }
        } else {
            if (/^([\w\.\-]+)\@(\w)+((\.\w+)+)$/.test(dom.value)) {
                this.successNotice();     
                 return true;
            } else {
                this.failNotice("warn")
            }
        }    
        return false;   
    },
    'phone': function () {
        var text = this.dom.value;
        if(text === "") {
            if (this.data.necessary) {
                this.failNotice("void")
            } else {
                this.defaultNotice();
                return true;
            }
        } else {
            if (/^1([34578])\d{9}$/g.test(text)) {
                this.successNotice()          
                return true;

            } else {
                this.failNotice("warn")
            }
        }       
        return false; 
    },
    'number': function () {
        var text = this.dom.value;
        if(text === "") {
            if (this.data.necessary) {
                this.failNotice("void");
            } else {
                this.defaultNotice();
                return true;
            }
        } else {
            if (/^\d*$/.test(text)) {
                this.successNotice()          
                return true;    
            } else {
                this.failNotice("warn")
            }
        }       
        return false;
    },
    'checkbox': function () {
        var tags =Array.prototype.slice.call(this.dom.getElementsByTagName('input'));
        var isVoid = tags.some(function (tag) {
            return tag.checked === true;
        });
        if (!isVoid) {
            if (this.data.necessary) {
                this.failNotice("void");
            }  else {
                this.defaultNotice();
                return true;
            }
        } else {
            this.successNotice()          
            return true; 
        }
        return false;
    },
    'radio': function () {
        var tags =Array.prototype.slice.call(this.dom.getElementsByTagName('input'));
        var isVoid = tags.some(function (tag) {
            return tag.checked === true;
        })
        if (!isVoid) {
            if (this.data.necessary) {
                this.failNotice("void");
            }  else {
                this.defaultNotice();
                return true;
            }
        } else {
            this.successNotice()          
            return true; 
        }
        return false;
    },
    'select': function (argument) {
        this.successNotice()          
        return true; 
    }
}