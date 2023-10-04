namespace PicoBricks {
    const CHIP_ADDRESS = 0x37;
    const PROX_STAT = 0xAE;
    const CTRL_CMD = 0x86;
    const BUTTON_STATUS	= 0xAA;
    const SAVE_CHECK_CRC = 0x02;
    const SW_RESET = 0xFF;

    const CY8CMBR3xxx_CONFIG_DATA_LENGTH = 126;
    const CY8CMBR3xxx_CRC_BIT4_MASK = 0x0F;
    const CY8CMBR3xxx_CRC_BIT4_SHIFT = 0x04;
    const CY8CMBR3xxx_CCITT16_DEFAULT_SEED = 0xffff;
    const CY8CMBR3xxx_CCITT16_POLYNOM = 0x1021;
    const CY8CMBR3xxx_CRC_BIT_WIDTH = 32;

    const noteDuration = 0;

    let rec_buf = pins.createBuffer(3);
    let buff = pins.createBuffer(3);

    function configureMB(): void {
        // OFFSET
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false) 
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        // ENABLE SENSORS
        pins.i2cWriteNumber(CHIP_ADDRESS, 0xFF, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x7F, NumberFormat.UInt8BE, false)
        // SENSITIVITY
        pins.i2cWriteNumber(CHIP_ADDRESS, 0xFE, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x7F, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        // FINGER THRESHOLDS 27
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x0E, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x84, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x84, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x84, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x84, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x84, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x84, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x84, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x84, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x84, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x84, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x84, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x84, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x84, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x84, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x84, NumberFormat.UInt8BE, false)
        // Debounce 
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x03, NumberFormat.UInt8BE, false)
        // HYSTERESIS 
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        // LBR
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        // RESERVED
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        // NEGATIVE NOISE TH
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        // NOISE TH
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        // PROX_EN  38 
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x01, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x81, NumberFormat.UInt8BE, false)
        // PROX CFG1-2
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x06, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        // PS0 TH
        pins.i2cWriteNumber(CHIP_ADDRESS, 0xFF, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0xF0, NumberFormat.UInt8BE, false)
        // PS1 TH
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x02, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        // PROX_RESOLUTION0-1
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        // PROX HYS
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        // RESERVED
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        // PROX LBR
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        // PROX NNT
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        // PROX NT
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        // PROX POS TH 0 -1
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        // RESERVED
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        // PROX NEGATIVE TH0 -1
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        // RESERVED
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        // 61
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        // BUZZER
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        // BUZZER ONT 
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        //63
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0xFF, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0xFF, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0xFF, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0xFF, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0xFF, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0xFF, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0xFF, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0xFF, NumberFormat.UInt8BE, false)
        // RESERVED
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        // SPO CFG, NExt time might be 0x20
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        // D_CFG0
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x03, NumberFormat.UInt8BE, false)
        // D_CFG1
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x01, NumberFormat.UInt8BE, false)
        // DEVICE CFG 3 
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x58, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        // 81 I2C address
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x37, NumberFormat.UInt8BE, false)
        // REFRSH CTRL
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x06, NumberFormat.UInt8BE, false)
        // RESERVED
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        // STT TIMEOUT
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x0A, NumberFormat.UInt8BE, false)
        // RESERVED
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        // SLIDERS 115
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        // RESERVED
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        // SCRATCHPAD0-1 123
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        // RESERVED
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x00, NumberFormat.UInt8BE, false)
        //CRC
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x87, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, 0x04, NumberFormat.UInt8BE, false)
        ///////////////////////////////////////////////
        pins.i2cWriteNumber(CHIP_ADDRESS, CTRL_CMD, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, SAVE_CHECK_CRC, NumberFormat.UInt8BE, false)
        ///////////////////////////////////////////////
        pins.i2cWriteNumber(CHIP_ADDRESS, CTRL_CMD, NumberFormat.UInt8BE, false)
        pins.i2cWriteNumber(CHIP_ADDRESS, SW_RESET, NumberFormat.UInt8BE, false)
    }

    function ReadSensorStatus(): void {
        let prox = 0;
        let proximityCounter = 0;
        let proximityStatus = 0;
        let val = 0;

        pins.i2cWriteNumber(CHIP_ADDRESS, PROX_STAT, NumberFormat.UInt8BE)
        val = pins.i2cReadNumber(CHIP_ADDRESS, NumberFormat.UInt8BE)

        pins.i2cWriteNumber(CHIP_ADDRESS, BUTTON_STATUS, NumberFormat.UInt8BE)
        buff = pins.i2cReadBuffer(CHIP_ADDRESS, 2, false)

        rec_buf[0] = val
        rec_buf[1] = buff[0]
        rec_buf[2] = buff[1]
        ////////////////////DisplaySensorStatus
        if ((rec_buf[0] & 0x01) != 0){
            if (++proximityCounter > 30) {
                proximityStatus = 1
                proximityCounter = 0
            }
        }
        else{
            proximityCounter = 0;
            proximityStatus = 0;
        }

        if ((rec_buf[1] & 0x02) != 0) {
            // A button
        }
        if ((rec_buf[1] & 0x04) != 0) {
            // B button
        }
        if ((rec_buf[1] & 0x80) != 0) {
            // left button
        }
        if ((rec_buf[1] & 0x40) != 0) {
            // down button
        }
        if ((rec_buf[1] & 0x20) != 0) {
            // right button
        }
        if ((rec_buf[1] & 0x10) != 0) {
            // top button
        }

        if ((rec_buf[1] & 0x08) != 0) {
            music.playTone(262, 500)
        }
        if ((rec_buf[2] & 0x40) != 0) {
            music.playTone(294, noteDuration)
        }
        if ((rec_buf[2] & 0x20) != 0) {
            music.playTone(330, noteDuration)
        }
        if ((rec_buf[2] & 0x10) != 0) {
            music.playTone(349, noteDuration)
        }
        if ((rec_buf[2] & 0x08) != 0) {
            music.playTone(392, noteDuration)
        }
        if ((rec_buf[2] & 0x04) != 0) {
            music.playTone(440, noteDuration)
        }
        if ((rec_buf[2] & 0x02) != 0) {
            music.playTone(494, noteDuration)
        }
        if ((rec_buf[2] & 0x01) != 0) {
            music.playTone(523, noteDuration)
        }
        if (((rec_buf[2] & 0x08) == 0) && ((rec_buf[2] & 0xFF) == 0)) {
            music.playTone(0, noteDuration)
        }
    }

    //% blockId="TouchInit" block="Touch Sensor Init"
    //% subcategory="Touch Sensor-Piano"
    export function TouchInit(): void {
        configureMB()
        
    }
    //% blockId="PlayPiano" block="Play piano"
    //% subcategory="Touch Sensor-Piano"
    export function Play(): void {
        ReadSensorStatus()
    }


}