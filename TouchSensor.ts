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

    const configData = [
        0xFF, 0x7F, // ENABLE SENSORS
        0xFE, 0x7F, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, // SENSITIVITY
        0x0E, 0x84, 0x84, 0x84, 0x84, 0x84, 0x84, 0x84, 0x84, 0x84, 0x84, 0x84, 0x84, 0x84, 0x84, 0x84, // FINGER THRESHOLDS 27
        0x03, // Debounce  
        0x00, // HYSTERESIS  
        0x00,
        0x00, // LBR
        0x00, 0x00, 0x00, 0x00, // RESERVED
        0x00, // NEGATIVE NOISE TH
        0x00, // NOISE TH
        0x01, // PROX_EN  38 
        0x81, 0x06,  // PROX CFG1-2
        0x00,
        0x00, 0xFF, // PS0 TH
        0xF0, 0x02,  // PS1 TH
        0x00, 0x00, // PROX_RESOLUTION0-1
        0x00, // PROX HYS
        0x00,  // RESERVED
        0x00,  // PROX LBR
        0x00, // PROX NNT
        0x00, // PROX NT
        0x00, 0x00, // PROX POS TH 0 -1
        0x00, 0x00, // RESERVED
        0x00, 0x00,// PROX NEGATIVE TH0 -1
        0x00, 0x00,// RESERVED
        0x00,  // 61
        0x00, // BUZZER
        0x00, // BUZZER ONT //63
        0x00, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF,
        0x00, 0x00, 0x00, // RESERVED
        0x00, // SPO CFG, NExt time might be 0x20
        0x03,  // D_CFG0
        0x01, // D_CFG1
        0x58,
        0x00, // DEVICE CFG 3 
        0x37, // 81 I2C address
        0x06, // REFRSH CTRL
        0x00, 0x00,  // RESERVED
        0x0A, // STT TIMEOUT
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // RESERVED
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // SLIDERS 115
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // RESERVED
        0x00, 0x00, // SCRATCHPAD0-1 123
        0x00, 0x00, // RESERVED
        0x87, 0x04
    ];

    let rec_buf = pins.createBuffer(3);
    let send_buf = pins.createBuffer(31);


    function CY8CMBR3xxx_CalculateCrc(configuration: any[]): number {
        let messageIndex;
        let byteValue;
        let seed = CY8CMBR3xxx_CCITT16_DEFAULT_SEED;

        for (messageIndex = 0; messageIndex < CY8CMBR3xxx_CONFIG_DATA_LENGTH; messageIndex++) {
            byteValue = configuration[messageIndex];
            seed = CY8CMBR3xxx_Calc4BitsCRC(byteValue >> CY8CMBR3xxx_CRC_BIT4_SHIFT, seed);
            seed = CY8CMBR3xxx_Calc4BitsCRC(byteValue, seed);
        }

        return seed;
    }

    function CY8CMBR3xxx_Calc4BitsCRC(value: number, remainder:number): number {
        let tableIndex;

        /* Divide the value by polynomial, via the CRC polynomial */
        tableIndex = (value & CY8CMBR3xxx_CRC_BIT4_MASK) ^
            ((remainder) >> (CY8CMBR3xxx_CRC_BIT_WIDTH - CY8CMBR3xxx_CRC_BIT4_SHIFT));
        remainder = (CY8CMBR3xxx_CCITT16_POLYNOM * tableIndex) ^ (remainder << CY8CMBR3xxx_CRC_BIT4_SHIFT);
        return remainder;
    }

    function configureMB(): void {
        let i = 0;
        let crc16 = 0;
        //let crc16 = CY8CMBR3xxx_CalculateCrc(& configData[0]);
        configData[126] = (crc16 & 0x00FF)
        configData[127] = ((crc16 >> 8) & 0x00FF)
        send_buf[0] = 0    // sends Offset byte
        pins.i2cWriteBuffer(CHIP_ADDRESS, send_buf, true)
        send_buf[0] = 0
        pins.i2cWriteBuffer(CHIP_ADDRESS, send_buf, false)
        send_buf[0] = 0    // sends Offset byte
        pins.i2cWriteBuffer(CHIP_ADDRESS, send_buf, true)
        send_buf[0] = 0
        pins.i2cWriteBuffer(CHIP_ADDRESS, send_buf, false)
        /////////////////////////////////////////part 1
        send_buf[0] = 0    // sends Offset byte
        pins.i2cWriteBuffer(CHIP_ADDRESS, send_buf, true)
        for(i=0;i<30;i++){
            send_buf[i] = configData[i]
        }
        pins.i2cWriteBuffer(CHIP_ADDRESS, send_buf, true)
        send_buf[0] = configData[31]
        pins.i2cWriteBuffer(CHIP_ADDRESS, send_buf, false)
        //////////////////////////////////////////part 2
        send_buf[0] = 31   //Offset byte
        pins.i2cWriteBuffer(CHIP_ADDRESS, send_buf, true)
        for (i = 0; i < 30; i++) {
            send_buf[i] = configData[i+31]
        }
        pins.i2cWriteBuffer(CHIP_ADDRESS, send_buf, true)
        send_buf[0] = configData[61]
        pins.i2cWriteBuffer(CHIP_ADDRESS, send_buf, false)
        //////////////////////////////////////////part 3
        send_buf[0] = 62   //Offset byte
        pins.i2cWriteBuffer(CHIP_ADDRESS, send_buf, true)
        for (i = 0; i < 30; i++) {
            send_buf[i] = configData[i + 62]
        }
        pins.i2cWriteBuffer(CHIP_ADDRESS, send_buf, true)
        send_buf[0] = configData[92]
        pins.i2cWriteBuffer(CHIP_ADDRESS, send_buf, false)
        //////////////////////////////////////////part 4
        send_buf[0] = 93   //Offset byte
        pins.i2cWriteBuffer(CHIP_ADDRESS, send_buf, true)
        for (i = 0; i < 30; i++) {
            send_buf[i] = configData[i + 93]
        }
        pins.i2cWriteBuffer(CHIP_ADDRESS, send_buf, true)
        send_buf[0] = configData[123]
        pins.i2cWriteBuffer(CHIP_ADDRESS, send_buf, false)
        //////////////////////////////////////////part 5
        send_buf[0] = 124   //Offset byte
        pins.i2cWriteBuffer(CHIP_ADDRESS, send_buf, true)
        send_buf[0] = configData[125]
        pins.i2cWriteBuffer(CHIP_ADDRESS, send_buf, true)
        send_buf[0] = configData[126]
        pins.i2cWriteBuffer(CHIP_ADDRESS, send_buf, true)
        send_buf[0] = configData[127]
        pins.i2cWriteBuffer(CHIP_ADDRESS, send_buf, true)
        send_buf[0] = configData[128]
        pins.i2cWriteBuffer(CHIP_ADDRESS, send_buf, false)
        ///////////////////////////////////////////////
        send_buf[0] = CTRL_CMD
        pins.i2cWriteBuffer(CHIP_ADDRESS, send_buf, true)
        send_buf[0] = SAVE_CHECK_CRC
        pins.i2cWriteBuffer(CHIP_ADDRESS, send_buf, false)
        ///////////////////////////////////////////////
        send_buf[0] = CTRL_CMD
        pins.i2cWriteBuffer(CHIP_ADDRESS, send_buf, true)
        send_buf[0] = SW_RESET
        pins.i2cWriteBuffer(CHIP_ADDRESS, send_buf, false)
    }

    function ReadandDisplaySensorStatus(): void {
        let prox = 0;
        let proximityCounter = 0;
        let proximityStatus = 0;
        let noteDuration = 10;

        send_buf[0] = PROX_STAT
        pins.i2cWriteBuffer(CHIP_ADDRESS, send_buf, false)
        rec_buf = pins.i2cReadBuffer(CHIP_ADDRESS, 1, false)
        send_buf[0] = BUTTON_STATUS
        pins.i2cWriteBuffer(CHIP_ADDRESS, send_buf, false)
        rec_buf = pins.i2cReadBuffer(CHIP_ADDRESS, 3, false)
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
            music.playTone(262, noteDuration)
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
        if (((rec_buf[2] & 0x08) == 0) && ((rec_buf[2] & 0xFF) == 0)){
            music.playTone(0, noteDuration)
        }
    }

    //% blockId="kitronik_set_key_sensitivity" block="Play piano"
    //% subcategory="Touch Sensor-Piano"
    export function Play(): void {
        configureMB()
        ReadandDisplaySensorStatus()
    }


}