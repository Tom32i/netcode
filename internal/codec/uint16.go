package codec

import (
	"bytes"
	"encoding/binary"
)

type UInt16Codec struct {
}

func (c UInt16Codec) encode(buffer *bytes.Buffer, data any) {
	b := make([]byte, 2)
	binary.BigEndian.PutUint16(b, data.(uint16))
	buffer.Write(b)
}

func (c UInt16Codec) decode(buffer *bytes.Buffer) any {
	return binary.BigEndian.Uint16(buffer.Next(2))
}
