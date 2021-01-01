
const CurrencyConverter = (() => {
    const base = "USD";
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

    return (amount, from, to) => {
        return new Promise(async (resolve, reject) => {
            validateType(amount, "amount", "number");
            validateType(from, "from", "string");
            validateType(to, "to", "string");

            from = from.toUpperCase();
            to = to.toUpperCase();

            try {
                if (from === to) {
                    return amount;
                } else {
                    const rateToBase = await getConversionRate(from);
                    const rateToTarget = await getConversionRate(to);

                    resolve((amount * rateToBase) / rateToTarget);
                }
            } catch (e) {
                reject(e);
            }
        });
    };
})();
