const yargs = require('yargs');
const axios = require('axios');

const geocode = require('./geocode/geocode');
const weather = require('./weather/weather');

const argv = yargs
    .options({
        a: {
            demand: true,
            alias: 'address',
            describe: 'Address to fetch weather for',
            string: true
        }
    })
    .help()
    .alias('help', 'h')
    .argv;
 
let encodedAddress = encodeURIComponent(argv.address);
let geocodeUrl = `http://www.mapquestapi.com/geocoding/v1/address?key=39HTuy9d4sd1VUZG73Y2NMAOm25VkyKt&location=${encodedAddress}`;

axios.get(geocodeUrl).then((response)=> {
    let lat = response.data.results[0].locations[0].latLng.lat;
    let lng = response.data.results[0].locations[0].latLng.lng;
    let weatherUrl = `https://api.darksky.net/forecast/adad37e4ee0f344a1be00225d07d0e08/${lat},${lng}`;
    return axios.get(weatherUrl);
    
}).then((response)=> {
    let temperature = response.data.currently.temperature;
    let apparentTemperature = response.data.currently.apparentTemperature;
    console.log(`Now it's ${temperature}`);
    console.log(`But it feels like ${apparentTemperature}`);
}).catch((error)=> {
    console.log(error);
});
