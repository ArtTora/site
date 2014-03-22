ko.bindingHandlers.fancySelect = {
    init: function(element, valueAccessor, allBindingsAccessor){
        var obj = valueAccessor();

        setTimeout(function(){
            $(element).fancySelect({}).on('change.fs', function(){
                var binds = allBindingsAccessor();
                var options = allBindingsAccessor().options();
                var value = jQuery(this).val();

                if(options){
                    for(var i = 0; i < options.length; ++i){
                        if(options[i][binds.optionsValue] == value){
                            obj(options[i]);
                            $('select').trigger('update.fs');
                        }
                    }
                }
            });
        }, 1);
    }
};

(function(global){
    var PriceList = function(data){
        var self = this;

        self.items = ko.observableArray(data);
        self.formats = ko.observableArray([]);
        self.copyCounts = ko.observableArray([]);
        self.chromaticities = ko.observableArray([]);
        self.paperTypes = ko.observableArray([]);
        self.options = ko.observableArray([]);

        self.selectedItem = ko.observable();
        self.selectedItem.subscribe(function(value){
            if(value)
                self.formats(value.formats);
            else {
                self.selectedFormat(null);
                self.selectedChromaticite(null);
                self.selectedPaperType(null);
                self.selectedCopyCount(null);
            }
        });

        self.selectedFormat = ko.observable();
        self.selectedFormat.subscribe(function(value){
            if(value)
                self.chromaticities(value.chromaticities);
            else {
                self.selectedChromaticite(null);
                self.selectedPaperType(null);
                self.selectedCopyCount(null);
            }
        });

        self.selectedChromaticite = ko.observable();
        self.selectedChromaticite.subscribe(function(value){
            if(value)
                self.paperTypes(value.paper_types);
            else {
                self.selectedPaperType(null);
                self.selectedCopyCount(null);
            }
        });

        self.selectedPaperType = ko.observable();
        self.selectedPaperType.subscribe(function(value){
            if(value && value.copyCount){
                var data = [];

                for(var i = 0; i < value.copyCount.length; ++i){
                    data.push({ value: value.copyCount[i][0], price: value.copyCount[i][1] });
                }

                self.copyCounts(data);  
            } else {
                self.selectedCopyCount(null);
            }
        });

        self.selectedCopyCount = ko.observable();
        self.selectedCopyCount.subscribe(function(value){
            var allOptions = self.selectedPaperType() ? self.selectedPaperType().options : null;

            if(value && allOptions){
                var options = [];

                for(var i = 0; i < allOptions.length; ++i){
                    var option = allOptions[i];

                    for(var ii = 0; ii < option.prices.length; ++ii){
                        var price = option.prices[ii];

                        if(price[0] == value.value){
                            options.push(option);
                        }
                    }
                }

                self.options(options);
            }
        });

        self.checkedOptions = ko.observableArray([]);

        self.totalSum = ko.computed(function(){
            var copyCount = self.selectedCopyCount();
            var options = self.checkedOptions();

            if(copyCount){
                var total = copyCount.price;

                for(var i = 0; i < options.length; i++){
                    var option = options[i];

                    for(var ii = 0; ii < option.prices.length; ++ii){
                        var price = option.prices[ii];

                        if(price[0] == copyCount.value){
                            total += price[1];
                        }
                    }
                }

                return total;
            }

            return 0;
        });
    };

    global.bindPriceList = function(data){
        ko.applyBindings(new PriceList(data));
    };
})(window);
