package netcode

import (
	"bytes"
	"math"
)

func CreateFloatPrecisionCodec[F float32 | float64, T int8 | int16 | int32 | int64 | uint8 | uint16 | uint32 | uint64](codec Codec, precision int) *FloatPrecisionCodec[F, T] {
	return &FloatPrecisionCodec[F, T]{codec, F(math.Pow10(precision))}
}

type FloatPrecisionCodec[F float32 | float64, T int8 | int16 | int32 | int64 | uint8 | uint16 | uint32 | uint64] struct {
	codec  Codec
	factor F
}

func (c *FloatPrecisionCodec[F, T]) Encode(buffer *bytes.Buffer, data any) {
	c.codec.Encode(buffer, T(c.factor*data.(F)))
}

func (c *FloatPrecisionCodec[F, T]) Decode(buffer *bytes.Buffer) any {
	value := c.codec.Decode(buffer).(T)
	return F(value) / c.factor
}
