const axios = require('axios');

const url = 'http://data.fixer.io/api/latest?access_key=92854ab07130dc3608370ac7dc6331d8';

// const getExchangeRate = (from, to)=> {
//     return axios.get(url).then(response=> {
//         const euro = 1 / response.data.rates[from];
//         const rate = euro * response.data.rates[to];
//         return rate;
//     });
// };
const getExchangeRate = async (from, to)=> {
    try {
        const response = await axios.get(url);
        const euro = 1 / response.data.rates[from];
        const rate = euro * response.data.rates[to];
        
        if (isNaN(rate)) {
            throw new Error();
        }
        return rate;
    } catch(e) {
        throw new Error(`Unable to get exchange for ${from} and ${to}`);
    }
};

// const getCountries = (currencyCode)=> {
//     return axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`).then(response=> {
//         return response.data.map(country=> country.name);
//     });
// };
const getCountries = async (currencyCode)=> {
    try {
        const response = await axios.get(`https://restcountries.eu/rest/v2/currency/${currencyCode}`);
        return response.data.map(country=> country.name);
    } catch(e) {
        throw new Error('Unable to get countries');
    }
};

// const converCurrency = (from, to, amount)=> {
//     let convertedAmount;
//     return getExchangeRate(from, to).then((rate)=>{
//         convertedAmount = (rate * amount).toFixed(2);
//         return getCountries(to);
//     }).then((countries)=> {
//         return `${amount} ${from} is worth ${convertedAmount} ${to}. You can spend it in the following countries ${countries.join(', ')} `;
//     });
// };

const converCurrency = async (from, to, amount)=> {
    const rate = await getExchangeRate(from, to);
    const convertedAmount = (rate * amount).toFixed(2);
    const countries = await getCountries(to);
    return `${amount} ${from} is worth ${convertedAmount} ${to}. You can spend it in the following countries ${countries.join(', ')} `;
};

// getExchangeRate('USD', 'CAD').then(rate=> {
//     console.log(rate);
// });

// getCountries('USD').then(countries=> {
//     console.log(countries);
// });

converCurrency('USD', 'CAD', 150).then((result)=> {
    console.log(result);
}).catch(e=> console.log(e.message));