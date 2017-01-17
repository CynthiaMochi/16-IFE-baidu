  //创建tags
    function Tag(input, dom) {
        this.input = input || null;
        this.dom = dom || null;
        this.tags = [];
    }
    Tag.prototype = {
        init: function () {
            var self = this;
            addHandler(self.input, 'keyup', function (e) {
                if (e.keyCode === 32 || e.keyCode === 13 || e.keyCode === 188) {
                    self.newTag(e.target.value);
                    self.render();
                }
            });
            delegateEvent(self.dom, 'span', 'click', function (e) {
                self.removeTag(e.target.innerText)
            })
        },
        newTag: function (value) {
            if (value) {
                this.tags = beUnique(this.tags.concat(value.split(/[,、，\s\t\n]/)));
                this.input.value = "";
            }
        },
        removeTag: function (value) {
            this.tags.splice(this.tags.indexOf(value), 1);
            this.render();
        },
        render: function () {
            var str = "";
            this.tags.forEach(function (tag) {
                str += "<span class='tag'>" + tag + "</span>";
            });
            this.dom.innerHTML = str;           
            
        }
    }