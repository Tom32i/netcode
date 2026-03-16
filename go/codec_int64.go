package netcode

import (
	"bytes"
)

type Int64Codec struct {
}

func (c Int64Codec) Encode(buffer *bytes.Buffer, data any) {
	buffer.WriteByte(byte(data.(int64)))
}

func (c Int64Codec) Decode(buffer *bytes.Buffer) any {
	return int64(buffer.Next(1)[0])
}
