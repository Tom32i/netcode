# Note on packaging

Netcode ships two pre-packaged versions of the library — one for _Node_ and one for the _browser_ — so you can use it out of the box.
You can also _import the ES module source code_ directly and manage the packaging yourself with a tool like Vite or webpack.

Let's see an example of both setups:

## Using the pre-packaged libraries

On the server side (Node, ES modules):

```javascript
import {
    Server,
    BinaryEncoder,
    UInt16Codec,
    BooleanCodec,
    StringCodec,
    // ...
} from 'netcode/server';
```

And in the browser:

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

Or with ES modules:

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
