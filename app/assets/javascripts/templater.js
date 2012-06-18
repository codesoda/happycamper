window.templater = {
  templates: {},
  load: function(templateName) {
    var compiled = this.getTemplate(templateName);
    if (!compiled) {
      compiled = _.template($(templateName).html());
      this.addTemplate(templateName, compiled);
    }
    
    return compiled;
  },

  addTemplate: function(templateName, data) {
    this.templates[templateName] = data;
  },

  getTemplate: function(templateName) {
    return this.templates[templateName];
  }

};
