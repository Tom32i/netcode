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
    <script src="netcode.umd.cjs"></script>
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

Or with module:

```html
<body>
    <script type="module">
        import {
            Client,
            BinaryEncoder,
            UInt16Codec,
            BooleanCodec,
            StringCodec,
            // ...
        } from 'netcode/client';
    </script>
</body>
```
