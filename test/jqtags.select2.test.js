define({
  name: "jqtags.select2.test",
  extend: "spamjs.view",
  modules: ["jqtags.select2"]
}).as(function () {

  return {
    src: [
      "jqtags.select2.test.html",
      "select2.options.json"
    ],
    events: {
      "change .myselectbox": "dropdownChanged",
      "change .myselectbox2": "dropdown2Changed",
      "jq.query .myselectbox2": "dropdown2Query",
      "jq.init .myselectbox2": "dropdown2init"
    },
    _init_: function () {
      var self = this;
      self.myOptions = [{
        id: "amr", text : "AMAR"
      },{
        id: "akb", text : "Akbar"
      },{
        id: "ant", text : "Anthony"
      }];
      this.view("jqtags.select2.test.html").done(function () {
        self.model({
          testvalue: "amr"
        });
      });
    },
    dropdownChanged: function (a, b, c) {
      console.info("dropdownChanged", a, b, c);
    },
    dropdown2Changed: function (a, b, c) {
      console.info("dropdownChanged", a, b, c);
    },
    dropdown2Query : function(e,b,c){
      console.info("dropdown2Query", e, b, c);
      e.detail.callback(this.myOptions);
    },
    dropdown2init : function(e,b,c){
      //return;
      e.detail.callback(this.myOptions.filter(function(option){
        return option.id === e.detail.value;
      })[0]);
    },
    _remove_: function () {

    }
  };

});