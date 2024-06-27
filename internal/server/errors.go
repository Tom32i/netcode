package server

type ServerError string

func (err ServerError) Error() string {
	return string(err)
}

const (
	ErrInvalidToken = ServerError("invalid token")
	ErrInternal     = ServerError("internal error")
)
