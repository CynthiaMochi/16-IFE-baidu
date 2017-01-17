(function () {
//弹框，在button上绑定目标modal,data-target,data-toggle
//点击空白处消失，fade in/out
//弹框的效果，后面遮层
//点击按钮，对应弹框出现

function Modal() {
    this.init();
}
Modal.prototype = {
    init: function () {
        var self = this;
        var btnModals = Array.prototype.slice.call($$('[data-toggle="modal"'));
        var btnCloses = Array.prototype.slice.call($$('[data-dismiss="modal"'));
        var modal, modalId, modalBack;
        btnModals.forEach(function (item) {
            addHandler(item, 'click', function (e) {
                modalId = self.getModalId(item);
                modal = $(modalId);
                self.showModal(modal);
            })
        })
        btnCloses.forEach(function (item) {
            addHandler(item, 'click', function (e) {
                modalBack =  $(".modal-backdrop", modal);
                self.hideModal(modal, modalBack);
            })
        });
    },
    getModalId: function (modal) {
        var modalId = '';
        if (modal.dataset) {
            modalId = modal.dataset.target; 
        } else {
            modalId = modal.getAttribute("data-target");
        }
        return modalId;
    },
    showModal: function (modal) {
        var self = this;
        var modalBack = document.createElement('div');
        var modalDialog = $(".modal-dialog", modal);
        var modalHeader = $(".modal-bar", modal);
        modalBack.classList.add('modal-backdrop', 'fade', 'in');
        modal.insertBefore(modalBack, modalDialog);
        setTimeout(function () {
            addClass(modal, 'in');
        }, 0)
        modal.style.display = "block";
        this.autoCenter(modalDialog);
        addHandler(modalBack, 'click', function () {
            self.hideModal(modal, this);
        })
        this.drag(modalHeader, modalDialog);
    },
    hideModal: function (modal, back) {
        
        modal.removeChild(back);
        removeClass(back, 'in');
        removeClass(modal, 'in');
        setTimeout(function () {
            modal.style.display = "none";
        }, 300);
    },
    autoCenter: function (dialog) {
        var dialogW = dialog.offsetWidth;

        dialog.style.marginLeft = - dialogW/2 + 'px';
    },
    drag: function (node, dialog) {
        node.style.cursor = 'move';
        addHandler(node, 'mousedown', function (e) {
            var disX = e.clientX - dialog.offsetLeft;
            var disY = e.clientY - dialog.offsetTop;
            dialog.style.marginLeft = 0;
            function move(event) {
                dialog.style.left = event.clientX - disX + 'px';
                dialog.style.top = event.clientY - disY + 'px';
            }
            addHandler(document, 'mousemove', move);
            addHandler(document, 'mouseup', function () {
                removeHandler(document, 'mousemove', move);
            })

        })
    }
}
    var modal = new Modal();
})()