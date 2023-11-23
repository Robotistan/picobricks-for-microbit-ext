PicoBricks.onGesture(GESTURE_TYPE.Left, function () {
    basic.showLeds(`
        . . # . .
        . # . . .
        # # # # #
        . # . . .
        . . # . .
        `)
})
PicoBricks.onGesture(GESTURE_TYPE.Up, function () {
    basic.showLeds(`
        . . # . .
        . # # # .
        # . # . #
        . . # . .
        . . # . .
        `)
})
PicoBricks.onGesture(GESTURE_TYPE.Right, function () {
    basic.showLeds(`
        . . # . .
        . . . # .
        # # # # #
        . . . # .
        . . # . .
        `)
})
PicoBricks.onGesture(GESTURE_TYPE.Down, function () {
    basic.showLeds(`
        . . # . .
        . . # . .
        # . # . #
        . # # # .
        . . # . .
        `)
})
PicoBricks.initOled(128, 64)
PicoBricks.shtcInit()
PicoBricks.initGesture(SENSORINIT.Gesture)
basic.forever(function () {
    PicoBricks.clear()
    basic.pause(5000)
    PicoBricks.writeStringNewLine("Temprature")
    PicoBricks.writeNumNewLine(PicoBricks.temperature())
    PicoBricks.writeStringNewLine("Humidity")
    PicoBricks.writeNumNewLine(PicoBricks.humidity())
    PicoBricks.writeStringNewLine("Light Sensor")
    PicoBricks.writeNumNewLine(PicoBricks.ldrRead())
    basic.pause(5000)
})

