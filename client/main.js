import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.weather.onCreated(function weatherOnCreated() {
  this.inputcounter = new ReactiveVar(0);
  this.temp = new ReactiveVar(0);
  this.temp_min = new ReactiveVar(0);
  this.temp_max = new ReactiveVar(0);
  this.description = new ReactiveVar(0);
  this.postcode = new ReactiveVar('getting current location');
  this.loc = Geolocation.latLng() || { lat: 0, lng: 0};

  weather.get_data(this, {
    lat: this.loc.lat,
    lon: this.loc.lng,
    units: 'metric',
  });
});

Template.weather.helpers({
  inputcounter() {
    return Template.instance().inputcounter.get();
  },
  temp() {
    return Template.instance().temp.get();
  },
  temp_min() {
    return Template.instance().temp_min.get();
  },
  temp_max() {
    return Template.instance().temp_max.get();
  },
  description() {
    return Template.instance().description.get();
  },
  postcode() {
    return Template.instance().postcode.get();
  },
  loc() {
    return Geolocation.latLng() || { lat: 0, lng: 0};
  },
});

Template.weather.events({
  'submit .enter-input'(event, instance) {
    // Prevent default browser form submit
    event.preventDefault();

    instance.inputcounter.set(instance.inputcounter.get() + 1);

    //Get value from the form element
    const target = event.target;
    const text = target.input.value;

    //Set postcode
    instance.postcode.set(text);

    weather.get_data(instance, {
      zip: instance.postcode.get(),
      units: 'metric',
    });

    //Clear form
    target.input.value = '';
  },
});

let weather = {
  get_data( instance, params ) {
    Meteor.call('getWeather', params,
      (error, result) => {
        if (error) {
          console.log(error);
        }
        else {
          let data = result.data.main;
          instance.temp.set(data.temp);
          instance.temp_min.set(data.temp_min);
          instance.temp_max.set(data.temp_max);
          let weather = result.data.weather[0];
          instance.description.set(weather.description);
        }
      }
    );
  },
}
