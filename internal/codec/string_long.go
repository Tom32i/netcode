package codec

import (
	"bytes"
	"encoding/binary"
)

type StringLongCodec struct {
}

func (c StringLongCodec) encode(buffer *bytes.Buffer, data any) {
	length := len(data.(string))

	b := make([]byte, 2)
	binary.BigEndian.PutUint16(b, uint16(length))
	buffer.Write(b)

	buffer.WriteString(data.(string))
}

func (c StringLongCodec) decode(buffer *bytes.Buffer) any {
	length := binary.BigEndian.Uint16(buffer.Next(2))

	return string(buffer.Next(int(length)))
}
