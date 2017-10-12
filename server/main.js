import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
});

Meteor.methods({
  'weatherSearch'() {
    this.unblock();
    let self = this;
    try {
      let response = HTTP.call('GET', 'http://api.openweathermap.org/data/2.5/weather', {
        params: {
          zip: '3029,aus'
        }
      });

      console.log(response);
      self.ready();

    } catch(error) {
      console.log(error);
    }
  }

});
