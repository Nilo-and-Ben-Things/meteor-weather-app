import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.hello.onCreated(function helloOnCreated() {
  // counter starts at 0
  this.counter = new ReactiveVar(0);
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});


Template.weather.onCreated(function weatherOnCreated() {
  this.temperature = new ReactiveVar(0);
});

Template.weather.helpers({
  temperature() {
    return Template.instance().temperature.get();
  },
});

Template.weather.events({
  'click button'(event, instance) {
    let apiKey = Meteor.settings.public.openweathermapapi;

    HTTP.call('GET', 'http://api.openweathermap.org/data/2.5/weather', {
        params: {
          zip: '3029,au',
          units: 'metric',
          appid: apiKey
        }
      },
      (error, result) => {
        if (error) {
          console.log(error);
        }
        else {
          let temperature = result.data.main.temp;
          instance.temperature.set(temperature);
        }
      }
    );

  },
});
