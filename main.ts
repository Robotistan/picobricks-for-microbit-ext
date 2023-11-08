PicoBricks.onGesture(GESTURE_TYPE.Left, function () {
    basic.showIcon(IconNames.Happy)
})
PicoBricks.onGesture(GESTURE_TYPE.Right, function () {
    basic.showIcon(IconNames.Sad)
})
PicoBricks.onGesture(GESTURE_TYPE.None, function () {
    basic.showIcon(IconNames.Heart)
    basic.pause(500)
    basic.showLeds(`
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        `)
})
namespace PicoBricks {


}
PicoBricks.Init(SENSORINIT.Gesture)
basic.forever(function () {
	
})
