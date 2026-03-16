package netcode

import (
	"bytes"
	"math"
	"testing"
)

// Test BooleanCodec encode/decode.
func TestBooleanCodec(t *testing.T) {
	var buffer bytes.Buffer
	var want, got bool
	codec := BooleanCodec{}

	want = false
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(bool)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}

	want = true
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(bool)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}
}

// Test Float32Codec encode/decode.
func TestFloat32Codec(t *testing.T) {
	var buffer bytes.Buffer
	var want, got float32
	codec := Float32Codec{}

	want = 0
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(float32)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}

	want = 1.123
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(float32)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}

	want = math.MaxFloat32
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(float32)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}
}

// Test Float64Codec encode/decode.
func TestFloat64Codec(t *testing.T) {
	var buffer bytes.Buffer
	var want, got float64
	codec := Float64Codec{}

	want = 0
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(float64)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}

	want = 1.123
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(float64)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}

	want = -12456789.123456789087654321012345678901
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(float64)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}

	want = math.MaxFloat64
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(float64)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}
}

// Test FloatPrecisionCodec(Int8Codec, 2) encode/decode.
func TestFloatPrecisionCodecInt8(t *testing.T) {
	var buffer bytes.Buffer
	var want, got float32
	codec := CreateFloatPrecisionCodec[float32, int8](Int8Codec{}, 2)

	want = 0
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(float32)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}

	want = 0.99
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(float32)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}

	want = -0.65
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(float32)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}

	want = 0.1
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(float32)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}

	want = 1.27
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(float32)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}

	want = -1.28
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(float32)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}
}

// Test FloatPrecisionCodec(UInt32Codec, 3) encode/decode.
func TestFloatPrecisionCodecUInt32Codec(t *testing.T) {
	var buffer bytes.Buffer
	var want, got float64
	codec := CreateFloatPrecisionCodec[float64, uint32](UInt32Codec{}, 3)

	want = 0
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(float64)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}

	want = 4294967.295
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(float64)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}

	want = 123456.999
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(float64)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}

	want = 5.2
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(float64)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}
}

// Test Int8Codec encode/decode.
func TestInt8Codec(t *testing.T) {
	var buffer bytes.Buffer
	var want, got int8
	codec := Int8Codec{}

	want = 0
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(int8)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}

	want = math.MaxInt8
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(int8)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}

	want = math.MinInt8
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(int8)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}
}

// Test Int16Codec encode/decode.
func TestInt16Codec(t *testing.T) {
	var buffer bytes.Buffer
	var want, got int16
	codec := Int16Codec{}

	want = 0
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(int16)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}

	want = math.MaxInt16
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(int16)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}

	want = math.MinInt16
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(int16)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}
}

// Test Int32Codec encode/decode.
func TestInt32Codec(t *testing.T) {
	var buffer bytes.Buffer
	var want, got int32
	codec := Int32Codec{}

	want = 0
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(int32)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}

	want = math.MaxInt32
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(int32)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}

	want = math.MinInt32
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(int32)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}
}

// Test StringCodec encode/decode.
func TestStringCodec(t *testing.T) {
	var buffer bytes.Buffer
	var want, got string
	codec := StringCodec{}

	want = "Hell0 wœrld$ 🌝 !"
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(string)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}
}

// Test StringLongCodec encode/decode.
func TestStringLongCodec(t *testing.T) {
	var buffer bytes.Buffer
	var want, got string
	codec := StringLongCodec{}

	want = "data:image/jpeg;base64,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"
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(string)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}
}

// Test NullCodec encode/decode.
func TestNullCodec(t *testing.T) {
	var buffer bytes.Buffer
	var want, got any
	codec := NullCodec{}

	want = nil
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}
}

// Test UInt8Codec encode/decode.
func TestUInt8Codec(t *testing.T) {
	var buffer bytes.Buffer
	var want, got uint8
	codec := UInt8Codec{}

	want = 0
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(uint8)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}

	want = math.MaxUint8
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(uint8)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}
}

// Test UInt16Codec encode/decode.
func TestUInt16Codec(t *testing.T) {
	var buffer bytes.Buffer
	var want, got uint16
	codec := UInt16Codec{}

	want = 0
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(uint16)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}

	want = math.MaxUint16
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(uint16)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}
}

// Test UInt32Codec encode/decode.
func TestUInt32Codec(t *testing.T) {
	var buffer bytes.Buffer
	var want, got uint32
	codec := UInt32Codec{}

	want = 0
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(uint32)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}

	want = math.MaxUint32
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(uint32)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}
}

// Test UInt64Codec encode/decode.
func TestUInt64Codec(t *testing.T) {
	var buffer bytes.Buffer
	var want, got uint64
	codec := UInt64Codec{}

	want = 0
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(uint64)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}

	want = math.MaxUint64
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(uint64)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}
}

// Test UIntLongCodec encode/decode.
func TestUIntLongCodec(t *testing.T) {
	var buffer bytes.Buffer
	var want, got uint
	codec := UIntLongCodec{6}

	want = 0
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(uint)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}

	want = 127
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(uint)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}

	want = 281474976710655
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(uint)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}
}
