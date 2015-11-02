_tag_("jqtags.select2", function (select) {

  var jq = module("jQuery");

  return {
    tagName: "jq-select2",
    events: {
    },
    accessors: {
      value: {
        type: "string",
        default: "",
        onChange: "valueOnChange"
      },
      dropdownClass : {
        type: "string",
        default: ""
      },
      multiple : {
        type: "boolean",
        default: true
      }
    },
    methods: ["updateOptions"],
    initRemoteConfig : function(){
      this.mySelectedOptions ={};
      this.source = [];
    },
    attachedCallback: function () {
      var self = this;
      var query,initSelection,formatSelection,formatResult;
      if (this.$.innerHTML.trim() !== "") {
        this.$.innerHTML = '<select>' + this.$.innerHTML + '</select>';
        this.$select = jq(this.$).find("select");
        this.$select.val(this.$.value);
      } else {
        this.$.innerHTML = "<input/>";
        this.$select = jq(this.$).find("input");
        query = function (e,b) {
          return self.query.apply(self,arguments);
        };
        initSelection = function (element, callback) {
          return self.initSelection.apply(self,arguments);
        };
        formatSelection = function(item) {
          return self.formatSelection.apply(self,arguments);
        };
        formatResult = function(item) {
          return self.formatResult.apply(self,arguments);
        };
        this.initRemoteConfig();
      }
      this.$select.data(this.$.dataset).select2({
        multiple: this.$.multiple,
        query: query,
        initSelection : initSelection,
        formatSelection:formatSelection,
        formatResult:formatResult,
        dropdownCssClass : self.$.dropdownClass
      });
      this.$select.detach();
      this.$select.change(function (e) {
        self.$.value = self.$select.val();
        self.trigger("change",{value : self.$.value, text : self.mySelectedOptions[self.$.value] });
        self.trigger("input",{value : self.$.value,text : self.mySelectedOptions[self.$.value]});
      });
    },
    formatSelection : function(item) {
      if(item){
        var self = this;
        var text = item.text;
        self.mySelectedOptions[item.id] = item.text;
        self.trigger("jq.format",{
          item : item,
          callback : function(disp){
            text = disp;
          }
        });
        return text;
      }
    },
    formatResult : function(item) {
      if(item){
        var self = this;
        var text = item.text;
        self.mySelectedOptions[item.id] = item.text;
        self.trigger("jq.format.result",{
          item : item,
          callback : function(disp){
            text = disp;
          }
        });
        return text;
      }
    },
    query : debounce(function(e){
      this.trigger("jq.query",{
        value : this.$.value,
        term : e.term,
        callback : function(options){
          return e.callback({
            results : options
          });
        }
      });
    }),
    initSelection : function(element, callback){
      var self = this;
      var option = this.source.filter(function(option){
        return option.value === self.$.value;
      })[0];
      if(option) callback(option);
      this.trigger("jq.init",{
        value : this.$.value,
        callback : function(option2){
          if(option2)
            return  callback(option2);
        }
      });
    },
    detachedCallback: function () {
      this.$select.select2("destroy");
    },
    addOptions: function (options) {
      for (var i in options) {
        this.mySelectedOptions[options[i].id] = options[i].text;
      }
    },
    valueOnChange : function(e, oldValue, newValue){
      this.$select.select2("val", is.Empty(newValue) ? "" : (newValue + "").split(","));
    }
  };
});