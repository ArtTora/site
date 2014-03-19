(function(global){
  var PriceList = function(data){
    var self = this;

    self.items = ko.observableArray(data);
    self.formats = ko.observableArray([]);
    self.copyCounts = ko.observableArray([]);

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
      if(value){
        var data = [];

        for(var i = 0; i < value.copyCounts.length; ++i){
          data.push({ value: value.copyCounts[i][0], price: value.copyCounts[i][1] });
        }

        self.copyCounts(data);  
      }
    });

    self.selectedCopyCount = ko.observable();
  };

  global.bindPriceList = function(data){
    ko.applyBindings(new PriceList(data));
  };
})(window);
