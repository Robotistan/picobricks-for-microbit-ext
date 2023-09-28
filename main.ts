//% icon="\uf26c"
//% color="255" weight="90"
namespace PicoBricks {
    //% block="test123"
    //% subcategory="OTHERS"
    export function test123(): number {
        let result = pins.analogReadPin(AnalogPin.P0);
        return result;
    }

    //% block="Pot read"
    //% subcategory="OTHERS"
    export function potread(): number {
        let result2 = pins.analogReadPin(AnalogPin.P1);
        return result2;
    }
}
basic.forever(function () {
    basic.showIcon(IconNames.Heart)
})
