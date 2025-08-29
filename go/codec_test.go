package netcode

import (
	"bytes"
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

	want = 255
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(uint8)

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

	want = 127
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(int8)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}

	want = -128
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(int8)

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

	want = 127
	codec.Encode(&buffer, want)
	got = codec.Decode(&buffer).(uint64)

	if got != want {
		t.Fatalf(`Encode/Decode(%v) got %v, want %v`, want, got, want)
	}

	want = 18446744073709551615
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
