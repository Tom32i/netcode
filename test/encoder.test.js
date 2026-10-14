import { describe, test, expect } from 'vitest';
import {
  BinaryEncoder,
  Codec,
  Cursor,
  BooleanCodec,
  Float64Codec,
  FloatPrecisionCodec,
  Int16Codec,
  Int32Codec,
  Int8Codec,
  NullCodec,
  StringCodec,
  StringLongCodec,
  UInt16Codec,
  UInt32Codec,
  UInt8Codec,
  UIntLongCodec,
} from '../src/encoder/index.js';
import Float32Codec from '../src/encoder/codec/Float32Codec.js';
import { utf8ByteLength } from '../src/encoder/utf8.js';

/**
 * Encode the value after a one-byte prefix, check the cursor advanced by exactly
 * getByteLength(value), then decode it back from a fresh cursor.
 */
function roundTrip(codec, value) {
  const buffer = new ArrayBuffer(1 + codec.getByteLength(value));
  const writer = new Cursor(buffer);

  writer.writeUint8(42);
  codec.encode(writer, value);
  expect(writer.offset).toBe(buffer.byteLength);

  const reader = new Cursor(buffer);

  expect(reader.readUint8()).toBe(42);
  const decoded = codec.decode(reader);
  expect(reader.offset).toBe(buffer.byteLength);

  return decoded;
}


describe('BooleanCodec', () => {
  const codec = new BooleanCodec();

  test('Should encode/decode true', () => {
    expect(roundTrip(codec, true)).toBe(true);
  });

  test('Should encode/decode false', () => {
    expect(roundTrip(codec, false)).toBe(false);
  });
});

describe('Float32Codec', () => {
  const codec = new Float32Codec();

  test('Should encode/decode 0', () => {
    expect(roundTrip(codec, 0)).toBe(0);
  });

  test('Should encode/decode 84.2', () => {
    expect(roundTrip(codec, 84.2)).toBe(84.19999694824219);
  });

  test('Should encode/decode 1.123', () => {
    // Known float32 javascript bug
    expect(roundTrip(codec, 1.123)).toBe(1.1230000257492065);
  });
});

describe('Float64Codec', () => {
  const codec = new Float64Codec();

  test('Should encode/decode 0', () => {
    expect(roundTrip(codec, 0)).toBe(0);
  });

  test('Should encode/decode 1.123', () => {
    expect(roundTrip(codec, 1.123)).toBe(1.123);
  });

  test('Should encode/decode -12456789.123456789087654321012345678901', () => {
    expect(roundTrip(codec, -12456789.123456789087654321012345678901)).toBe(-12456789.123456789087654321012345678901);
  });
});

describe('FloatPrecisionCodec(Int8Codec, 2)', () => {
  const codec = new FloatPrecisionCodec(Int8Codec, 2);

  test('Should encode/decode 0', () => {
    expect(roundTrip(codec, 0)).toBe(0);
  });

  test('Should encode/decode 0.99', () => {
    expect(roundTrip(codec, 0.99)).toBe(0.99);
  });

  test('Should encode/decode -0.65', () => {
    expect(roundTrip(codec, -0.65)).toBe(-0.65);
  });

  test('Should encode/decode 0.1', () => {
    expect(roundTrip(codec, 0.1)).toBe(0.1);
  });

  test('Should encode/decode 1.27', () => {
    expect(roundTrip(codec, 1.27)).toBe(1.27);
  });

  test('Should encode/decode -1.28', () => {
    expect(roundTrip(codec, -1.28)).toBe(-1.28);
  });
});

describe('FloatPrecisionCodec(UInt32Codec, 3)', () => {
  const codec = new FloatPrecisionCodec(UInt32Codec, 3);

  test('Should encode/decode 0', () => {
    expect(roundTrip(codec, 0)).toBe(0);
  });

  test('Should encode/decode 4294967.295', () => {
    expect(roundTrip(codec, 4294967.295)).toBe(4294967.295);
  });

  test('Should encode/decode 123456.999', () => {
    expect(roundTrip(codec, 123456.999)).toBe(123456.999);
  });

  test('Should encode/decode 5.2', () => {
    expect(roundTrip(codec, 5.2)).toBe(5.2);
  });
});

describe('Int8Codec', () => {
  const codec = new Int8Codec();

  test('Should encode/decode 0', () => {
    expect(roundTrip(codec, 0)).toBe(0);
  });

  test('Should encode/decode -128', () => {
    expect(roundTrip(codec, -128)).toBe(-128);
  });

  test('Should encode/decode 127', () => {
    expect(roundTrip(codec, 127)).toBe(127);
  });
});

describe('Int16Codec', () => {
  const codec = new Int16Codec();

  test('Should encode/decode 0', () => {
    expect(roundTrip(codec, 0)).toBe(0);
  });

  test('Should encode/decode -32768', () => {
    expect(roundTrip(codec, -32768)).toBe(-32768);
  });

  test('Should encode/decode 32767', () => {
    expect(roundTrip(codec, 32767)).toBe(32767);
  });
});

