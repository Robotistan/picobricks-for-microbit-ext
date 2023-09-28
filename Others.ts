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

    //% block="set digital pin %x to %set_relay"
    //% subcategory="Others"
    export function relay(x: number, state: set_relay): boolean {
        return (state == set_relay.high);
    }

    //% block="PIR read"
    //% subcategory="Others"
    export function pirread(): number {
        result = pins.digitalReadPin(DigitalPin.P13);
        return result;
    }

}