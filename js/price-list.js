(function(global){
    var allDate = {};
    var itemNames = ['formats', 'chromaticities', 'paper_types'];

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

    var step = function(list, parentContainter){
        var container = jQuery('<div />', { class: 'step' }).appendTo(parentContainter);
        var selectContainer = jQuery('<div />', { class: 'input' }).appendTo(container);
        var nextStepContainer = jQuery('<div />', { class: 'next-step' }).appendTo(container);
        var select = buildSelect(list);
        var nextStep;

        if(select){
            selectContainer.append(select);
            select.change(function(){
                nextStepContainer.empty();

                if(!select.val())
                    return;

                var items = getItems(list[select.val()]);

                if(items){
                    nextStep = step(items, nextStepContainer);
                } else {
                    console.log('result');
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