describe('Int32Codec', () => {
  const codec = new Int32Codec();

  test('Should encode/decode 0', () => {
    expect(roundTrip(codec, 0)).toBe(0);
  });

  test('Should encode/decode -2147483648', () => {
    expect(roundTrip(codec, -2147483648)).toBe(-2147483648);
  });

  test('Should encode/decode 2147483647', () => {
    expect(roundTrip(codec, 2147483647)).toBe(2147483647);
  });
});

describe('StringCodec', () => {
  const codec = new StringCodec();

  test('Should encode/decode "Hell0 wœrld$ 🌝 !"', () => {
    expect(roundTrip(codec, 'Hell0 wœrld$ 🌝 !')).toBe('Hell0 wœrld$ 🌝 !');
  });
});

describe('StringLongCodec', () => {
  const codec = new StringLongCodec();

  test('Should encode/decode a long string', () => {
    expect(roundTrip(codec, 'data:image/jpeg;base64,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')).toBe('data:image/jpeg;base64,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');
  });
});

describe('NullCodec', () => {
  const codec = new NullCodec();

  test('Should encode/decode a null value', () => {
    expect(roundTrip(codec, null)).toBe(null);
  });
});

describe('UInt8Codec', () => {
  const codec = new UInt8Codec();

  test('Should encode/decode 0', () => {
    expect(roundTrip(codec, 0)).toBe(0);
  });

  test('Should encode/decode 255', () => {
    expect(roundTrip(codec, 255)).toBe(255);
  });
});

describe('UInt16Codec', () => {
  const codec = new UInt16Codec();

  test('Should encode/decode 0', () => {
    expect(roundTrip(codec, 0)).toBe(0);
  });

  test('Should encode/decode 65535', () => {
    expect(roundTrip(codec, 65535)).toBe(65535);
  });
});

describe('UInt32Codec', () => {
  const codec = new UInt32Codec();

  test('Should encode/decode 0', () => {
    expect(roundTrip(codec, 0)).toBe(0);
  });

  test('Should encode/decode 131071', () => {
    expect(roundTrip(codec, 131071)).toBe(131071);
  });
});

describe('UIntLongCodec(5)', () => {
  const codec = new UIntLongCodec(5);

  test('Should encode/decode 623804400001', () => {
    expect(roundTrip(codec, 623804400001)).toBe(623804400001);
  });
});

describe('UIntLongCodec(6)', () => {
  const codec = new UIntLongCodec(6);

  test('Should encode/decode 281474976710655', () => {
    expect(roundTrip(codec, 281474976710655)).toBe(281474976710655);
  });
});

/**
 * Composite codec: sub-codecs are called in order, the cursor tracks the position.
 */
class PositionCodec extends Codec {
  constructor() {
    super();

    this.idCodec = new UInt8Codec();
    this.coordCodec = new Int16Codec();
    this.nameCodec = new StringCodec();
  }

  getByteLength({ name }) {
    return this.idCodec.getByteLength() + this.coordCodec.getByteLength() * 2 + this.nameCodec.getByteLength(name);
  }

  encode(cursor, { id, x, y, name }) {
    this.idCodec.encode(cursor, id);
    this.coordCodec.encode(cursor, x);
    this.coordCodec.encode(cursor, y);
    this.nameCodec.encode(cursor, name);
  }

  decode(cursor) {
    return {
      id: this.idCodec.decode(cursor),
      x: this.coordCodec.decode(cursor),
      y: this.coordCodec.decode(cursor),
      name: this.nameCodec.decode(cursor),
    };
  }
}

describe('Composite codec', () => {
  const codec = new PositionCodec();

  test('Should encode/decode sub-codecs in sequence', () => {
    const position = { id: 7, x: -1234, y: 5678, name: 'Hell0 wœrld$ 🌝 !' };

    expect(roundTrip(codec, position)).toEqual(position);
  });
});

describe('BinaryEncoder', () => {
  const encoder = new BinaryEncoder([
    ['pause', new NullCodec()],
    ['id', new UInt8Codec()],
    ['say', new StringCodec()],
    ['timestamp', new UIntLongCodec(6)],
    ['position', new PositionCodec()],
  ]);

  test.each([
    ['pause', null],
    ['id', 255],
    ['say', 'Hell0 wœrld$ 🌝 !'],
    ['timestamp', 281474976710655],
    ['position', { id: 7, x: -1234, y: 5678, name: 'DarkShadow73' }],
  ])('Should encode/decode a "%s" event', (name, data) => {
    expect(encoder.decode(encoder.encode(name, data))).toEqual({ name, data });
  });

  test('Should encode/decode interleaved messages', () => {
    const first = encoder.encode('say', 'first');
    const second = encoder.encode('position', { id: 1, x: 2, y: 3, name: 'second' });

    expect(encoder.decode(second)).toEqual({ name: 'position', data: { id: 1, x: 2, y: 3, name: 'second' } });
    expect(encoder.decode(first)).toEqual({ name: 'say', data: 'first' });
  });
});

