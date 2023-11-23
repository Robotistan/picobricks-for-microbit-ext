namespace PicoBricks {
    let result = 0;

    export enum set_relay {
        low = 0,
        high = 1
    }

    //% block="light sensor read"
    //% subcategory="Others"
    export function ldrRead(): number {
        result = pins.analogReadPin(AnalogPin.P0);
        return result;
    }

    //% block="button read"
    //% subcategory="Others"
    export function buttonRead(): number {
        result = pins.digitalReadPin(DigitalPin.P2);
        return result;
    }
    
    //% block="set relay to %set_relay"
    //% subcategory="Others"
    export function relay(state: set_relay): void {
        pins.digitalWritePin(DigitalPin.P16, state)
    }

    //% block="pot read"
    //% subcategory="Others"
    export function potRead(): number {

        result = pins.analogReadPin(AnalogPin.P1);
        return result;
    }

    //% block="motion sensor read"
    //% subcategory="Others"
    export function pirRead(): number {
        result = pins.digitalReadPin(DigitalPin.P13);
        return result;
    }

    //% block="read ultrasonic distance sensor with trig pin at %pin1 and echo pin at %pin2"
    //% subcategory="Others"
    export function hcsrRead(pin1: DigitalPin, pin2: DigitalPin): number {
        let trigpin = pin1
        let echopin = pin2

        pins.setPull(trigpin, PinPullMode.PullNone);
        pins.digitalWritePin(trigpin, 0)
        control.waitMicros(5);
        pins.digitalWritePin(trigpin, 1)
        control.waitMicros(10);
        pins.digitalWritePin(trigpin, 0)

        let duration = pins.pulseIn(echopin, PulseValue.High, 29000)
        let cm = (duration / 2) / 29.1

        return cm
    }

    //% block="read soil sensor with analog pin at %pin1"
    //% subcategory="Others"
    export function soilRead(pin1: AnalogPin): number {
        let analogpin = pin1
        let ADCVal = pins.analogReadPin(analogpin)
        return ADCVal / 1023.0
    }

    //% block="read gas sensor with analog pin at %pin1"
    //% subcategory="Others"
    export function mq2Read(pin1: AnalogPin): number {
        let analogpin = pin1
        let value = pins.analogReadPin(analogpin)
        return value
    }

    function i2cRead(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }  
}
