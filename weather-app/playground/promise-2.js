const request = require('request');

function geocodeAddress(address) {
    return new Promise((resolve, reject)=> {
        let encodedAddress = encodeURIComponent(address);
        request({
            url: `http://www.mapquestapi.com/geocoding/v1/address?key=39HTuy9d4sd1VUZG73Y2NMAOm25VkyKt&location=${encodedAddress}`,
            json: true
        }, (error, response, body)=>{
            try {
               resolve({
                    city: body.results[0].locations[0].adminArea5,
                    address: body.results[0].locations[0].street,
                    latitude: body.results[0].locations[0].latLng.lat,
                    longitude: body.results[0].locations[0].latLng.lng
                }); 
            } catch(error) {
                reject('Unable to connect to Google servers');
            }
        });
    });
}

geocodeAddress('Ukraine Kharkiv Moskalivska 2').then((result)=> {
    console.log(JSON.stringify(result, undefined, 2));
}).catch((err)=> {
    console.log(err);
});