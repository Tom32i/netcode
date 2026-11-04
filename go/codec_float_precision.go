package netcode

import (
	"bytes"
	"math"
	"unsafe"
)

func CreateFloatPrecisionCodec[F float32 | float64, T int8 | int16 | int32 | int64 | uint8 | uint16 | uint32 | uint64](codec Codec, precision int) *FloatPrecisionCodec[F, T] {
	return &FloatPrecisionCodec[F, T]{codec, F(math.Pow10(precision))}
}

type FloatPrecisionCodec[F float32 | float64, T int8 | int16 | int32 | int64 | uint8 | uint16 | uint32 | uint64] struct {
	codec  Codec
	factor F
}

func (c *FloatPrecisionCodec[F, T]) Encode(buffer *bytes.Buffer, data any) {
	// Round instead of truncating (0.29 * 100 = 28.999999999999996).
	c.codec.Encode(buffer, clampToInteger[T](math.Round(float64(c.factor*data.(F)))))
}

func (c *FloatPrecisionCodec[F, T]) Decode(buffer *bytes.Buffer) any {
	value := c.codec.Decode(buffer).(T)
	return F(value) / c.factor
}

// clampToInteger converts value to T, clamped to T's range: converting an out-of-range
// float is implementation-defined in Go (127.6 rounds to 128, which can come out as -128 in an int8).
func clampToInteger[T int8 | int16 | int32 | int64 | uint8 | uint16 | uint32 | uint64](value float64) T {
	var zero T
	bitSize := int(unsafe.Sizeof(zero)) * 8
	signed := ^zero < zero
	minimum, maximum := zero, ^zero
	lowerBound, upperBound := 0.0, math.Ldexp(1, bitSize)

	if signed {
		minimum = T(1) << (bitSize - 1)
		maximum = ^minimum
		lowerBound, upperBound = -math.Ldexp(1, bitSize-1), math.Ldexp(1, bitSize-1)
	}

	// The bounds are powers of two, exact in float64 even for 64-bit types.
	if value < lowerBound {
		return minimum
	}

	if value >= upperBound {
		return maximum
	}

	return T(value)
}
