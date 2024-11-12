namespace picobricks {
    let result = 0;

    export enum PicoBricksSetRelay {
        Low = 0,
        High = 1
    }

     /**
     * Read light sensor value (Integer)
     */
    //% blockId=picoBricksLdrRead
    //% block="light sensor value"
    //% subcategory="Others"
    export function ldrRead(): number {
        return pins.analogReadPin(AnalogPin.P0);
    }

    /**
     * Read the button state (1-0)
     */
    //% blockId=picoBricksButtonRead
    //% block="button state"
    //% subcategory="Others"
    export function buttonRead(): number {
        return pins.digitalReadPin(DigitalPin.P2);
    }

    /**
     * Relay on or off
     */
    //% blockId=picoBricksRelay
    //% block="set relay to %PicoBricksSetRelay"
    //% subcategory="Others"
    export function relay(state: PicoBricksSetRelay): void {
        pins.digitalWritePin(DigitalPin.P16, state)
    }

    /**
     * Read potentiometer value (Integer)
     */
    //% blockId=picoBricksPotRead
    //% block="pot value"
    //% subcategory="Others"
    export function potRead(): number {
        return pins.analogReadPin(AnalogPin.P1);
    }

    /**
     * Read motion sensor value (1-0)
     */
    //% blockId=picoBricksPirRead
    //% block="motion sensor state"
    //% subcategory="Others"
    export function pirRead(): number {
        return pins.digitalReadPin(DigitalPin.P13);
    }

    /**
     * Read ultrasonic distance sensor (HC-SR04) value (Integer) on selected trig and echo pin 
     * @param pin1 the pin number where trig pin is connected, eg: DigitalPin.P2
     * @param pin2 the pin number where echo pin is connected, eg: DigitalPin.P1
     */
    //% blockId=picoBricksHcsrRead
    //% block="distance in cm with trig pin at %pin1 and echo pin at %pin2"
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

        if((cm <= 0) || (cm >= 400)){
            return result
        }
        else{
            result = cm;
            return cm
        }
    }

    /**
     * Read soil moisture (Integer) on selected analog pin
     * @param pin describe parameter here, eg: DigitalPin.P2
     */
    //% blockId=picoBricksSoilRead
    //% block="soil moisture with analog pin at %pin1"
    //% subcategory="Others"
    export function soilRead(pin1: AnalogPin): number {
        let analogpin = pin1
        let ADCVal = pins.analogReadPin(analogpin)
        return ADCVal / 1023.0
    }

    /**
     * Read gas sensor value (Integer) on selected analog pin (Integer)
     */
    //% blockId=picoBricksMq2Read
    //% block="gas sensor value with analog pin at %pin1"
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
