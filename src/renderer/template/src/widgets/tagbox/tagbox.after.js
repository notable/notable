
_.merge ( Svelto.Widgets.Tagbox.config, {
  templates: {
    tag: _.template ( `
      <div class="label tagbox-tag <%= o.color %> <%= o.size %> <%= o.css %>" data-tag-value="<%= o.value %>">
        <span><%= o.value %></span>
        <i class="icon <%= Svelto.Sizes.small %> actionable tagbox-tag-remover">close</i>
      </div>
    ` )
  },
  options: {
    tag: {
      minLength: 1,
      color: 'highlight',
      size: 'xsmall',
      css: 'rounded'
    },
    addOnBlur: false,
    sort: false
  }
});
