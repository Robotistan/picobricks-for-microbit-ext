namespace PicoBricks {


}
PicoBricks.TouchInit()
PicoBricks.init(128, 64)
PicoBricks.shtcinit()
basic.forever(function () {
    PicoBricks.Play()
    PicoBricks.writeNumNewLine(PicoBricks.Temprature())
})
