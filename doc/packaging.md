# Note on packaging

Netcode provides you with 2 pre-packaged versions of the library for _Node_ and for the _browser_, so you can use it out of the box.
You can also _import the ES6 source code_ directly and manage the packaging yourself with a tool like Webpack.

Let's see an example of both these setups:

## Using the pre-packaged libraries

On the server-side (node):

```javascript
const {
    Server,
    BinaryEncoder,
    UInt16Codec,
    BooleanCodec,
    StringCodec,
    // ...
} = require('netcode/server');`
```

And in the browser as well:

```html
<body>
    <!-- Defines a netcode variable in global scope -->
    <script src="node_modules/netcode/client.js"></script>
    <script>
        const {
            Client,
            BinaryEncoder,
            UInt16Codec,
            BooleanCodec,
            StringCodec,
            // ...
        } = netcode;
    </script>
</body>
```

## Using the ES6 source code

Configure Webpack to include the source code of _netcode_ so that Babel will compile this ES6 code as well.

```javascript
module.exports = {
    //...
    module: {
        rules: [{
            // ...
            include: '/node_modules/netcode/src/',
        }]
    }
};
```

_See a [full Webpack/Babel config example](doc/webpack.config.js)._

Now you can import source file from _netcode_ directly in your sources and it will be compiled as well:

```javascript
// src/server.js
import Server from 'netcode/src/server/Server';
import BinaryEncoder from 'netcode/src/encoder/BinaryEncoder';
import { BooleanCodec } from 'netcode/src/encoder/codec';

new Server(
    8080,
    'localhost',
    new BinaryEncoder([
        ['foo', new BooleanEncoder()]
    ])
);
```

```javascript
// src/client.js
import Client from 'netcode/src/client/Client';
import BinaryEncoder from 'netcode/src/encoder/BinaryEncoder';
import { BooleanCodec } from 'netcode/src/encoder/codec';

new Client(
    'ws://localhost:8080',
    new BinaryEncoder([
        ['foo', new BooleanCodec()]
    ])
);
```
