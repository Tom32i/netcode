package netcode

import (
	"bytes"
	"encoding/binary"
)

type Int32Codec struct {
}

func (c Int32Codec) Encode(buffer *bytes.Buffer, data any) {
	binary.Write(buffer, binary.BigEndian, data.(int32))
}

func (c Int32Codec) Decode(buffer *bytes.Buffer) any {
	var data int32
	binary.Read(buffer, binary.BigEndian, &data)
	return data
}
