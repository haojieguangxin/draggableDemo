/**
 * Created by zhang-j on 2016/7/21.
 */
$(function() {
    Handlebars.registerHelper("compare",function(v1,v2,options){
        if(v1>v2){
            //满足添加继续执行
            return options.fn(this);
        }else{
            //不满足条件执行{{else}}部分
            return options.inverse(this);
        }
    });

    var datas = [{
        name: 'AAA',
        width: 4*3,
        height: 1,
        x: 1,
        y: 1
    }, {
        name: 'bbb',
        width: 1*3,
        height: 2,
        x: 1,
        y: 2
    }, {
        name: 'ccc',
        width: 2*3,
        height: 1,
        x: 2,
        y: 2
    }, {
        name: 'ddd',
        width: 1*3,
        height: 1,
        x: 4,
        y: 2
    }, {
        name: 'eee',
        width: 2*3,
        height: 1,
        x: 2,
        y: 3
    }, {
        name: 'fff',
        width: 1*3,
        height: 2,
        x: 4,
        y: 3
    }, {
        name: 'ggg',
        width: 1*3,
        height: 1,
        x: 1,
        y: 4
    }, {
        name: 'hhh',
        width: 2*3,
        height: 1,
        x: 2,
        y: 4
    }];
    var template = Handlebars.compile($('#demoTemplate').html());

    $('#result').html(template({
        data: datas
    }));
});