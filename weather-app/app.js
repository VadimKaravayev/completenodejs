const yargs = require('yargs');

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
 
    geocode.geocodeAddress(argv.address, (error, result)=> {
        if (error) {
            console.log(error);
        } else {
            weather.getWeather(result.latitude, result.longitude, (err, weatherResult)=> {
                if (err) {
                    console.log(err);
                } else {
                    console.log(`Now it's ${weatherResult.temperature}`);
                    console.log(`But it feels like ${weatherResult.apparentTemperature}`);
                }
            });
        }
    });
    
    // 49.9827,36.22382
    
    
    



