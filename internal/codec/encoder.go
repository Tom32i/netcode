package codec

import (
	"bytes"
)

type BinaryEncoder struct {
	idCodec      Codec
	codecsByName map[string]*RegisteredCodec
	codecsById   map[uint8]*RegisteredCodec
}

type Codec interface {
	encode(buffer *bytes.Buffer, data any)
	decode(buffer *bytes.Buffer) any
}

type RegisteredCodec struct {
	Id      uint8
	Name    string
	Handler Codec
}

type Message struct {
	Name string
	Data any
}

func CreateBinaryEncoder(codecs []*RegisteredCodec, idCodec Codec) *BinaryEncoder {
	codecsByName := make(map[string]*RegisteredCodec)
	codecsById := make(map[uint8]*RegisteredCodec)

	for _, codec := range codecs {
		codecsById[codec.Id] = codec
		codecsByName[codec.Name] = codec
	}

	return &BinaryEncoder{
		idCodec:      idCodec,
		codecsByName: codecsByName,
		codecsById:   codecsById,
	}
}

func (e BinaryEncoder) Encode(message Message) []byte {
	var buffer bytes.Buffer

	codec := e.codecsByName[message.Name]

	e.idCodec.encode(&buffer, codec.Id)
	codec.Handler.encode(&buffer, message.Data)

	return buffer.Bytes()
}

func (e BinaryEncoder) Decode(data []byte) Message {
	var buffer = bytes.NewBuffer(data)
	id := e.idCodec.decode(buffer).(uint8)
	codec := e.codecsById[id]

	return Message{
		Name: codec.Name,
		Data: codec.Handler.decode(buffer),
	}
}
