var User = {
  controller: function() {
    m.route('/login');
  },
  view: function(ctrl) {
    return m.component(Login);
  }
};