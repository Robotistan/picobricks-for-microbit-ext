enum dc_motor_type {
    DC1 = 1,
    DC2 = 2
}

enum servo_motor_type {
    Servo1 = 3,
    Servo2 = 4,
    Servo3 = 5,
    Servo4 = 6
}

enum direction_type {
    D0 = 0,
    D1 = 1
}

//% weight=10 color=#067565 block="PicoBricks" icon="\uf135"
namespace PicoBricks {
    const MOTOR_DRIVER_ADDRESS = 0x22;

    /**
     * It brings the selected servo motor to the set angle
     */
    //% blockId="servomotor" block="servo motor %servo_motor_type and angle %angle"
    //% angle.min=0 angle.max=180
    //% subcategory="Motor Driver"
    export function servomotor(Servo_type: servo_motor_type, angle: number): void {
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
    //% block="dc motor %dc_motor_type and speed %speed and direction %direction"
    //% speed.min=0 speed.max=255
    //% subcategory="Motor Driver"
    export function dcmotor(dc_type: dc_motor_type, speed: number, direction: direction_type): void {
        pins.i2cWriteNumber(MOTOR_DRIVER_ADDRESS, 0x26, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(MOTOR_DRIVER_ADDRESS, dc_type, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(MOTOR_DRIVER_ADDRESS, speed, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(MOTOR_DRIVER_ADDRESS, direction, NumberFormat.UInt8BE, false)
        let cs = dc_type ^ speed ^ direction
        pins.i2cWriteNumber(MOTOR_DRIVER_ADDRESS, cs, NumberFormat.UInt8BE, false)
    }

}
