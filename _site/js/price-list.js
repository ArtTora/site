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
        self.selectedCopyCount(null);
      }
    });

    self.selectedFormat = ko.observable();
    self.selectedFormat.subscribe(function(value){
        if(value) self.chromaticities(value.chromaticities);
    });

    self.selectedChromaticite = ko.observable();
    self.selectedChromaticite.subscribe(function(value){
        if(value) self.paperTypes(value.paper_types);
    });

    self.selectedPaperType = ko.observable();
    self.selectedPaperType.subscribe(function(value){
      if(value){
        var data = [];

        for(var i = 0; i < value.copyCount.length; ++i){
          data.push({ value: value.copyCount[i][0], price: value.copyCount[i][1] });
        }

        self.copyCounts(data);  
      }
    });

    self.selectedCopyCount = ko.observable();
    self.selectedCopyCount.subscribe(function(value){
        if(value){
            var allOptions = self.selectedFormat().options;
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
  };

  global.bindPriceList = function(data){
    ko.applyBindings(new PriceList(data));
  };
})(window);
