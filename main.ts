namespace PicoBricks {


}
PicoBricks.Init(SENSORINIT.Color)
basic.forever(function () {
    serial.writeLine(PicoBricks.ReadColor())
})
