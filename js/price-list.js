(function(global){
    var allDate = {};
    var itemNames = ['formats', 'chromaticities', 'paper_types', 'items'];

    var labels = {
        offset: {
            header: ['Тип', 'Формат', 'Цветность', 'Тип бумаги', 'Тираж', 'Стоимость'],
            blanks: ['Выберите тип', 'Выберите формат', 'Выберите цветность', 'Выберите тип бумаги', 'Выберите тираж', 'Выберите стоимость']
        }
    };

    var getItems = function(item){
        var items = item.formats || item.chromaticities || item.paper_types;

        if(!items && item.copyCount){
            items = [];

            for(var i = 0; i < item.copyCount.length; ++i){
                items.push({ name: item.copyCount[i][0], value: item.copyCount[i][1] });
            }
        }

        return items;
    };

    var getOptions = function(value, options){
        var result = [];

        for(var i = 0; i < options.length; ++i){
            var option = options[i];

            for(var ii = 0; ii < option.prices.length; ++ii){
                var price = option.prices[ii];

                if(price[0] == value){
                    result.push({ name: option.name, value: price[1] });
                }
            }
        }

        return result;
    };

    var buildSelect = function(list){
        if(!jQuery.isArray(list)){
            console.warn('Unexpected type');
            return;
        }

        var items = '<select><option></option>';

        jQuery.each(list, function(index, item){
            items += '<option value="' + index + '">' + item.name + '</option>';
        });

        return jQuery(items + '</select>');
    };

    var options = function(list, parentContainter, callback){
        var items = jQuery('<div/>').appendTo(parentContainter);

        jQuery.each(list, function(index, item){
            var itemEl = jQuery('<div />').appendTo(items);
            var checkbox = jQuery('<input />', { type: 'checkbox', value: item.value }).appendTo(itemEl);
            var label = jQuery('<label />').text(item.name).appendTo(itemEl);

            checkbox.change(function(){
                var sum = 0;

                items.find('input').each(function(){
                    if(jQuery(this).prop('checked')){
                        sum += parseInt(jQuery(this).val());
                    }
                });

                callback(sum);
            });
        });
    };

    var step = function(list, parentContainter, index){
        index = index || 0;

        var container = jQuery('<div />', { class: 'step' }).appendTo(parentContainter);
        var headerContainer = jQuery('<div />', { class: 'header' }).appendTo(container);
        var selectContainer = jQuery('<div />', { class: 'input' }).appendTo(container);
        var nextStepContainer = jQuery('<div />', { class: 'next-step' }).appendTo(container);
        var currentOptionsContainer = jQuery('<div />', { class: 'current-options' }).appendTo(container);
        var resultContainer = jQuery('<div />', { class: 'result' }).appendTo(container);
        var select = buildSelect(list);
        var nextStep;
        var result = 0;

        if(select){
            headerContainer.html(labels.offset.header[index]);

            selectContainer.append(select);
            select.change(function(){
                nextStepContainer.empty();
                currentOptionsContainer.empty();

                if(!select.val())
                    return;

                var currentItem = list[select.val()];
                var items = getItems(currentItem);

                if(items){
                    items.parent = currentItem;
                    nextStep = step(items, nextStepContainer, index + 1);
                } else {
                    resultContainer.html(currentItem.value);
                }

                if(list.parent && list.parent.options){
                    options(getOptions(currentItem.name, list.parent.options), currentOptionsContainer, function(sum){
                        resultContainer.html(currentItem.value + sum);
                    });
                }
            });
        }
    };

    jQuery(function(){
        jQuery.each(allDate, function(key, list){
            var container = jQuery('.' + key + '-container');
            var firstStep = step(list, container);
        });
    });

    global.bindPriceList = function(type, data){
        allDate[type] = data;
    };
})(window);
