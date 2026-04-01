package netcode

import (
	"bytes"
	"encoding/binary"
)

/**
 *  16 bit unsigned Int codec (from 0 to 65535)
 */
type UInt16Codec struct {
}

func (c UInt16Codec) Encode(buffer *bytes.Buffer, data any) {
	b := make([]byte, 2)
	binary.BigEndian.PutUint16(b, data.(uint16))
	buffer.Write(b)
}

func (c UInt16Codec) Decode(buffer *bytes.Buffer) any {
	return binary.BigEndian.Uint16(buffer.Next(2))
}
