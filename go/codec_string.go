package netcode

import (
	"bytes"
	"fmt"
	"math"
)

type StringCodec struct {
}

func (c StringCodec) Encode(buffer *bytes.Buffer, data any) {
	length := len(data.(string))

	// A longer string would wrap the length prefix: the receiver would then
	// read the rest of the string as the following fields.
	if length > math.MaxUint8 {
		panic(fmt.Sprintf("string is %d bytes, StringCodec max is %d: use StringLongCodec", length, math.MaxUint8))
	}

	buffer.WriteByte(uint8(length))
	buffer.WriteString(data.(string))
}

func (c StringCodec) Decode(buffer *bytes.Buffer) any {
	length := int(buffer.Next(1)[0])

	return string(buffer.Next(length))
}
