package netcode

import (
	"bytes"
	"fmt"
)

type BinaryEncoder struct {
	idCodec      Codec
	codecsByName map[string]*RegisteredCodec
	codecsById   map[uint8]*RegisteredCodec
}

type RegisteredCodec struct {
	Id      uint8
	Name    string
	Handler Codec
}

type Codec interface {
	Encode(buffer *bytes.Buffer, data any)
	Decode(buffer *bytes.Buffer) any
}

type Message struct {
	Name string
	Data any
}

func CreateBinaryEncoder(codecs []*RegisteredCodec, idCodec Codec) *BinaryEncoder {
	codecsByName := make(map[string]*RegisteredCodec)
	codecsById := make(map[uint8]*RegisteredCodec)

	for id, codec := range codecs {
		codec.Id = uint8(id)
		codecsById[codec.Id] = codec
		codecsByName[codec.Name] = codec
	}

	return &BinaryEncoder{
		idCodec:      idCodec,
		codecsByName: codecsByName,
		codecsById:   codecsById,
	}
}

func (e BinaryEncoder) Encode(message *Message) ([]byte, error) {
	var buffer bytes.Buffer

	codec, ok := e.codecsByName[message.Name]

	if !ok {
		return buffer.Bytes(), fmt.Errorf(" %w: name \"%s\" could be not found", ErrCodecNotFound, message.Name)
	}

	e.idCodec.Encode(&buffer, codec.Id)
	codec.Handler.Encode(&buffer, message.Data)

	return buffer.Bytes(), nil
}

func (e BinaryEncoder) Decode(data []byte) (message *Message, err error) {
	// A short or corrupt frame makes a codec read past the buffer and panic;
	// turn that into an error so one bad client can't crash the read goroutine.
	defer func() {
		if r := recover(); r != nil {
			message, err = nil, fmt.Errorf("%w: %v", ErrDecodeFailed, r)
		}
	}()

	var buffer = bytes.NewBuffer(data)
	id := e.idCodec.Decode(buffer).(uint8)
	codec, ok := e.codecsById[id]

	if !ok {
		return nil, fmt.Errorf(" %w: id \"%d\" could be not found", ErrCodecNotFound, id)
	}

	return &Message{
		Name: codec.Name,
		Data: codec.Handler.Decode(buffer),
	}, nil
}
