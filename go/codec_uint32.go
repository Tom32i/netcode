package netcode

import (
	"bytes"
	"encoding/binary"
)

/**
 *  32 bit unsigned Int codec (from 0 to 4294967295)
 */
type UInt32Codec struct {
}

func (c UInt32Codec) Encode(buffer *bytes.Buffer, data any) {
	b := make([]byte, 4)
	binary.BigEndian.PutUint32(b, data.(uint32))
	buffer.Write(b)
}

func (c UInt32Codec) Decode(buffer *bytes.Buffer) any {
	return binary.BigEndian.Uint32(buffer.Next(4))
}
