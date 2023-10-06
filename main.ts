namespace PicoBricks {


}
PicoBricks.TouchInit()
PicoBricks.init(128, 64)
PicoBricks.writeStringNewLine("Hello")
PicoBricks.Servomotor(servo_motor_type.Servo1, 90)
basic.forever(function () {
    PicoBricks.Play()
})
