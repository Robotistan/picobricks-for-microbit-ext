enum NeoPixelColors {
    Red = 0xFF0000,
    Orange = 0xFFA500,
    Yellow = 0xFFFF00,
    Green = 0x00FF00,
    Blue = 0x0000FF,
    Indigo = 0x4b0082,
    Violet = 0x8a2be2,
    Purple = 0xFF00FF,
    White = 0xFFFFFF,
    Black = 0x000000
}
enum neo_pin {
    P1 = 0,
    P2 = 1,
    P3 = 2
}

namespace PicoBricks {
    let neobuf = pins.createBuffer(3);
    //% block="Green All Leds"
    //% subcategory="RGB-WS2812B"
    export function all_green(): void {
        ws2812b.sendBuffer(hex`ff0000 ff0000 ff0000`, DigitalPin.P8)
    }

    //% block="Red All Leds ssssssss"
    //% subcategory="RGB-WS2812B"
    export function all_red(): void {
        ws2812b.sendBuffer(hex`00ff00 00ff00 00ff00`, DigitalPin.P8)
    }

    //% block="Blue All Leds"
    //% subcategory="RGB-WS2812B"
    export function all_blue(): void {
        ws2812b.sendBuffer(hex`0000ff 0000ff 0000ff`, DigitalPin.P8)
    }

    //% block="Rainbow"
    //% subcategory="RGB-WS2812B"
    export function rainbow(): void {
        ws2812b.sendBuffer(hex`ff0000 00ff00 0000ff`, DigitalPin.P8)
    }

    //% block="Clear"
    //% subcategory="RGB-WS2812B"
    export function clear_neo(): void {
        ws2812b.sendBuffer(hex`000000 000000 000000`, DigitalPin.P8)
    }

    //% block="Show color at all pixel %NeoPixelColors"
    //% subcategory="RGB-WS2812B"
    export function FillColor(color: NeoPixelColors): void {
        for (let r = 0; r < 3; r++) {
            neobuf[r * 3] = (color & 0x0000FF);
            neobuf[(r * 3) + 1] = ((color & 0x00FF00) >> 8);
            neobuf[(r * 3) + 2] = ((color & 0xFF0000) >> 10);
        }
        ws2812b.sendBuffer(neobuf, DigitalPin.P8)
    }

    //% block="Show color at %neo_pin to %NeoPixelColors"
    //% subcategory="RGB-WS2812B"
    export function SinglePixel(pixeloffset: neo_pin, color: NeoPixelColors): void {
        neobuf[pixeloffset * 3] = (color & 0x0000FF);
        neobuf[(pixeloffset * 3) + 1] = ((color & 0x00FF00) >> 8);
        neobuf[(pixeloffset * 3) + 2] = ((color & 0xFF0000) >> 10);

        ws2812b.sendBuffer(neobuf, DigitalPin.P8)
    }

}
