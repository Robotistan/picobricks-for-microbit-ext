enum servo_motor_type {
    Servo1 = 3,
    Servo2 = 4,
    Servo3 = 5,
    Servo4 = 6
}
enum dc_motor_type {
    DC1 = 1,
    DC2 = 2
}
//% weight=10 color=#067565 block="PicoBricks" icon="\uf135"
namespace PicoBricks {
    let MotorBuffer = pins.createBuffer(5);

    const MOTOR_DRIVER_ADDRESS = 0x11;

    //% blockId="Servomotor" block="Servo Motor %servo_motor_type and angle %angle"
    //% angle.min=0 angle.max=180
    //% subcategory="Motor Driver"
    export function Servomotor(Servo_type: servo_motor_type, angle: number): void {
        pins.i2cWriteNumber(MOTOR_DRIVER_ADDRESS, 0x26, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(MOTOR_DRIVER_ADDRESS, Servo_type, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(MOTOR_DRIVER_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(MOTOR_DRIVER_ADDRESS, angle, NumberFormat.UInt8BE, false)
        let cal = Servo_type ^ angle
        pins.i2cWriteNumber(MOTOR_DRIVER_ADDRESS, cal, NumberFormat.UInt8BE, false)
    }

    //% block="Dc Motor %dc_motor_type and speed %speed"
    //% speed.min=0 speed.max=255
    //% subcategory="Motor Driver"
    export function Dcmotor(dc_type: dc_motor_type, speed: number): void {
        MotorBuffer[0] = 0x26;
        MotorBuffer[1] = dc_type;
        MotorBuffer[2] = speed;
        MotorBuffer[3] = 0;
        MotorBuffer[4] = MotorBuffer[1] ^ MotorBuffer[2] ^ MotorBuffer[3];
        pins.i2cWriteBuffer(MOTOR_DRIVER_ADDRESS, MotorBuffer);
    }

    //% block="Dc Motor Read"
    //% subcategory="Motor Driver"
    export function DcmotorRead(): number {
        let read_buf = pins.createBuffer(4);
        read_buf = pins.i2cReadBuffer(MOTOR_DRIVER_ADDRESS, 4, false)
        return read_buf[1];
    }

}
