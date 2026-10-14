package netcode

import (
	"bytes"
	"encoding/binary"
	"fmt"
	"math"
)

type StringLongCodec struct {
}

func (c StringLongCodec) Encode(buffer *bytes.Buffer, data any) {
	length := len(data.(string))

	// A longer string would wrap the length prefix: the receiver would then
	// read the rest of the string as the following fields.
	if length > math.MaxUint16 {
		panic(fmt.Sprintf("string is %d bytes, StringLongCodec max is %d", length, math.MaxUint16))
	}

	b := make([]byte, 2)
	binary.BigEndian.PutUint16(b, uint16(length))
	buffer.Write(b)

	buffer.WriteString(data.(string))
}

func (c StringLongCodec) Decode(buffer *bytes.Buffer) any {
	length := binary.BigEndian.Uint16(buffer.Next(2))

	return string(buffer.Next(int(length)))
}
