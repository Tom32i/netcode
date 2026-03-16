package netcode

import (
	"bytes"
)

type BooleanCodec struct {
}

func (c BooleanCodec) Encode(buffer *bytes.Buffer, data any) {
	if data.(bool) {
		buffer.WriteByte(1)
	} else {
		buffer.WriteByte(0)
	}
}

func (c BooleanCodec) Decode(buffer *bytes.Buffer) any {
	return buffer.Next(1)[0] > 0
}
