package netcode

import (
	"bytes"
)

type NullCodec struct {
}

func (c NullCodec) Encode(buffer *bytes.Buffer, data any) {
}

func (c NullCodec) Decode(buffer *bytes.Buffer) any {
	return nil
}
