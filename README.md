# CurrencyConvert.js
A simple Javascript wrapper around https://exchangeratesapi.io/  
  
CurrencyConvert automatically caches the exchange rate for two hours, it will pull an updated exchange rate as needed.  

--------

## Usage
```javascript
// Promise
CurrencyConverter(1, "usd", "jpy").then((result) => {
    // ...
    console.log(result);
}).catch(console.error);

// Await
try {
    const result = await CurrencyConverter(1, "usd", "jpy");
} catch (err) {
    console.error(err);
}
```

## Adding it to your project
```html
<script src="https://casterlabs.github.io/CurrencyConvert.js/currencyconvert.js"></script>
```
