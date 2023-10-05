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

    const MOTOR_DRIVER_ADDRESS = 0x22;

    //% blockId="Servomotor" block="Servo Motor %servo_motor_type and angle %angle"
    //% angle.min=0 angle.max=180
    //% subcategory="Motor Driver"
    export function Servomotor(Servo_type: servo_motor_type, angle: number): void {
        MotorBuffer[0] = 0x26;
        MotorBuffer[1] = Servo_type;
        MotorBuffer[2] = 0;
        MotorBuffer[3] = angle;
        MotorBuffer[4] = MotorBuffer[1] ^ MotorBuffer[2] ^ MotorBuffer[3];
        pins.i2cWriteBuffer(MOTOR_DRIVER_ADDRESS, MotorBuffer);
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

}
