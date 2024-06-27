package codec

import (
	"bytes"
)

type StringCodec struct {
}

func (c StringCodec) encode(buffer *bytes.Buffer, data any) {
	length := len(data.(string))
	buffer.WriteByte(uint8(length))
	buffer.WriteString(data.(string))
}

func (c StringCodec) decode(buffer *bytes.Buffer) any {
	length := int(buffer.Next(1)[0])

	return string(buffer.Next(length))
}
