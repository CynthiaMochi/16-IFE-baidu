//两个验证
var data_box = {
    type_box: $("#typeBox"),
    rule_box: $("#ruleBox"),
    tag_box: $("#tagBox"),
    option_box: $("#optionBox"),
    limit_box: $("#limitBox"),
    display_box: $("#forShow"),
    diy_box: $("#forDiy"),
    btn_add: $("#btnAdd"),
    btn_submit: $("#btnSubmit"),
    label: $("#label"),
    min_length: $("#min_length"),
    max_length: $("#max_length"),
    tag_input: $('#tagBox input'),
    tag_display: $('#forTags')
}

var FormFactory = new createData(data_box);
FormFactory.init();