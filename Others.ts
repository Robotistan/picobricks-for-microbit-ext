enum set_relay {
    low = 0,
    high = 1
}

namespace PicoBricks {
    let result = 0;

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
    
}