@namespace
class PicoBricks:
PicoBricks.touch_init()
PicoBricks.servomotor(servo_motor_type.SERVO1, 90)

def on_forever():
    pass
basic.forever(on_forever)