describe('BinaryEncoder nested calls', () => {
  // A codec that embeds another event, encoded by the same encoder
  class EnvelopeCodec extends Codec {
    getByteLength(data) {
      return 2 + encoder.encode('say', data).byteLength;
    }

    encode(cursor, data) {
      const inner = new Uint8Array(encoder.encode('say', data));

      cursor.writeUint16(inner.length);
      cursor.writeBytes(inner);
    }

    decode(cursor) {
      const inner = cursor.readBytes(cursor.readUint16());

      return encoder.decode(inner.slice().buffer).data;
    }
  }

  const encoder = new BinaryEncoder([
    ['say', new StringCodec()],
    ['envelope', new EnvelopeCodec()],
  ]);

  test('Should not corrupt the outer message', () => {
    expect(encoder.decode(encoder.encode('envelope', 'nested'))).toEqual({ name: 'envelope', data: 'nested' });
  });
});

describe('utf8ByteLength', () => {
  const textEncoder = new TextEncoder();

  test.each([
    ['empty', ''],
    ['short ASCII', 'DarkShadow73'],
    ['long ASCII', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'],
    ['2-byte chars', 'wœrld éàü ß'],
    ['3-byte chars', '日本語のテキスト €'],
    ['surrogate pairs', '🌝🎮👾 emoji'],
    ['long mixed', 'Lorem ipsum 🌝 dolor sit amet, wœrld, 日本語 '.repeat(4)],
    ['lone high surrogate', 'a\uD83Db'],
    ['lone low surrogate', 'a\uDE1Db'],
    ['trailing high surrogate', 'abc\uD83D'],
  ])('Should match TextEncoder for %s', (_, string) => {
    expect(utf8ByteLength(string)).toBe(textEncoder.encode(string).length);
  });
});

describe('StringCodec edge cases', () => {
  const codec = new StringCodec();

  test('Should encode/decode an empty string', () => {
    expect(roundTrip(codec, '')).toBe('');
  });

  test('Should encode null as an empty string', () => {
    expect(roundTrip(codec, null)).toBe('');
  });

  test('Should encode/decode a lone surrogate as U+FFFD', () => {
    expect(roundTrip(codec, 'a\uD83Db')).toBe('a\uFFFDb');
  });
});

describe('UIntLongCodec edge cases', () => {
  const codec = new UIntLongCodec(6);

  test.each([0, 1, 255, 256, 65535, 65536, 2 ** 40, 2 ** 48 - 1])('Should encode/decode %s', value => {
    expect(roundTrip(codec, value)).toBe(value);
  });

  test('Should write big-endian bytes', () => {
    const buffer = new ArrayBuffer(6);

    codec.encode(new Cursor(buffer), 0x010203040506);
    expect(Array.from(new Uint8Array(buffer))).toEqual([1, 2, 3, 4, 5, 6]);
  });

  test('Should throw when the value does not fit', () => {
    expect(() => codec.encode(new Cursor(new ArrayBuffer(6)), 2 ** 48)).toThrow(RangeError);
  });
});

describe('String length limits', () => {
  // A longer string would wrap the length prefix: the receiver would then read
  // the rest of the string as the following fields.
  test.each([
    ['StringCodec', new StringCodec(), 255],
    ['StringLongCodec', new StringLongCodec(), 65535],
  ])('%s should accept %s bytes and throw above', (_, codec, max) => {
    expect(roundTrip(codec, 'a'.repeat(max))).toBe('a'.repeat(max));
    expect(() => codec.getByteLength('a'.repeat(max + 1))).toThrow(RangeError);
  });

  test('Should count bytes, not chars', () => {
    // 128 × "é" is 128 chars but 256 bytes
    expect(() => new StringCodec().getByteLength('é'.repeat(128))).toThrow(RangeError);
  });

  test('encode should throw too when called without getByteLength', () => {
    expect(() => new StringCodec().encode(new Cursor(new ArrayBuffer(400)), 'a'.repeat(300))).toThrow(RangeError);
  });

  test('BinaryEncoder should throw instead of sending a forged message', () => {
    const encoder = new BinaryEncoder([['position', new PositionCodec()]]);
    // name wraps to 44 bytes, the remaining 256 would be read as id, x, y…
    const name = 'a'.repeat(44) + '\x07'.repeat(256);

    expect(() => encoder.encode('position', { id: 1, x: 2, y: 3, name })).toThrow(RangeError);
  });
});

describe('FloatPrecisionCodec rounding', () => {
  // 0.29 * 100 is 28.999999999999996 in floating point, which truncates to 28.
  // Halves round away from zero, like the Go codec.
  const codec = new FloatPrecisionCodec(Int8Codec, 2);

  test.each([
    [0.29, 0.29], [0.57, 0.57], [-0.29, -0.29], [-0.57, -0.57],
    [0.125, 0.13], [-0.125, -0.13], [1.27, 1.27], [-1.28, -1.28],
  ])('Should encode/decode %s as %s', (value, expected) => {
    expect(roundTrip(codec, value)).toBe(expected);
  });
});
