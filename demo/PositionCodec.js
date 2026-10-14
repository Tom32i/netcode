import { Codec, UInt8Codec, Int16Codec } from 'netcode/encoder';

/**
 * Custom composite codec: { id, x, y }
 * Sub-codecs are called in order, the cursor keeps track of the position.
 */
export default class PositionCodec extends Codec {
    constructor() {
        super();

        this.idCodec = new UInt8Codec();
        this.coordCodec = new Int16Codec();
    }

    /**
     * {@inheritdoc}
     */
    getByteLength() {
        return this.idCodec.getByteLength() + this.coordCodec.getByteLength() * 2;
    }

    /**
     * {@inheritdoc}
     */
    encode(cursor, { id, x, y }) {
        this.idCodec.encode(cursor, id);
        this.coordCodec.encode(cursor, x);
        this.coordCodec.encode(cursor, y);
    }

    /**
     * {@inheritdoc}
     */
    decode(cursor) {
        const id = this.idCodec.decode(cursor);
        const x = this.coordCodec.decode(cursor);
        const y = this.coordCodec.decode(cursor);

        return { id, x, y };
    }
}
