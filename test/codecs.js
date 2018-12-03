const assert = require('assert');
const {
    Int8Codec,
    Int16Codec,
    Int32Codec,
    BooleanCodec,
    LongIntCodec,
    StringCodec,
    LongStringCodec,
} = require('../server');

describe('Int8Codec', () => {
  const codec = new Int8Codec();
  const buffer = new ArrayBuffer(1 + codec.getByteLength());

  it('Should encode/decode 0', () => {
    codec.encode(buffer, 1, 0);
    assert.equal(codec.decode(buffer, 1), 0);
  });

  it('Should encode/decode 255', () => {
    codec.encode(buffer, 1, 255);
    assert.equal(codec.decode(buffer, 1), 255);
  });
});

describe('Int16Codec', () => {
  const codec = new Int16Codec();
  const buffer = new ArrayBuffer(1 + codec.getByteLength());

  it('Should encode/decode 0', () => {
    codec.encode(buffer, 1, 0);
    assert.equal(codec.decode(buffer, 1), 0);
  });

  it('Should encode/decode 65535', () => {
    codec.encode(buffer, 1, 65535);
    assert.equal(codec.decode(buffer, 1), 65535);
  });
});

describe('Int32Codec', () => {
  const codec = new Int32Codec();
  const buffer = new ArrayBuffer(1 + codec.getByteLength());

  it('Should encode/decode 0', () => {
    codec.encode(buffer, 1, 0);
    assert.equal(codec.decode(buffer, 1), 0);
  });

  it('Should encode/decode 131071', () => {
    codec.encode(buffer, 1, 131071);
    assert.equal(codec.decode(buffer, 1), 131071);
  });
});

describe('LongIntCodec', () => {
  const codec = new LongIntCodec(5);
  const buffer = new ArrayBuffer(1 + codec.getByteLength());

  it('Should encode/decode 623804400001', () => {
    codec.encode(buffer, 1, 623804400001);
    assert.equal(codec.decode(buffer, 1), 623804400001);
  });
});

describe('BooleanCodec', () => {
  const codec = new BooleanCodec();
  const buffer = new ArrayBuffer(1 + codec.getByteLength());

  it('Should encode/decode true', () => {
    codec.encode(buffer, 1, true);
    assert.equal(codec.decode(buffer, 1), true);
  });

  it('Should encode/decode false', () => {
    codec.encode(buffer, 1, false);
    assert.equal(codec.decode(buffer, 1), false);
  });
});

describe('StringCodec', () => {
  const codec = new StringCodec();
  const buffer = new ArrayBuffer(1 + codec.getByteLength('Hell0 wœrld$ 🌝 !'));

  it('Should encode/decode "Hell0 wœrld$ 🌝 !"', () => {
    codec.encode(buffer, 1, 'Hell0 wœrld$ 🌝 !');
    assert.equal(codec.decode(buffer, 1), 'Hell0 wœrld$ 🌝 !');
  });
});

describe('LongStringCodec', () => {
  const codec = new LongStringCodec();
  const buffer = new ArrayBuffer(1 + codec.getByteLength('data:image/jpeg;base64,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'));

  it('Should encode/decode a long string', () => {
    codec.encode(buffer, 1, 'data:image/jpeg;base64,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');
    assert.equal(codec.decode(buffer, 1), 'data:image/jpeg;base64,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');
  });
});
