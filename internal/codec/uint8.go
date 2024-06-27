package codec

import (
	"bytes"
)

type UInt8Codec struct {
}

func (c UInt8Codec) encode(buffer *bytes.Buffer, data any) {
	buffer.WriteByte(data.(uint8))
}

func (c UInt8Codec) decode(buffer *bytes.Buffer) any {
	return buffer.Next(1)[0]
}
