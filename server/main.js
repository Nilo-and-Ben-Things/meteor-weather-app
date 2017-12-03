import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Match } from 'meteor/check';

Meteor.startup(() => {
  // code to run on server at startup
});

var callApiWithParams = function(apiUrl, params, callback){
  try {
    var response = HTTP.get(apiUrl, params);
    callback(null, response);
  } catch (error) {
    if (error.response) {
      var errorCode = error.response.data.code;
      var errorMessage = error.response.data.message;
    } else {
      var errorCode = 500;
      var errorMessage = 'Cannot access the API';
    }
    var myError = new Meteor.Error(errorCode, errorMessage);
    callback(myError, null);
  }
}

Meteor.methods({
  getWeather(params) {
    this.unblock();
    check(params, {
      lat: Match.Maybe(Number),
      lon: Match.Maybe(Number),
      zip: Match.Maybe(String),
      units: Match.Maybe(String),
    });
    params.appid = Meteor.settings.public.openweathermap;
    var apiUrl = 'http://api.openweathermap.org/data/2.5/weather';
    console.log('Method.getWeather for api ', apiUrl, 'with params ', params);
    var response = Meteor.wrapAsync(callApiWithParams)(apiUrl, {
      params: params
    });
    return response;
  }
});
