(function () {
    //https://github.com/hellozts4120/IFE-2016/blob/master/task2/serial5/task31-zts/task.js
    var radios = document.getElementsByName('identity');
    var city = document.getElementsByName('city')[0];
    var schools = document.getElementsByName('schools')[0];

    var cityList = [
        {
            key: 'beijing',
            city: '北京',
            schools: ['北京大学', '北京邮电大学', '清华大学']
        },
        {
            key: 'shanghai',
            city: '上海',
            schools: ['复旦大学', '上海交通大学', '上海大学']
        },
    ];
    addHandler(city, 'change', function (e) {
        var index = e.target.selectedIndex;
        var schoolValues = cityList[index].schools;
        schools.options.length = 0;
        schoolValues.forEach(function (schoolValue) {
            var optionDom = document.createElement('option');
            optionDom.setAttribute("value", schoolValue);
            optionDom.append(document.createTextNode(schoolValue));
            schools.append(optionDom);
        })
    })
    radios.forEach(function (radio) {
        addHandler(radio, 'click', function (e) {

            if (e.target.value === "student") {
                $('#city').style.display = "block";
                $('#workPlace').style.display = "none";
            } else {
                $('#city').style.display = "none";
                $('#workPlace').style.display = "block";
            }
        })
    })


})()