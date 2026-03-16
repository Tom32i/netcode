import { describe, test, expect } from 'vitest';
import {
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
} from 'netcode';

describe('UInt8Codec', () => {
  const codec = new UInt8Codec();
  const buffer = new ArrayBuffer(1 + codec.getByteLength());

  test('Should encode/decode 0', () => {
    codec.encode(buffer, 1, 0);
    expect(codec.decode(buffer, 1)).toBe(0);
  });

  test('Should encode/decode 255', () => {
    codec.encode(buffer, 1, 255);
    expect(codec.decode(buffer, 1)).toBe(255);
  });
});

describe('UInt16Codec', () => {
  const codec = new UInt16Codec();
  const buffer = new ArrayBuffer(1 + codec.getByteLength());

  test('Should encode/decode 0', () => {
    codec.encode(buffer, 1, 0);
    expect(codec.decode(buffer, 1)).toBe(0);
  });

  test('Should encode/decode 65535', () => {
    codec.encode(buffer, 1, 65535);
    expect(codec.decode(buffer, 1)).toBe(65535);
  });
});

describe('UInt32Codec', () => {
  const codec = new UInt32Codec();
  const buffer = new ArrayBuffer(1 + codec.getByteLength());

  test('Should encode/decode 0', () => {
    codec.encode(buffer, 1, 0);
    expect(codec.decode(buffer, 1)).toBe(0);
  });

  test('Should encode/decode 131071', () => {
    codec.encode(buffer, 1, 131071);
    expect(codec.decode(buffer, 1)).toBe(131071);
  });
});

describe('UIntLongCodec', () => {
  const codec = new UIntLongCodec(5);
  const buffer = new ArrayBuffer(1 + codec.getByteLength());

  test('Should encode/decode 623804400001', () => {
    codec.encode(buffer, 1, 623804400001);
    expect(codec.decode(buffer, 1)).toBe(623804400001);
  });
});

describe('BooleanCodec', () => {
  const codec = new BooleanCodec();
  const buffer = new ArrayBuffer(1 + codec.getByteLength());

  test('Should encode/decode true', () => {
    codec.encode(buffer, 1, true);
    expect(codec.decode(buffer, 1)).toBe(true);
  });

  test('Should encode/decode false', () => {
    codec.encode(buffer, 1, false);
    expect(codec.decode(buffer, 1)).toBe(false);
  });
});

describe('StringCodec', () => {
  const codec = new StringCodec();
  const buffer = new ArrayBuffer(1 + codec.getByteLength('Hell0 wœrld$ 🌝 !'));

  test('Should encode/decode "Hell0 wœrld$ 🌝 !"', () => {
    codec.encode(buffer, 1, 'Hell0 wœrld$ 🌝 !');
    expect(codec.decode(buffer, 1)).toBe('Hell0 wœrld$ 🌝 !');
  });
});

