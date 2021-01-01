# CurrencyConvert.js
A simple Javascript wrapper around https://exchangeratesapi.io/

## Usage
```javascript
// Promise
CurrencyConverter(1, "usd", "jpy").then((result) => {
    // Do something with it.
    console.log(result);
}).catch(console.error);

// Await
const result = await CurrencyConverter(1, "usd", "jpy");
```
