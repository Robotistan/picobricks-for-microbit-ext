namespace PicoBricks {


}
PicoBricks.init(128, 64)
basic.forever(function () {
    PicoBricks.writeStringNewLine("test")
    basic.pause(1000)
    PicoBricks.clear()
})
