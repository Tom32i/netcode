package netcode

import (
	"bytes"
	"math"
)

type Float64Codec struct {
	codec UInt64Codec
}

func (c Float64Codec) Encode(buffer *bytes.Buffer, data any) {
	c.codec.Encode(buffer, math.Float64bits(data.(float64)))
}

func (c Float64Codec) Decode(buffer *bytes.Buffer) any {
	return math.Float64frombits(c.codec.Decode(buffer).(uint64))
}
