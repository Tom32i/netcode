package netcode

import (
	"bytes"
	"math"
)

type Float32Codec struct {
	codec UInt32Codec
}

func (c Float32Codec) Encode(buffer *bytes.Buffer, data any) {
	c.codec.Encode(buffer, math.Float32bits(data.(float32)))
}

func (c Float32Codec) Decode(buffer *bytes.Buffer) any {
	return math.Float32frombits(c.codec.Decode(buffer).(uint32))
}
