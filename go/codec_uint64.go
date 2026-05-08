package netcode

import (
	"bytes"
	"encoding/binary"
)

/*
 *  64 bit unsigned Int codec (0 to 18446744073709551615)
 */
type UInt64Codec struct {
}

func (c UInt64Codec) Encode(buffer *bytes.Buffer, data any) {
	b := make([]byte, 8)
	binary.BigEndian.PutUint64(b, data.(uint64))
	buffer.Write(b)
}

func (c UInt64Codec) Decode(buffer *bytes.Buffer) any {
	return binary.BigEndian.Uint64(buffer.Next(8))
}
