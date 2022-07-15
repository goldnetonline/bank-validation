const path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser'),
    axios = require('axios').default,
    app = express(),
    port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.use((req, res, next) => {
    let input = {};
    ['body', 'params', 'query'].forEach((source) => {
        if (req[source]) {
            input = { ...input, ...req[source] };
        }
    });
    req._input = input;

    req.input = (key = null, defaultValue = null) =>
        !key ? req._input : req._input[key] || defaultValue;

    return next();
});

app.all('/paystack', async (req, res) => {
    let endpoint = req.input('endpoint'),
        data = req.input('data'),
        secretKey =
            process.env.PAYSTACK_SECRET_KEY ||
            'sk_test_8728ef06c131917d73a1618bf2e4647278f7e476';

    if (!endpoint) {
        return res.status(400).json({
            status: false,
            message: 'Endpoint is required',
        });
    }

    // Remove slash at the beginning of the url
    endpoint = endpoint.replace(/^\//, '');

    axios.defaults.headers.common['Authorization'] = `Bearer ${secretKey}`;
    axios.defaults.baseURL = 'https://api.paystack.co';

    try {
        const paystackRequest = await axios[data ? 'post' : 'get'](
            endpoint,
            data
        );
        return paystackRequest.data
            ? res.status(paystackRequest.status).json(paystackRequest.data)
            : res.status(400).json({
                  status: false,
                  message: 'Cannot make paystack request',
              });
    } catch (error) {
        return res.status(error?.response?.status || 400).json(
            error?.response?.data || {
                status: false,
                message: 'Cannot make paystack request',
            }
        );
    }
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, function () {
    console.log(`App running on port ${port}`);
});
