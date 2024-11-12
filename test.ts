//show red color all rgb leds
let strip = picobricks.create(DigitalPin.P8, 3)
basic.forever(function () {
    strip.showColor(picobricks.rgbcolors(PicoBricksRgbColorsList.Red))
})

//read color and scroll on the micro:bit screen
picobricks.initGesture(PicoBricksGestureInitType.Color)
basic.forever(function () {
    basic.showString(picobricks.readColor())
})

//scroll button state on the micro:bit screen (0 or 1)
basic.forever(function () {
    basic.showNumber(picobricks.buttonRead())
})

//set 90 degree angle to servo 1 motor
basic.forever(function () {
    picobricks.servomotor(PicoBricksServoMotorType.Servo1, 90)
})

//play piano
picobricks.touchInit()
basic.forever(function () {
    picobricks.playPiano(PicoBricksVolumeStatus.passive, PicoBricksToneStatus.passive)
})

//draw smile icon on micro:bit when the selected IR controller button is pressed
picobricks.onIrButton(PicoBricksIrButtonList.Number_1, PicoBricksIrButtonAction.Pressed, function () {
    basic.showIcon(IconNames.Heart)
})
picobricks.connectIrReceiver(DigitalPin.P15)

//scroll temperature value on the micro:bit screen 
picobricks.shtcInit()
basic.forever(function () {
    basic.showNumber(picobricks.temperature(PicoBricksTempList.Celsius))
})

//show text on OLED
picobricks.oledinit(60)
basic.forever(function () {
    picobricks.showString(
        0,
        0,
        "Hello!",
        1
    )
})


