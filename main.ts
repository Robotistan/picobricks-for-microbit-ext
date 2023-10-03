namespace PicoBricks {


}
PicoBricks.Init(SENSORINIT.Color)
basic.forever(function () {
    basic.showString("" + (PicoBricks.ReadRedColor()))
    basic.pause(500)
})
