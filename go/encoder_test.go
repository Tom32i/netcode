package netcode

import (
	"errors"
	"strings"
	"testing"
)

func codecEncoder() *BinaryEncoder {
	return CreateBinaryEncoder([]*RegisteredCodec{
		{0, "boolean", &BooleanCodec{}},
		{0, "uint8", &UInt8Codec{}},
	}, UInt8Codec{})
}

// A round-trip must decode back to the original value.
func TestBinaryEncoderRoundTrip(t *testing.T) {
	e := codecEncoder()

	data, err := e.Encode(&Message{Name: "uint8", Data: uint8(42)})
	if err != nil {
		t.Fatalf("encode: %v", err)
	}

	msg, err := e.Decode(data)
	if err != nil {
		t.Fatalf("decode: %v", err)
	}
	if msg.Name != "uint8" || msg.Data.(uint8) != 42 {
		t.Fatalf("got %q/%v, want uint8/42", msg.Name, msg.Data)
	}
}

// A truncated or empty frame must return ErrDecodeFailed, not panic.
func TestBinaryEncoderDecodeTruncated(t *testing.T) {
	e := codecEncoder()

	full, err := e.Encode(&Message{Name: "uint8", Data: uint8(7)})
	if err != nil {
		t.Fatalf("encode: %v", err)
	}

	for _, name := range []string{"empty", "id-only"} {
		var frame []byte
		if name == "id-only" {
			frame = full[:1] // codec id present, payload missing
		}

		msg, err := e.Decode(frame)
		if msg != nil {
			t.Fatalf("%s: expected nil message, got %v", name, msg)
		}
		if !errors.Is(err, ErrDecodeFailed) {
			t.Fatalf("%s: expected ErrDecodeFailed, got %v", name, err)
		}
	}
}

// A string too long for its length prefix must return ErrEncodeFailed, not wrap
// the prefix (the receiver would read the rest of the string as other fields).
func TestBinaryEncoderEncodeStringTooLong(t *testing.T) {
	e := CreateBinaryEncoder([]*RegisteredCodec{
		{0, "string", StringCodec{}},
		{0, "string-long", StringLongCodec{}},
	}, UInt8Codec{})

	for _, c := range []struct {
		name string
		max  int
	}{{"string", 255}, {"string-long", 65535}} {
		if _, err := e.Encode(&Message{Name: c.name, Data: strings.Repeat("a", c.max)}); err != nil {
			t.Fatalf("%s: %d bytes should encode, got %v", c.name, c.max, err)
		}

		data, err := e.Encode(&Message{Name: c.name, Data: strings.Repeat("a", c.max+1)})
		if data != nil || !errors.Is(err, ErrEncodeFailed) {
			t.Fatalf("%s: %d bytes: expected ErrEncodeFailed, got %v / %v", c.name, c.max+1, data, err)
		}
	}

	// Multi-byte: 128 × "é" is 128 chars but 256 bytes.
	if _, err := e.Encode(&Message{Name: "string", Data: strings.Repeat("é", 128)}); !errors.Is(err, ErrEncodeFailed) {
		t.Fatalf("128 × é: expected ErrEncodeFailed, got %v", err)
	}
}
