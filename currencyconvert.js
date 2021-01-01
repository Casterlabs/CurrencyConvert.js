// Written like this to help prevent tampering with internal things.
// Also has the side effect of *almost* being compatible with JDK Nashorn.

const CurrencyConverterVersion = "1.0.1";

const CurrencyConverter = (function () {
    const base = "USD"; // TODO: Make this configurable by the end user, perhaps a class?

    const apiEndpoint = "https://api.exchangeratesapi.io/latest?symbols=" + base + "&base=";
    const refreshRate = ((2 * 60) * 60) * 1000; // 2 hours

    let currencyTable = {};

    function getConversionRate(name) {
        return new Promise((resolve, reject) => {
            if (name === base) {
                resolve(1);
            } else {
                let currencyInfo = currencyTable[name];

                if (!currencyInfo || ((Date.now() - currencyInfo.timestamp) >= refreshRate)) {
                    fetch(apiEndpoint + name).then((response) => response.json()).then((result) => {
                        if (result.error) {
                            reject(result.error);
                        } else {
                            const conversionRate = result.rates[base];

                            currencyTable[name] = {
                                conversionRate: conversionRate,
                                timestamp: Date.now()
                            };

                            resolve(conversionRate);
                        }
                    }).catch(reject);
                } else {
                    resolve(currencyInfo.conversionRate);
                }
            }
        });
    }

    function validateType(val, name, expected) {
        const type = typeof val;

        expected = expected.toLowerCase();

        if (type !== expected) {
            throw "Expected \"" + name + "\" to be of type \"" + expected + "\", got \"" + type + "\" instead.";
        }
    }

    return (function (amount, from, to) {
        return new Promise(async (resolve, reject) => {
            validateType(amount, "amount", "number");
            validateType(from, "from", "string");
            validateType(to, "to", "string");

            from = from.toUpperCase();
            to = to.toUpperCase();

            try {
                if (from === to) {
                    resolve(amount);
                } else {
                    const rateToBase = await getConversionRate(from);
                    const rateToTarget = await getConversionRate(to);

                    resolve((amount * rateToBase) / rateToTarget);
                }
            } catch (e) {
                reject(e);
            }
        });
    });
})(); // We evaluate here.
