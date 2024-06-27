package codec

import (
	"bytes"
	"encoding/binary"
)

type UInt32Codec struct {
}

func (c UInt32Codec) encode(buffer *bytes.Buffer, data any) {
	b := make([]byte, 4)
	binary.BigEndian.PutUint32(b, data.(uint32))
	buffer.Write(b)
}

func (c UInt32Codec) decode(buffer *bytes.Buffer) any {
	return binary.BigEndian.Uint32(buffer.Next(4))
}