describe('StringLongCodec', () => {
  const codec = new StringLongCodec();
  const buffer = new ArrayBuffer(1 + codec.getByteLength('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gKgSUNDX1BST0ZJTEUAAQEAAAKQbGNtcwQwAABtbnRyUkdCIFhZWiAH3gADABUACAAUABVhY3NwQVBQTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWxjbXMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtkZXNjAAABCAAAADhjcHJ0AAABQAAAAE53dHB0AAABkAAAABRjaGFkAAABpAAAACxyWFlaAAAB0AAAABRiWFlaAAAB5AAAABRnWFlaAAAB+AAAABRyVFJDAAACDAAAACBnVFJDAAACLAAAACBiVFJDAAACTAAAACBjaHJtAAACbAAAACRtbHVjAAAAAAAAAAEAAAAMZW5VUwAAABwAAAAcAHMAUgBHAEIAIABiAHUAaQBsAHQALQBpAG4AAG1sdWMAAAAAAAAAAQAAAAxlblVTAAAAMgAAABwATgBvACAAYwBvAHAAeQByAGkAZwBoAHQALAAgAHUAcwBlACAAZgByAGUAZQBsAHkAAAAAWFlaIAAAAAAAAPbWAAEAAAAA0y1zZjMyAAAAAAABDEoAAAXj///zKgAAB5sAAP2H///7ov///aMAAAPYAADAlFhZWiAAAAAAAABvlAAAOO4AAAOQWFlaIAAAAAAAACSdAAAPgwAAtr5YWVogAAAAAAAAYqUAALeQAAAY3nBhcmEAAAAAAAMAAAACZmYAAPKnAAANWQAAE9AAAApbcGFyYQAAAAAAAwAAAAJmZgAA8qcAAA1ZAAAT0AAACltwYXJhAAAAAAADAAAAAmZmAADypwAADVkAABPQAAAKW2Nocm0AAAAAAAMAAAAAo9cAAFR7AABMzQAAmZoAACZmAAAPXP/bAEMABQMEBAQDBQQEBAUFBQYHDAgHBwcHDwsLCQwRDxISEQ8RERMWHBcTFBoVEREYIRgaHR0fHx8TFyIkIh4kHB4fHv/bAEMBBQUFBwYHDggIDh4UERQeHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHv/AABEIAEkASQMBIgACEQEDEQH/xAAcAAACAgMBAQAAAAAAAAAAAAAFBgQHAAEDCAL/xABCEAABAwIFAQQECAwHAAAAAAABAgMEBREABhIhMUEHFFFhEyKBkRUjJDJUcXLRFjRCUnOSk6GxsrPBJTM2YoLC4f/EABsBAAICAwEAAAAAAAAAAAAAAAQFAwYAAQIH/8QALREAAgEDAgQDCAMAAAAAAAAAAQIRAAMhBBIFMUFxIlFhBhMUMoGRwdGh4fD/2gAMAwEAAhEDEQA/APMlMb+QziOjQ/jgclu3Q4YKTHPwbUzbhpP8cClNEC9tsNtuK5ByaiFBO1sd4CNUxoW4OD1Dybmitx+8UqgzpbPR1LelB+pSrA+zEeNR6nGzAKU/AfaqAOgR1ossqPAt53wMuqsNcKBwSOYkSO46VIbbhZIMGgjydTy1eKjiVQ5CoNRbeudN7K+rFxUrshy/TW4qM4Zj9DUJdvRxWHUt7k2sCQSrfa9gL9cJ3a1kdrJtajR4ktx+NLaU4yHra0lJspJI2PI8OcKNJ7S6DVakae0xkzBggGOcHrRd3huot2t7DHfIoDnCnhiYmW0PiXxcEcXwES2Lc4dKU2a1lZ2IsEvx/mE8+X3YUdCkqKSCCDY4sRXrS5GPLyrUOOXZLbQ/KUBhn/w/xTgRR2ygSJZGzLZt9o7DEP1/zjjaiK0V3Gnem0wt02p+ktpUhKQfbiLlxqkQsxRptchuzqZHVrXHbIBdI4Bv0vyMM9OdL8CoofbAKdIFhbrgYmmS5UpEWJFXKdWqyENIKlKPkBjrUWFeyysYBBkzEDv0712jw8iraypmfOWas2Q1UWhJp+UUkFTj7AAU0BY2XxfwSnYe/FadtGbhH7W2qzlpTK3aZGTGLy29aFuAr1bHkAKsD4g+WH/Jc7tTgT6PluLTPRwYi0svMvQbJQ1quoqcPkTwffjr2t5TpOcO3Ki5ciSGorgp7j9VLaQVlCVAoTtwspJ3PAI8seNJascO4mQ6rs2NG0z4fNvMsKtHvjesiDmR9/6pH7NKTVe0jNv4U1pxXcoa0GQ4pOhK1I3S2jpYWufAYAdtNYdzpnR1VHbXJg02OpDSmxfUlJu479km3sA8cenK9kukryk1liLOVRKU2kIdaiFKVuI/NKjcgE7qNiVe+9LZnyjEomZtOTHVMR/g92O7IddK3C6oiygLcADoMb4VxG1qNWb+2IEIIgKPU+Z9JgYqZrLtb2DPn60iCazQc7vR0xS1TnSlLdgd0lIuRfne+PvMmWAqqGXDWFRn/XBHQ9cbz9ST6Nt1NRaMphR+JVcXCrGyTwCLcG2x2x3pMuTMy56WOrRNicpUNlDwIx6ZwrWb7IVsxVf1um93dJrhIoAj0dDQG769Z+ocYHfAH1+7BprNUSqpShTCo8lpGlTR3G3JB8Ma7+nwVh7a23F3DlQbKEMUeltIbaqZaULXQdvM3w19jLBcrkebFzCzBqKCUIjIj+kW8g8pIJAIPlc4S59RpzNWNLXIU04tsIcB+aF+rpuff78OGQKUqn5qaYqDBKJLK2T8YUJKXE6TcpsobHkWOEfHNWl3h18I0Qp6AyI8jIijNLo3W8Nwme+KvmZXW47LaHHNC3ZCYyRaxU6pQRbpbcjx9uFBMqh0HMUCIugop82sd7LbzSEOuvFlOtRLlzqStNyDc72FsSKu7S8q5NqCoVEqYh0lLkttz4OWY7DiTqDgW6sFQCgDdIJ8MD6VV6lF7IaHmWDlxjMMyenWYkB5MeLDSq5V4defMnHi9m0ltNyDwsdvRcwSJzAjBz2mngfMfsmlOpZir06nsVWNHcjwplNDzbbjQQ+3J7zbQUncfEg36dRzhQqqa3OzCy8XI4g6F95ZdcAWolRKCEp4tZNjfcXvjO2KqVqXX6ectsyG3HR8oZaUpTTZ2sSrgb6t+oHGJMhfyLu0qTokrY0uSmQlFlf7b7+fGLPpbey2t0ADdOOoHr+D9aNUSShnEdqqDNEJ2JWX1GrszpalEyNAKSlR5G+x9nGJuRKyI1YTHlps296ir8YFZhoztMlqQmUxMQSSFtrGr/knkH92Brby0KBJuUm4vyMXfTtCqwM/xVbvDxMpEU2ZlgLoeaA82EmM+eTwEk74n/I/psb9oMdKtIYr2R0zEKJlRB6+3GEbTJ8GP2qfvwxTWfDkquQc0KLO8ScUyUytVSmSVSEKXpBKyDxexNwem9sWHAz7SEtImTqwx35CwAh1ze2298V6mCxUaLFe7u88VKS4tvWUpXYnbjyta+FsTIcYehVR4rhQ5yVqSSNZOk28ja+EBtreDLHPB/006+IuacCcjmJr0RJ7ScgSkuO1GfAmKcuVNyXX30gnolJukDythbqvabCkR/g6mViDCgAnRGYCWkC/WwH9sUuJ0f0lzSWCglJKA6rcC+1+d7jjwx9d+gXSVUGMUghRBfc32G178ffgJeC2VAHiIHIEiB9K2nFCuQi/YzVoIluTySioIfSd/Ue1fuGIMuTDZeZadkEKeXoRZN7nzxW7U+Ay6lbdGZTpVc2fWCdx1HkCPbjq3XQh9DvcUEtkFILqjYi/jvzY/WPA2wUuh28vx+6w8U3DlTXnKM38k0lCVKWpJWs2A2vhSUtC9lW9v34nVPNaKg22iTR2CEEn1Xl8n+3liLIqcU6HI0JmMFXsFXI5PU822HswVYV0UKwoPUXUuOWFGcuJtSZ7IUVNup0rSFX20qPHTcDfC93WX9He/UOHfLyFnKcirmUFqb1H0aGxpsNtJ69cDPwklfRmP1f/AHEdq4xd9onNE3rKC1b3mMSO1DabmOZAp/cmQlxtKtSfSN7p62BvxgS6S5JKiPnLufffEfqcdD+Mp+1gpUVZIHOgGuM4AY8qmIY9W4HQ/wBO+OcpvTcWtt/1T9+JrP8Aln7K/wChiNU/yvsn+VvGA5rCuJoSeT9eMFzfwxrxxgxJUNZg1l2LFmSmW5aC4hLajpva/rYC9MHcrfjbf6JX8wxxc+U1JZ+cTT1IMdnKc2PGaQ02GlWSgWGK/wDSeYw7TP8ATkz9GcIOBdGoXd3o/XuW2dq//9kgICAgICAgICAgICAgICAgIA=='));

  test('Should encode/decode a long string', () => {
    codec.encode(buffer, 1, 'data:image/jpeg;base64,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');
    expect(codec.decode(buffer, 1)).toBe('data:image/jpeg;base64,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');
  });
});

