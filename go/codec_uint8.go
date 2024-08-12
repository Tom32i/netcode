package netcode

import (
	"bytes"
)

/*
 *  8 bit unsigned Int codec (0 to 255)
 */
type UInt8Codec struct {
}

func (c UInt8Codec) Encode(buffer *bytes.Buffer, data any) {
	buffer.WriteByte(data.(uint8))
}

func (c UInt8Codec) Decode(buffer *bytes.Buffer) any {
	return buffer.Next(1)[0]
}
