package netcode

type ServerError string

func (err ServerError) Error() string {
	return string(err)
}

const (
	ErrCodecNotFound = ServerError("codec not found")
	ErrInternal      = ServerError("internal error")
)
