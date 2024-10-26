package widgets

type Widget interface {
    Draw()
    Update(data interface{})
}
