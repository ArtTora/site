(function(global){
    var allDate = {};
    var itemNames = ['formats', 'chromaticities', 'paper_types', 'items'];
    var finishText = "Стоимость работы: {value}грн";

    var labels = {
        offset: {
            header: ['Тип', 'Формат', 'Цветность', 'Тип бумаги', 'Тираж'],
            blanks: ['Выберите тип', 'Выберите формат', 'Выберите цветность', 'Выберите тип бумаги', 'Выберите тираж']
        },
        souvenir: {
            header: ['Продукция', 'Размер', 'Цветность', 'Материал', 'Тираж'],
            blanks: ['Выберите продукцию', 'Выберите размер', 'Выберите цветность', 'Выберите материал', 'Выберите тираж']
        },
        large: {
            header: ['Материал', 'Формат', 'Опции'],
            blanks: ['Выберите материал', 'Выберите формат', 'Выберите опции']
        }
    };

    var getItems = function(item){
        var items = item.formats || item.chromaticities || item.paper_types || item.resolutions;

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

    var buildSelect = function(list, blankText){
        if(!jQuery.isArray(list)){
            console.warn('Unexpected type');
            return;
        }

        var items = '<select><option value="-1">' + blankText + '</option>';

        jQuery.each(list, function(index, item){
            items += '<option value="' + index + '">' + item.name + '</option>';
        });

        var select =  jQuery(items + '</select>');
        return select;
    };

    var buildSizeInputs = function(list, blankText){
        var callbacks = [];
        var element = jQuery('<div />');

        var widthContainer = jQuery('<div/>').appendTo(element);
        var heightContainer = jQuery('<div/>').appendTo(element);

        widthContainer.append('<label class="input-label">Длина, м: </label>');
        heightContainer.append('<label class="input-label">Ширина, м: </label>');

        var width = jQuery('<input />', { type: 'text' }).appendTo(widthContainer);
        var height = jQuery('<input />', { type: 'text' }).appendTo(heightContainer);

        var callback = function(){
            for(var i = 0; i < callbacks.length; ++i)
                callbacks[i].call(element, 'sizes');
        };

        width.change(callback).keyup(callback);
        height.change(callback).keyup(callback);

        element.val = function(){
            return {
                width: width.val(),
                height: height.val()
            };
        };

        element.change = function(callback){
            callbacks.push(callback);
        };

        setTimeout(function(){
          width.val(1);
          height.val(1);
          callback();
        }, 1);

        return element;
    };

    var largeOptions = function(list, parentContainter, callback){
      var items = jQuery('<div/>', { class: 'large-options' }).appendTo(parentContainter);
      var onChange = function(){
        callback(items.find('input').map(function(){
          if(jQuery(this).prop('checked')){
            return parseInt(jQuery(this).val());
          } else {
            return 0;
          }
        }).get());
      };

      jQuery.each(list, function(index, item){
        var itemEl = jQuery('<div />').appendTo(items);
        var checkbox = jQuery('<input />', { type: 'checkbox', value: item.price_per_unit }).appendTo(itemEl);
        var label = jQuery('<label />').text(item.name).appendTo(itemEl);

        checkbox.change(onChange);
      });
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

    var pricePerUnit = 0; // oh. I'm tired
    var square = 0;

    var step = function(labels, list, parentContainter, type, index){
        index = index || 0;

        var container = jQuery('<div />', { class: 'step' }).appendTo(parentContainter);
        var headerContainer = jQuery('<div />', { class: 'header' }).appendTo(container);
        var selectContainer = jQuery('<div />', { class: 'input' }).appendTo(container);
        var nextStepContainer = jQuery('<div />', { class: 'next-step' }).appendTo(container);
        var currentOptionsContainer = jQuery('<div />', { class: 'current-options' }).appendTo(container);
        var resultContainer;
        var nextStep, select;
        var result = 0;

        if(type == 'select')
            select = buildSelect(list, labels.blanks[index]); 
        else
            select = buildSizeInputs(list, labels.blanks[index]); 

        if(select){
            headerContainer.html(labels.header[index]);

            selectContainer.append(select);

            var callback = function(e){
                nextStepContainer.empty();
                currentOptionsContainer.empty();

                if(!select.val())
                    return;

                if(e == 'sizes'){
                    var size = this.val();
                    square = size.width * size.height;
                    if(!resultContainer) resultContainer = jQuery('<div />', { class: 'result' }).appendTo(container);
                    resultContainer.html(finishText.replace("{value}", pricePerUnit * square));
                    return;
                }

                var currentItem = list[select.val()];
                var items = getItems(currentItem);

                if(currentItem.price_per_unit){
                    pricePerUnit = currentItem.price_per_unit;
                    nextStep = step(labels, items, nextStepContainer, 'size_inputs', index + 1);
                } else {
                    if(items){
                        items.parent = currentItem;
                        nextStep = step(labels, items, nextStepContainer, type, index + 1);
                    } else {
                        if(!resultContainer) resultContainer = jQuery('<div />', { class: 'result' }).appendTo(container);
                        resultContainer.html(finishText.replace("{value}", currentItem.value));
                    }
                }

                if(currentItem.price_per_unit){
                    largeOptions(currentItem.options, currentOptionsContainer, function(multipliers){
                        var result = pricePerUnit * square;

                        for(var i = 0; i < multipliers.length; ++i)
                            result += multipliers[i] * square;

                        container.find('.step .result').html(finishText.replace("{value}", result));
                    });
                }
                else if(list.parent && list.parent.options){
                    options(getOptions(currentItem.name, list.parent.options), currentOptionsContainer, function(sum){
                        if(!resultContainer) resultContainer = jQuery('<div />', { class: 'result' }).appendTo(container);
                        resultContainer.html(finishText.replace("{value}", currentItem.value + sum));
                    });
                }
            };

            if(type == 'select'){
                selectContainer.find('select').fancySelect({ includeBlank: true }).on('change.fs', function(){
                    console.log('change');
                    callback();
                });
            } else {
                select.change(callback);
            }
        }
    };

    jQuery(function(){
        jQuery.each(allDate, function(key, list){
            var container = jQuery('.' + key + '-container');
            var firstStep = step(labels[key], list, container, 'select');
        });
    });

    global.bindPriceList = function(type, data){
        allDate[type] = data;
    };
})(window);
