enum set_relay {
    low = 0,
    high = 1
}

namespace PicoBricks {
    let result = 0;
    let trigpin = 0;
    let echopin = 0;

    //% block="Light Sensor Read"
    //% subcategory="Others"
    export function ldrread(): number {
        result = pins.analogReadPin(AnalogPin.P0);
        return result;
    }

    //% block="Button Read"
    //% subcategory="Others"
    export function buttonread(): number {
        result = pins.digitalReadPin(DigitalPin.P2);
        return result;
    }
    
    //% block="Set Relay To %set_relay"
    //% subcategory="Others"
    export function relay(state: set_relay): void {
        pins.digitalWritePin(DigitalPin.P16, state)
    }

    //% block="Pot Read"
    //% subcategory="Others"
    export function potread(): number {

        result = pins.analogReadPin(AnalogPin.P1);
        return result;
    }

    //% block="Motion Sensor Read"
    //% subcategory="Others"
    export function pirread(): number {
        result = pins.digitalReadPin(DigitalPin.P13);
        return result;
    }

    //% block="Ultrasonic Distance Sensor With Trig Pin At %pin1 And Echo Pin At %pin2"
    //% subcategory="Others"
    export function hcsr_init(pin1: DigitalPin, pin2: DigitalPin): void {
        trigpin = pin1
        echopin = pin2
    }

    //% block="Read Ultrasonic Distance"
    //% subcategory="Others"
    export function hcsr_read(pin1: DigitalPin, pin2: DigitalPin): number {
        pins.digitalWritePin(trigpin, 0)
        control.waitMicros(5);
        pins.digitalWritePin(trigpin, 1)
        control.waitMicros(10);
        pins.digitalWritePin(trigpin, 0)

        let duration = pins.pulseIn(echopin, 1)
        let cm = (duration / 2) / 29.1

        return cm
    }
    
}