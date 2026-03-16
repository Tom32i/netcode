package netcode

import (
	"bytes"
	"encoding/binary"
)

type Int16Codec struct {
}

func (c Int16Codec) Encode(buffer *bytes.Buffer, data any) {
	binary.Write(buffer, binary.BigEndian, data.(int16))
}

func (c Int16Codec) Decode(buffer *bytes.Buffer) any {
	var data int16
	binary.Read(buffer, binary.BigEndian, &data)
	return data
}
