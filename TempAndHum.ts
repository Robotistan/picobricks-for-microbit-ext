enum PicoBricksTempList {
    Celsius = 1,
    Fahrenheit = 2
}

namespace picobricks {
    const SHTC3_DEFAULT_ADDR = 0x70;
    const SHTC3_NORMAL_MEAS_TFIRST_STRETCH = 0x7CA2;
    const SHTC3_LOWPOW_MEAS_TFIRST_STRETCH = 0x6458; 
    const SHTC3_NORMAL_MEAS_HFIRST_STRETCH = 0x5C24;
    const SHTC3_LOWPOW_MEAS_HFIRST_STRETCH = 0x44DE;
    const SHTC3_NORMAL_MEAS_TFIRST = 0x7866;
    const SHTC3_LOWPOW_MEAS_TFIRST = 0x609C;
    const SHTC3_NORMAL_MEAS_HFIRST = 0x58E0;
    const SHTC3_LOWPOW_MEAS_HFIRST = 0x401A;
    const SHTC3_READID = 0xEFC8; 
    const SHTC3_SOFTRESET = 0x805D;
    const SHTC3_SLEEP = 0xB098; 
    const SHTC3_WAKEUP = 0x3517; 

    let read_buf = pins.createBuffer(5);
    let val = 0;

    function i2cread16(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt16BE);
        let rval = pins.i2cReadNumber(addr, NumberFormat.UInt16BE);
        return rval;
    }

    /**
     * Get temperature from SHTC-3 temperature and humidity sensor.
     */
    //% blockId=picoBricksTemperature
    //% block="temperature value %PicoBricksTempList"
    //% subcategory="Temp & Hum"
    export function temperature(tempType: PicoBricksTempList): number {
        pins.i2cWriteNumber(SHTC3_DEFAULT_ADDR, SHTC3_NORMAL_MEAS_TFIRST, NumberFormat.UInt16BE, false)
        basic.pause(13)
        read_buf = pins.i2cReadBuffer(SHTC3_DEFAULT_ADDR, 2, false)
        basic.pause(1)
        val = ((read_buf[0] << 8) | read_buf[1])
        val = ((4375 * val) >> 14) - 4500;
        let temperature = val / 100.0
        
        if (tempType == 1)
            return temperature
        else
            return (temperature * 9) / 5 + 32;
    }

    /**
     * Get humidity percentage from SHTC-3 temperature and humidity sensor.
     */
    //% blockId=picoBricksHumidity
    //% block="humidity value"
    //% subcategory="Temp & Hum"
    export function humidity(): number {
        pins.i2cWriteNumber(SHTC3_DEFAULT_ADDR, SHTC3_NORMAL_MEAS_TFIRST, NumberFormat.UInt16BE, false)
        basic.pause(13)
        read_buf = pins.i2cReadBuffer(SHTC3_DEFAULT_ADDR, 5, false)
        basic.pause(1)

        val = ((read_buf[3] << 8) | read_buf[4])
        val = ((625 * val) >> 12);
        let humidity = val / 100.0

        return humidity;
    }

    /**
     * Read ID of the SHTC-3 temperature and humidity sensor.
     */
    //% blockId=picoBricksReadShtcId
    //% block="temperature & humidity id"
    //% subcategory="Temp & Hum"
    export function readShtcId(): number {
        let read_value = i2cread16(SHTC3_DEFAULT_ADDR, SHTC3_READID)
        return read_value
    }
    
    /**
     * Initialize SHTC-3 temperature and humidity sensor.
     */
    //% blockId=picoBricksShtcInit
    //% block="initialize temperature & humidity sensor"
    //% subcategory="Temp & Hum"
    export function shtcInit(): void {
        pins.i2cWriteNumber(SHTC3_DEFAULT_ADDR, SHTC3_SOFTRESET, NumberFormat.UInt16BE, false)
        basic.pause(100)

        pins.i2cWriteNumber(SHTC3_DEFAULT_ADDR, SHTC3_WAKEUP, NumberFormat.UInt16BE, false)
        basic.pause(1)
    }
}
