package codec

import (
	"bytes"
	"fmt"
	"strconv"
)

type LongUIntCodec struct {
	ByteLength int
}

func (c LongUIntCodec) encode(buffer *bytes.Buffer, data any) {
	format := fmt.Sprintf("%%0%ds", c.ByteLength*8)
	value := strconv.FormatUint(uint64(data.(uint)), 2)
	value = fmt.Sprintf(format, value)

	for i := 0; i < c.ByteLength*8; i = i + 8 {
		x, _ := strconv.ParseUint(value[i:i+8], 2, 8)
		buffer.WriteByte(uint8(x))
	}
}

func (c LongUIntCodec) decode(buffer *bytes.Buffer) any {
	var buf = new(bytes.Buffer)
	parts := buffer.Next(c.ByteLength)

	for _, p := range parts {
		buf.WriteString(fmt.Sprintf("%08s", strconv.FormatUint(uint64(p), 2)))
	}

	value, _ := strconv.ParseUint(buf.String(), 2, 64)

	return value
}
