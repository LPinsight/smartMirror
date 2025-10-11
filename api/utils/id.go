package utils

import "github.com/google/uuid"

func NewDisplayID() string {
	return "D-" + uuid.NewString()
}

func NewWidgetID() string {
	return "W-" + uuid.NewString()
}
