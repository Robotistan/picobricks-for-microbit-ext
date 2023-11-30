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
    basic.pause(5000)
})

