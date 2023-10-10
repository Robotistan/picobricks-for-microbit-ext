namespace PicoBricks {


}
PicoBricks.TouchInit()
PicoBricks.Servomotor(servo_motor_type.Servo1, 45)
basic.forever(function () {
    PicoBricks.Play()
})
