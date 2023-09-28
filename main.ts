namespace PicoBricks {


}
basic.forever(function () {
    PicoBricks.init(128, 64)
    PicoBricks.writeStringNewLine("merhaba")
    basic.pause(1000)
    PicoBricks.SinglePixel(neo_pin.P2, NeoPixelColors.Green)
})
