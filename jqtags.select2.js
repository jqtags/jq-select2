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
      }
    },
    methods: ["updateOptions"],
    initRemoteConfig : function(){
      this.mySelectedOptions ={};
      this.source = [];
    },
    attachedCallback: function () {
      var self = this;
      console.error("attachedCallback", this.$.dataset);
      var query,initSelection,formatSelection;
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
        this.initRemoteConfig();
      }
      this.$select.data(this.$.dataset).select2({
        query: query,
        initSelection : initSelection,
        formatSelection:formatSelection,
        dropdownCssClass : self.$.dropdownClass
      });
      this.$select.detach();
      this.$select.change(function (e) {
        self.$.value = self.$select.val();
        self.trigger("change");
        self.trigger("input");
      });
    },
    formatSelection : function(item) {
      if(item){
        var self = this;
        self.mySelectedOptions[item.id] = item.text;
        self.trigger("jq.selected",{
          item : item,
          format : function(disp){
            self.mySelectedOptions[item.id] = disp;
          }
        });
        return item.text;
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
    initSelection : debounce(function(element, callback){
      var self = this;
      callback(this.source.filter(function(option){
        return option.value === self.$.value;
      })[0]);
      this.trigger("jq.init",{
        value : this.$.value,
        callback : function(options){
          return callback(options);
        }
      });
    }),
    detachedCallback: function () {
      this.$select.select2("destroy");
    },
    addOptions: function (options) {
      for (var i in options) {
        this.mySelectedOptions[options[i].id] = options[i].text;
      }
    },
    valueOnChange : function(e, oldValue, newValue){
      this.$select.select2("val", (newValue + "").split(","));
    }
  };
});