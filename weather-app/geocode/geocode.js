const request = require('request');

function geocodeAddress(address, callback) {
    let encodedAddress = encodeURIComponent(address);
    request({
        url: `http://www.mapquestapi.com/geocoding/v1/address?key=39HTuy9d4sd1VUZG73Y2NMAOm25VkyKt&location=${encodedAddress}`,
        json: true
    }, (error, response, body)=> {
        try {
           callback(undefined, {
                city: body.results[0].locations[0].adminArea5,
                address: body.results[0].locations[0].street,
                latitude: body.results[0].locations[0].latLng.lat,
                longitude: body.results[0].locations[0].latLng.lng
            }); 
        } catch(error) {
            callback('Unable to connect to Google servers');
        }
    });
}

module.exports = {geocodeAddress};