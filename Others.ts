namespace PicoBricks {
    const RFID_ADDR = 0x6B
    const RFID_VERSION = 0x00
    const RFID_READCMD = 0x01
    const RFID_READOUT = 0x02
    const RFID_WRITE = 0x03
    const RFID_STOP = 0x04
    const RFID_STATUS = 0x05
    const RFID_UUID = 0x06

    let result = 0;

    export enum set_relay {
        low = 0,
        high = 1
    }

    export enum RfidSector {
        S1 = 1,
        S2 = 2,
        S3 = 3,
        S4 = 4,
        S5 = 5,
        S6 = 6,
        S7 = 7,
        S8 = 8,
        S9 = 9,
        S10 = 10,
        S11 = 11,
        S12 = 12,
        S13 = 13,
        S14 = 14,
        S15 = 15
    }

    export enum RfidBlock {
        B0 = 0,
        B1 = 1,
        B2 = 2
    }

    enum RfidStat {
        IDLE = 0,
        SELECTED = 1,
        READ_PENDING = 2,
        READ_SUCC = 3,
        WRITE_SUCC = 4
    }

    //% block="Light Sensor Read"
    //% subcategory="Others"
    export function ldrRead(): number {
        result = pins.analogReadPin(AnalogPin.P0);
        return result;
    }

    //% block="Button Read"
    //% subcategory="Others"
    export function buttonRead(): number {
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
    export function potRead(): number {

        result = pins.analogReadPin(AnalogPin.P1);
        return result;
    }

    //% block="Motion Sensor Read"
    //% subcategory="Others"
    export function pirRead(): number {
        result = pins.digitalReadPin(DigitalPin.P13);
        return result;
    }

    //% block="Read Ultrasonic Distance Sensor With Trig Pin At %pin1 And Echo Pin At %pin2"
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

    //% block="Read Soil Sensor With Analog Pin At %pin1"
    //% subcategory="Others"
    export function soilRead(pin1: AnalogPin): number {
        let analogpin = pin1
        let ADCVal = pins.analogReadPin(analogpin)
        return ADCVal / 1023.0
    }

    //% block="Read Gas Sensor With Analog Pin At %pin1"
    //% subcategory="Others"
    export function mq2Read(pin1: AnalogPin): number {
        let analogpin = pin1
        let value = pins.analogReadPin(analogpin)
        return value
    }

    //% block="RFID UUID"
    //% subcategory="Others"
    export function rfidUUID(): string {
        pins.i2cWriteNumber(RFID_ADDR, RFID_UUID, NumberFormat.UInt8BE);
        let uuid = pins.i2cReadBuffer(RFID_ADDR, 4)
        let uuidReverse = pins.createBuffer(4)
        // reverse byte order to micropython type~
        uuidReverse[0] = uuid[3]
        uuidReverse[1] = uuid[2]
        uuidReverse[2] = uuid[1]
        uuidReverse[3] = uuid[0]
        return uuidReverse.toHex();
    }

    //% block="RFID Write sector|%sector block|%block text|%txt"
    //% subcategory="Others"
    export function rfidWrite(sector: RfidSector, block: RfidBlock, txt: string): void {
        let buf = pins.createBuffer(19)
        buf[0] = RFID_WRITE
        buf[1] = sector
        buf[2] = block
        let len = txt.length
        if (len > 16) len = 16
        for (let i = 0; i < len; i++) {
            buf[3 + i] = txt.charCodeAt(i)
        }
        pins.i2cWriteBuffer(RFID_ADDR, buf)
        basic.pause(100)
    }

    //% block="RFID Read sector|%sector block|%block"
    //% subcategory="Others"
    export function rfidRead(sector: RfidSector, block: RfidBlock): string {
        let retry: number = 5;
        let buf = pins.createBuffer(3)
        buf[0] = RFID_READCMD
        buf[1] = sector
        buf[2] = block
        pins.i2cWriteBuffer(RFID_ADDR, buf)

        while (retry) {
            basic.pause(100);
            let stat = i2cread(RFID_ADDR, RFID_STATUS);
            if (stat == RfidStat.READ_SUCC) {
                let ret = '';
                pins.i2cWriteNumber(RFID_ADDR, RFID_READOUT, NumberFormat.UInt8BE);
                let rxbuf = pins.i2cReadBuffer(RFID_ADDR, 16)
                for (let i = 0; i < 16; i++) {
                    if (rxbuf[i] >= 0x20 && rxbuf[i] < 0x7f) {
                        ret += String.fromCharCode(rxbuf[i]) // valid ascii
                    }
                }
                return ret;
            }
            retry--;
        }
        return '';
    }

    function i2cRead(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }  
}
