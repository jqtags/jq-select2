_tag_("jqtags.select2", function(select) {
    var jq = module("jQuery");

      var makeOptionString = function (option) {
        return "<option value='" + option.id + "'>" + option.text + "</option>";
      };
      var makeOptionGroup = function (option) {
        return "<optgroup label='" + option.text + "'>";
      };
        var isCorrupted = {"null" : true, "undefined" : true };

    return {
        tagName: "jq-select2",
        events: {},
        accessors: {
            value: {
                type: "string",
                "default": "",
                onChange: "valueOnChange"
            },
            dropdownClass: {
                type: "string",
                "default": ""
            },
            multiple: {
                type: "boolean",
                "default": true
            },
            allowclear: {
                type: "boolean",
                "default": true
            },
            placeholder: {
                type: "string",
                "default": ""
            }
        },
        methods: [ "setOptions",  "updateOptions"],
        initRemoteConfig: function() {
            this.mySelectedOptions = {};
            this.source = [];
        },
        attachedCallback: function() {
            var self = this;
            var query, initSelection, formatSelection, formatResult;
            if (this.$.innerHTML.trim() !== "" && !this.$.multiple) {
                this.$.innerHTML = "<select>" + this.$.innerHTML + "</select>";
                this.$select = jq(this.$).find("select");
                this.$select.val(this.$.value);
                this.initRemoteConfig();
            } else {
                this.$.innerHTML = "<input/>";
                this.$select = jq(this.$).find("input");
                query = function(e, b) {
                    return self.query.apply(self, arguments);
                };
                initSelection = function(element, callback) {
                    return self.initSelection.apply(self, arguments);
                };
                formatSelection = function(item) {
                    return self.formatSelection.apply(self, arguments);
                };
                formatResult = function(item) {
                    return self.formatResult.apply(self, arguments);
                };
                this.initRemoteConfig();
            }
            this.$select.data(this.$.dataset).select2({
                multiple: this.$.multiple || undefined,
                allowClear: this.$.allowclear || false,
                query: query,
                initSelection: initSelection,
                formatSelection: formatSelection,
                formatResult: formatResult,
                placeholder: self.$.placeholder,
                dropdownCssClass: self.$.dropdownClass
            });
            this.$select.detach();
            this.$select.change(function(e) {
                self.$.value = self.$select.val();
                self.trigger("change", {
                    value: self.$.value,
                    text: self.mySelectedOptions[self.$.value]
                });
                self.trigger("input", {
                    value: self.$.value,
                    text: self.mySelectedOptions[self.$.value]
                });
            });
        },
        formatSelection: function(item) {
            if (item) {
                var self = this;
                var text = item.text;
                self.mySelectedOptions[item.id] = item.text;
                self.trigger("jq.format", {
                    item: item,
                    callback: function(disp) {
                        text = disp;
                    }
                });
                return text;
            }
        },
        formatResult: function(item) {
            if (item) {
                var self = this;
                var text = item.text;
                self.mySelectedOptions[item.id] = item.text;
                self.trigger("jq.format.result", {
                    item: item,
                    callback: function(disp) {
                        text = disp;
                    }
                });
                return text;
            }
        },
        query: debounce(function(e) {
            this.trigger("jq.query", {
                value: this.$.value,
                term: e.term,
                callback: function(options) {
                    return e.callback({
                        results: options
                    });
                }
            });
        }),
        initSelection: function(element, callback) {
            var self = this;
            var option = this.source.filter(function(option) {
                return option.value === self.$.value;
            })[0];
            if (option) callback(option);
            this.trigger("jq.init", {
                value: this.$.value,
                callback: function(option2) {
                    if (option2) return callback(option2);
                }
            });
        },
        detachedCallback: function() {
            this.$select.select2("destroy");
        },
        addOptions: function(options) {
            for (var i in options) {
                this.mySelectedOptions[options[i].id] = options[i].text;
            }
        },
        updateOptions : function(options){
            this.initRemoteConfig();
            return this.addOptions(options)
        },
        setOptions: function (options,defaultValue) {
          this.initRemoteConfig();
          var self = this;
          var optionsString = "";
          for (var i in options) {
            if (options[i].children !== undefined) {
              optionsString += makeOptionGroup(options[i]);
              for (var j in options[i].children) {
                optionsString += makeOptionString(options[i].children[j]);
              }
              optionsString += "</option>";
            } else {
              optionsString += makeOptionString(options[i]);
            }
          }
          self.$.innerHTML = optionsString;
          if(defaultValue !== undefined){
            self.$.value = defaultValue;
          } else if(options[0]){
            self.$.value = options[0].id;
          }
          this.$select.select("destroy");
          self.attachedCallback();
        },
        toList: function (str) {
          return is.String(str) && !is.Empty(str) && !isCorrupted[str] ? str.split(",") : (is.Array(str) ? str : []);
        },
        valueOnChange: function(e, oldValue, newValue) {
            this.$select.select2("val", is.Empty(newValue) ? "" : (newValue + "").split(","));
        }
    };
});
