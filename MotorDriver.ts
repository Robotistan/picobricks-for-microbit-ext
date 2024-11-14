enum PicoBricksDcMotorType {
    //% block=dc1
    Dc1 = 1,
    //% block=dc2
    Dc2 = 2
}

enum PicoBricksServoMotorType {
    //% block=servo1
    Servo1 = 3,
    //% block=servo2
    Servo2 = 4,
    //% block=servo3
    Servo3 = 5,
    //% block=servo4
    Servo4 = 6
}

enum PicoBricksDirectionType {
    //% block=forward
    Forward = 0,
    //% block=backward
    Backward = 1
}

//% weight=10 color=#067565 block="PicoBricks" icon="\uf135"
namespace picobricks {
    const MOTOR_DRIVER_ADDRESS = 0x22;

    /**
     * It brings the selected servo motor to the set angle
     */
    //% blockId=picoBricksServoMotor 
    //% block="servo motor %PicoBricksServoMotorType and angle %angle"
    //% angle.min=0 angle.max=180
    //% subcategory="Motor Driver"
    export function servoMotor(Servo_type: PicoBricksServoMotorType, angle: number): void {
        pins.i2cWriteNumber(MOTOR_DRIVER_ADDRESS, 0x26, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(MOTOR_DRIVER_ADDRESS, Servo_type, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(MOTOR_DRIVER_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(MOTOR_DRIVER_ADDRESS, angle, NumberFormat.UInt8BE, false)
        let cs = Servo_type ^ angle
        pins.i2cWriteNumber(MOTOR_DRIVER_ADDRESS, cs, NumberFormat.UInt8BE, false)
    }

    /**
     * It runs the selected DC motor forward or reverse at the set speed and direction
     */
    //% blockId=picoBricksDcMotor
    //% block="dc motor %PicoBricksDcMotorType and speed %speed and direction %direction"
    //% speed.min=0 speed.max=100
    //% subcategory="Motor Driver"
    export function dcMotor(dc_type: PicoBricksDcMotorType, speed: number, direction: PicoBricksDirectionType): void {
        let mspeed = Math.map(speed,0,100,0,255)
        pins.i2cWriteNumber(MOTOR_DRIVER_ADDRESS, 0x26, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(MOTOR_DRIVER_ADDRESS, dc_type, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(MOTOR_DRIVER_ADDRESS, mspeed, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(MOTOR_DRIVER_ADDRESS, direction, NumberFormat.UInt8BE, false)
        let cs = dc_type ^ mspeed ^ direction
        pins.i2cWriteNumber(MOTOR_DRIVER_ADDRESS, cs, NumberFormat.UInt8BE, false)
    }
}
