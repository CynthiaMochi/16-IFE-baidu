//改成构造函数
waterFall.init()

var addItemBtn = document.getElementById('addItem'),
    addColBtn = document.getElementById('addCol'),
    deleteColBtn = document.getElementById('deleteCol');

    addItemBtn.addEventListener('click', waterFall.addItem, false);
    addColBtn.addEventListener('click', waterFall.addColumn, false);
    deleteColBtn.addEventListener('click', waterFall.deleteColumn, false);
    
//没有尝试destory是否有效