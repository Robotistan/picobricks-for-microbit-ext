namespace PicoBricks {


}
PicoBricks.TouchInit()
PicoBricks.init(128, 64)
PicoBricks.shtcinit()
PicoBricks.connectIrReceiver(DigitalPin.P14, IrProtocol.NEC)
basic.forever(function () {
    PicoBricks.Play()
})