describe('Int8Codec', () => {
  const codec = new Int8Codec();
  const buffer = new ArrayBuffer(1 + codec.getByteLength());

  test('Should encode/decode 0', () => {
    codec.encode(buffer, 1, 0);
    expect(codec.decode(buffer, 1)).toBe(0);
  });

  test('Should encode/decode -128', () => {
    codec.encode(buffer, 1, -128);
    expect(codec.decode(buffer, 1)).toBe(-128);
  });

  test('Should encode/decode 127', () => {
    codec.encode(buffer, 1, 127);
    expect(codec.decode(buffer, 1)).toBe(127);
  });
});

describe('Int16Codec', () => {
  const codec = new Int16Codec();
  const buffer = new ArrayBuffer(1 + codec.getByteLength());

  test('Should encode/decode 0', () => {
    codec.encode(buffer, 1, 0);
    expect(codec.decode(buffer, 1)).toBe(0);
  });

  test('Should encode/decode -32768', () => {
    codec.encode(buffer, 1, -32768);
    expect(codec.decode(buffer, 1)).toBe(-32768);
  });

  test('Should encode/decode 32767', () => {
    codec.encode(buffer, 1, 32767);
    expect(codec.decode(buffer, 1)).toBe(32767);
  });
});

describe('Int32Codec', () => {
  const codec = new Int32Codec();
  const buffer = new ArrayBuffer(1 + codec.getByteLength());

  test('Should encode/decode 0', () => {
    codec.encode(buffer, 1, 0);
    expect(codec.decode(buffer, 1)).toBe(0);
  });

  test('Should encode/decode -2147483648', () => {
    codec.encode(buffer, 1, -2147483648);
    expect(codec.decode(buffer, 1)).toBe(-2147483648);
  });

  test('Should encode/decode 2147483647', () => {
    codec.encode(buffer, 1, 2147483647);
    expect(codec.decode(buffer, 1)).toBe(2147483647);
  });
});

