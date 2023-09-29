namespace PicoBricks {
    const SHTC3_DEFAULT_ADDR = 0x70;
    const SHTC3_NORMAL_MEAS_TFIRST_STRETCH1 = 0x7C;
    const SHTC3_NORMAL_MEAS_TFIRST_STRETCH2 = 0xA2;
    const SHTC3_LOWPOW_MEAS_TFIRST_STRETCH1 = 0x64; 
    const SHTC3_LOWPOW_MEAS_TFIRST_STRETCH2 = 0x58;
    const SHTC3_NORMAL_MEAS_HFIRST_STRETCH1 = 0x5C;
    const SHTC3_NORMAL_MEAS_HFIRST_STRETCH2 = 0x24;
    const SHTC3_LOWPOW_MEAS_HFIRST_STRETCH1 = 0x44;
    const SHTC3_LOWPOW_MEAS_HFIRST_STRETCH2 = 0xDE;
    const SHTC3_NORMAL_MEAS_TFIRST1 = 0x78;
    const SHTC3_NORMAL_MEAS_TFIRST2 = 0x66;
    const SHTC3_LOWPOW_MEAS_TFIRST1 = 0x60;
    const SHTC3_LOWPOW_MEAS_TFIRST2 = 0x9C;
    const SHTC3_NORMAL_MEAS_HFIRST1 = 0x58;
    const SHTC3_NORMAL_MEAS_HFIRST2 = 0xE0;
    const SHTC3_LOWPOW_MEAS_HFIRST1 = 0x40;
    const SHTC3_LOWPOW_MEAS_HFIRST2 = 0x1A;
    const SHTC3_READID1 = 0xEF; 
    const SHTC3_READID2 = 0xC8;
    const SHTC3_SOFTRESET1 = 0x80;
    const SHTC3_SOFTRESET2 = 0x5D;
    const SHTC3_SLEEP1 = 0xB0; 
    const SHTC3_SLEEP2 = 0x98;
    const SHTC3_WAKEUP1 = 0x35; 
    const SHTC3_WAKEUP2 = 0x17;

    let read_buf = pins.createBuffer(5);
    let send_buf = pins.createBuffer(2);
    let value = 0;

    //% block="Read Temprature"
    //% subcategory="TempAndHum"
    export function Temprature(): number {
        send_buf[0] = SHTC3_NORMAL_MEAS_TFIRST1
        pins.i2cWriteBuffer(SHTC3_DEFAULT_ADDR, send_buf, true)
        send_buf[0] = SHTC3_NORMAL_MEAS_TFIRST2
        pins.i2cWriteBuffer(SHTC3_DEFAULT_ADDR, send_buf, false)
        basic.pause(13)
        read_buf = pins.i2cReadBuffer(SHTC3_DEFAULT_ADDR, 5, false)
        basic.pause(1)
        value = ((read_buf[0] << 8) | read_buf[1])
        value = ((4375 * value) >> 14) - 4500;
        let temperature = value / 100.0
        return temperature;
    }

    //% block="Read Humidity"
    //% subcategory="TempAndHum"
    export function Humidity(): number {
        send_buf[0] = SHTC3_NORMAL_MEAS_TFIRST1
        pins.i2cWriteBuffer(SHTC3_DEFAULT_ADDR, send_buf, true)
        send_buf[0] = SHTC3_NORMAL_MEAS_TFIRST2
        pins.i2cWriteBuffer(SHTC3_DEFAULT_ADDR, send_buf, false)
        basic.pause(13)
        read_buf = pins.i2cReadBuffer(SHTC3_DEFAULT_ADDR, 5, false)
        basic.pause(1)

        if (read_buf[2] != crc8(read_buf[0], read_buf[1]) ||
            read_buf[5] != crc8(read_buf[3], read_buf[4]))
            return 0;

        value = ((read_buf[3] << 8) | read_buf[4])
        value = ((625 * value) >> 12);
        let humidity = value / 100.0
        return humidity;
    }

    //% block="Read ID"
    //% subcategory="TempAndHum"
    export function read_id(): number {
        let id = 0;
        read_buf = pins.i2cReadBuffer(SHTC3_DEFAULT_ADDR, 3, false)
        id = read_buf[0]
        id <<= 8
        id |= read_buf[1]
        return id;
    }

    //% block="Init"
    //% subcategory="TempAndHum"
    export function shtcinit(): void {
        send_buf[0] = SHTC3_SOFTRESET1
        pins.i2cWriteBuffer(SHTC3_DEFAULT_ADDR, send_buf, true)
        send_buf[0] = SHTC3_SOFTRESET2
        pins.i2cWriteBuffer(SHTC3_DEFAULT_ADDR, send_buf, false)
        basic.pause(100)

        send_buf[0] = SHTC3_WAKEUP1
        pins.i2cWriteBuffer(SHTC3_DEFAULT_ADDR, send_buf, true)
        send_buf[0] = SHTC3_WAKEUP2
        pins.i2cWriteBuffer(SHTC3_DEFAULT_ADDR, send_buf, false)
        basic.pause(1)
    }

    function crc8(data1:number, data2:number): number {
        let x = 0x31;
        let crc = 0xFF;
        let i = 0;
        let j = 0;

        crc ^= data1;
        for (i = 8; i; --i) {
            crc = (crc & 0x80) ? (crc << 1) ^ x : (crc << 1);
        }
        crc ^= data2;
        for (i = 8; i; --i) {
            crc = (crc & 0x80) ? (crc << 1) ^ x : (crc << 1);
        }

        return crc
    }

}
