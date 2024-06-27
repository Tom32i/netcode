package codec

import (
	"bytes"
)

type BooleanCodec struct {
}

func (c BooleanCodec) encode(buffer *bytes.Buffer, data any) {
	if data.(bool) {
		buffer.WriteByte(1)
	} else {
		buffer.WriteByte(0)
	}
}

func (c BooleanCodec) decode(buffer *bytes.Buffer) any {
	return buffer.Next(1)[0] > 0
}