describe('Float64Codec', () => {
  const codec = new Float64Codec();
  const buffer = new ArrayBuffer(1 + codec.getByteLength());

  test('Should encode/decode 0', () => {
    codec.encode(buffer, 1, 0);
    expect(codec.decode(buffer, 1)).toBe(0);
  });

  test('Should encode/decode 1.123', () => {
    codec.encode(buffer, 1, 1.123);
    expect(codec.decode(buffer, 1)).toBe(1.123);
  });

  test('Should encode/decode -12456789.123456789087654321012345678901', () => {
    codec.encode(buffer, 1, -12456789.123456789087654321012345678901);
    expect(codec.decode(buffer, 1)).toBe(-12456789.123456789087654321012345678901);
  });
});

describe('FloatPrecisionCodec(Int8Codec, 2)', () => {
  const codec = new FloatPrecisionCodec(Int8Codec, 2);
  const buffer = new ArrayBuffer(1 + codec.getByteLength());

  test('Should encode/decode 0', () => {
    codec.encode(buffer, 1, 0);
    expect(codec.decode(buffer, 1)).toBe(0);
  });

  test('Should encode/decode 0.99', () => {
    codec.encode(buffer, 1, 0.99);
    expect(codec.decode(buffer, 1)).toBe(0.99);
  });

  test('Should encode/decode -0.65', () => {
    codec.encode(buffer, 1, -0.65);
    expect(codec.decode(buffer, 1)).toBe(-0.65);
  });

  test('Should encode/decode 0.1', () => {
    codec.encode(buffer, 1, 0.1);
    expect(codec.decode(buffer, 1)).toBe(0.1);
  });

  test('Should encode/decode 1.27', () => {
    codec.encode(buffer, 1, 1.27);
    expect(codec.decode(buffer, 1)).toBe(1.27);
  });

  test('Should encode/decode -1.28', () => {
    codec.encode(buffer, 1, -1.28);
    expect(codec.decode(buffer, 1)).toBe(-1.28);
  });
});

describe('FloatPrecisionCodec(UInt32Codec, 3)', () => {
  const codec = new FloatPrecisionCodec(UInt32Codec, 3);
  const buffer = new ArrayBuffer(1 + codec.getByteLength());

  test('Should encode/decode 0', () => {
    codec.encode(buffer, 1, 0);
    expect(codec.decode(buffer, 1)).toBe(0);
  });

  test('Should encode/decode 4294967.295', () => {
    codec.encode(buffer, 1, 4294967.295);
    expect(codec.decode(buffer, 1)).toBe(4294967.295);
  });

  test('Should encode/decode 123456.999', () => {
    codec.encode(buffer, 1, 123456.999);
    expect(codec.decode(buffer, 1)).toBe(123456.999);
  });

  test('Should encode/decode 5.2', () => {
    codec.encode(buffer, 1, 5.2);
    expect(codec.decode(buffer, 1)).toBe(5.2);
  });
});
