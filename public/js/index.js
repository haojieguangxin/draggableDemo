/**
 * Created by zhang-j on 2016/7/20.
 */
$(function() {
    var $result = $('#result');

    var prevXY = {
        x: 0,
        y: 0
    };

    var xyArr = [];

    $('.sort-solid').draggable({
        cursor: 'move',
        helper: function() {
            return $('<ul class="sort-area"></ul>').append($(this).clone());
        },
        appendTo: $result,
        start: function(event, ui) {
            prevXY = {
                x: 0,
                y: 0
            };
            if (ui.helper.find('li').data('y') > 1) {
                $result.find('.sort-area').eq(0).find('li').filter(function(index) {
                    return index % 4 == 1 || index % 4 == 2;
                }).css({
                    'background-color': '#ccc'
                });
            }
        },
        drag: function(event, ui) {
            dragMove(ui);
        }
    });
    $result.droppable({
        drop: function(event, ui) {
            var $temp = $result.find('.js-temp');
            $result.find('.js-unit').show().removeAttr('style');

            if ($temp.length > 0) {
                var index = $result.find('li').index($temp);
                var y = Math.floor(index / 4) + 1, x = index % 4 + 1;
                var $clone = ui.helper;
                if ($clone.find('li').attr('data-from')) {
                    $clone = ui.helper.clone();
                    ui.draggable.hide();
                }
                $result.find('.js-temp').remove();

                // 記錄位置信息
                var uiWidth = $clone.find('li').data('x'), uiHeight = $clone.find('li').data('y');
                for (var xi = 0; xi < uiWidth; xi++) {
                    for (var yi = 0; yi < uiHeight; yi++) {
                        xyArr.push((x + xi) + '' + (y + yi));
                    }
                }

                $clone.css({
                    'position': 'absolute',
                    'left': 4 + 98 * (x-1) + 'px',
                    'top': 4 + 98 * (y-1) + 'px',
                    'background-color': '#fff'
                }).removeClass('ui-draggable-dragging');

                $clone.find('li').removeAttr('data-from').attr('data-pos-x', x).attr('data-pos-y', y);

                $clone.draggable({
                    cursor: 'move',
                    start: function(event, ui) {
                        // 在布局框内部拖动的时候，删除以前记录的位置信息
                        var $li = ui.helper.find('li');
                        var uiWidth = $li.data('x'), uiHeight = $li.data('y'), x = parseInt($li.attr('data-pos-x')), y = parseInt($li.attr('data-pos-y'));
                        for (var xi = 0; xi < uiWidth; xi++) {
                            for (var yi = 0; yi < uiHeight; yi++) {
                                xyArr = _.without(xyArr, (x + xi) + '' + (y + yi));
                            }
                        }

                        if (ui.helper.find('li').data('y') > 1) {
                            $result.find('.sort-area').eq(0).find('li').filter(function(index) {
                                return index % 4 == 1 || index % 4 == 2;
                            }).css({
                                'background-color': '#ccc'
                            });
                        }
                    },
                    drag: function(event, ui) {
                        dragMove(ui);
                    }
                });
                $(result).append($clone);
            }


        }
    });

    function dragMove(ui) {
        var x = 0, y = 0;
        var $li = ui.helper.find('li');
        var uiWidth = parseInt($li.data('x')), uiHeight = parseInt($li.data('y'));
        // i记录的是行数，就是布局框一共有多少行
        for(var i = 0; i < 4; i++) {
            // 一个框98px，当大于80px的时候就算到后面的框
            if(80 * i <= ui.position.left && ui.position.left < 80 + 98 * i) {
                x = i + 1;
                for(var j = 0; j < 10; j++) {
                    if(80 * j <= ui.position.top && ui.position.top < 80 + 98 * j) {
                        y = j + 1;
                        break;
                    }
                }
                break;
            }
        }


        if ((prevXY.x != x || prevXY.y != y) && x != 0 && x + uiWidth <= 5) {

            var index = (y - 1) * 4 + x - 1;

            prevXY = {
                x: x,
                y: y
            };

            // 拖动的元素在布局框中放不下
            $result.find('.js-temp').remove();
            $result.find('.js-unit').show();

            // 記錄橫縱坐標值
            for (var xi = 0; xi < uiWidth; xi++) {
                for (var yi = 0; yi < uiHeight; yi++) {
                    if (_.contains(xyArr, (x + xi) + '' + (y + yi))) {
                        return ;
                    }
                }
            }

            if(uiHeight > 1 && (x-1) % 4 != 0 && (x-1) % 4 != 3) {
                return;
            }



            var $placeUnit = $result.find('li');
            for (var l = index; l < index + uiWidth; l++) {
                for (var m = 0; m < uiHeight; m++) {
                    var $curLi = $placeUnit.eq(l + m*4);
                    if ($curLi.hasClass('js-unit')) {
                        $curLi.hide();
                    }
                    else {
                        break;
                    }
                }
            }

            if (uiHeight > 1 && (x-1) % 4 == 3){
                $placeUnit.eq(index).before('<li class="sort-unit-temp js-temp sort-' + uiWidth + uiHeight + '" style="float: right"></li>');
            }
            else {
                $placeUnit.eq(index).before('<li class="sort-unit-temp js-temp sort-' + uiWidth + uiHeight + '"></li>');
            }

        }
    }
} );