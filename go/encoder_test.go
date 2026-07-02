package netcode

import (
	"errors"
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
