enum set_relay {
    low = 0,
    high = 1
}

namespace PicoBricks {
    let result = 0;

    //% block="LDR read"
    //% subcategory="Others"
    export function ldrread(): number {
        result = pins.analogReadPin(AnalogPin.P0);
        return result;
    }

    //% block="Pot read"
    //% subcategory="Others"
    export function potread(): number {

        result = pins.analogReadPin(AnalogPin.P1);
        return result;
    }

    //% block="Button read"
    //% subcategory="Others"
    export function buttonread(): number {
        result = pins.digitalReadPin(DigitalPin.P2);
        return result;
    }

    //% block="Set Relay to %set_relay"
    //% subcategory="Others"
    export function relay(state: set_relay): void {
        pins.digitalWritePin(DigitalPin.P16, state)
    }

    //% block="PIR read"
    //% subcategory="Others"
    export function pirread(): number {
        result = pins.digitalReadPin(DigitalPin.P13);
        return result;
    }

}