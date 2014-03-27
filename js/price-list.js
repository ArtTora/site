(function(global){
    var allDate = {};
    var itemNames = ['formats', 'chromaticities', 'paper_types', 'items'];

    var getItems = function(item){
        var items = item.formats || item.chromaticities || item.paper_types;

        if(!items && item.copyCount){
            items = [];

            for(var i = 0; i < item.copyCount.length; ++i){
                items.push({ name: item.copyCount[i][0] });
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
                    result.push(option);
                }
            }
        }

        return options;
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

    var options = function(list, parentContainter){
        var items = '';

        jQuery.each(list, function(index, item){
            items += '<input type="checkbox" /> ' + item.name;
        });

        parentContainter.append(items);
    };

    var step = function(list, parentContainter){
        var container = jQuery('<div />', { class: 'step' }).appendTo(parentContainter);
        var selectContainer = jQuery('<div />', { class: 'input' }).appendTo(container);
        var nextStepContainer = jQuery('<div />', { class: 'next-step' }).appendTo(container);
        var currentOptionsContainer = jQuery('<div />', { class: 'current-options' }).appendTo(container);
        var select = buildSelect(list);
        var nextStep, currentOptions;

        if(select){
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
                    nextStep = step(items, nextStepContainer);
                } else {
                    console.log('result');
                }

                if(list.parent && list.parent.options){
                    currentOptions = options(getOptions(currentItem.name, list.parent.options), currentOptionsContainer);
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
