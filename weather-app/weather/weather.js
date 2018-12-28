const request = require('request');

function getWeather(lat, lng, callback) {
    const myUrl = `https://api.darksky.net/forecast/adad37e4ee0f344a1be00225d07d0e08/${lat},${lng}`;
    request({url: myUrl, json: true}, (error, response, body)=> {
        try {
            callback(undefined, {
                temperature: body.currently.temperature, 
                apparentTemperature: body.currently.apparentTemperature});
            //console.log('response status: ', response.statusCode);
            //let result = body.currently.temperature;
            //console.log(result);
        } catch (err) {
            callback('Some error occured');
            //console.log(err.name);
            //console.log(err.message);
        }
    });
}

module.exports.getWeather = getWeather;

//
//body.currently.temperature