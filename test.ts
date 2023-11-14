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
PicoBricks.init(128, 64)
PicoBricks.shtcinit()
PicoBricks.Init(SENSORINIT.Gesture)
basic.forever(function () {
    PicoBricks.clear()
    basic.pause(5000)
    PicoBricks.writeStringNewLine("Temprature")
    PicoBricks.writeNumNewLine(PicoBricks.Temprature())
    PicoBricks.writeStringNewLine("Humidity")
    PicoBricks.writeNumNewLine(PicoBricks.Humidity())
    PicoBricks.writeStringNewLine("Light Sensor")
    PicoBricks.writeNumNewLine(PicoBricks.ldrread())
    basic.pause(5000)
})

