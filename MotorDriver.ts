enum dcMotorType {
    dc1 = 1,
    dc2 = 2
}

enum servoMotorType {
    servo1 = 3,
    servo2 = 4,
    servo3 = 5,
    servo4 = 6
}

enum directionType {
    forward = 0,
    backward = 1
}

//% weight=10 color=#067565 block="PicoBricks" icon="\uf135"
namespace picobricks {
    const MOTOR_DRIVER_ADDRESS = 0x22;

    /**
     * It brings the selected servo motor to the set angle
     */
    //% blockId=servomotor 
    //% block="servo motor %servoMotorType and angle %angle"
    //% angle.min=0 angle.max=180
    //% subcategory="Motor Driver"
    export function servomotor(Servo_type: servoMotorType, angle: number): void {
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
    //% blockId=dcmotor
    //% block="dc motor %dcMotorType and speed %speed and direction %direction"
    //% speed.min=0 speed.max=100
    //% subcategory="Motor Driver"
    export function dcmotor(dc_type: dcMotorType, speed: number, direction: directionType): void {
        let mspeed = Math.map(speed,0,100,0,255)
        pins.i2cWriteNumber(MOTOR_DRIVER_ADDRESS, 0x26, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(MOTOR_DRIVER_ADDRESS, dc_type, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(MOTOR_DRIVER_ADDRESS, mspeed, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(MOTOR_DRIVER_ADDRESS, direction, NumberFormat.UInt8BE, false)
        let cs = dc_type ^ mspeed ^ direction
        pins.i2cWriteNumber(MOTOR_DRIVER_ADDRESS, cs, NumberFormat.UInt8BE, false)
    }
}
