namespace PicoBricks {


}
let strip = PicoBricks.create(DigitalPin.P8, 3, NeoPixelMode.RGB)
strip.clear()
basic.forever(function () {
    strip.setPixelColor(0, PicoBricks.colors(NeoPixelColors.Red))
    strip.setPixelColor(1, PicoBricks.colors(NeoPixelColors.Green))
    strip.setPixelColor(2, PicoBricks.colors(NeoPixelColors.Blue))
    strip.setBrightness(10)
    strip.show()
})
