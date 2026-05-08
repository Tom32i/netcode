package netcode

import (
	"bytes"
)

type Int8Codec struct {
}

func (c Int8Codec) Encode(buffer *bytes.Buffer, data any) {
	buffer.WriteByte(byte(data.(int8)))
}

func (c Int8Codec) Decode(buffer *bytes.Buffer) any {
	return int8(buffer.Next(1)[0])
}
