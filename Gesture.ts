namespace PicoBricks {
    const ADDR = 0x39
    const APDS9960_RAM = 0x00
    const APDS9960_ENABLE = 0x80
    const APDS9960_ATIME = 0x81
    const APDS9960_WTIME = 0x83
    const APDS9960_AILTL = 0x84
    const APDS9960_AILTH = 0x85
    const APDS9960_AIHTL = 0x86
    const APDS9960_AIHTH = 0x87
    const APDS9960_PILT = 0x89
    const APDS9960_PIHT = 0x8B
    const APDS9960_PERS = 0x8C
    const APDS9960_CONFIG1 = 0x8D
    const APDS9960_PPULSE = 0x8E
    const APDS9960_CONTROL = 0x8F
    const APDS9960_CONFIG2 = 0x90
    const APDS9960_ID = 0x92
    const APDS9960_STATUS = 0x93
    const APDS9960_CDATAL = 0x94
    const APDS9960_CDATAH = 0x95
    const APDS9960_RDATAL = 0x96
    const APDS9960_RDATAH = 0x97
    const APDS9960_GDATAL = 0x98
    const APDS9960_GDATAH = 0x99
    const APDS9960_BDATAL = 0x9A
    const APDS9960_BDATAH = 0x9B
    const APDS9960_PDATA = 0x9C
    const APDS9960_POFFSET_UR = 0x9D
    const APDS9960_POFFSET_DL = 0x9E
    const APDS9960_CONFIG3 = 0x9F
    const APDS9960_GPENTH = 0xA0
    const APDS9960_GEXTH = 0xA1
    const APDS9960_GCONF1 = 0xA2
    const APDS9960_GCONF2 = 0xA3
    const APDS9960_GOFFSET_U = 0xA4
    const APDS9960_GOFFSET_D = 0xA5
    const APDS9960_GOFFSET_L = 0xA7
    const APDS9960_GOFFSET_R = 0xA9
    const APDS9960_GPULSE = 0xA6
    const APDS9960_GCONF3 = 0xAA
    const APDS9960_GCONF4 = 0xAB
    const APDS9960_GFLVL = 0xAE
    const APDS9960_GSTATUS = 0xAF
    const APDS9960_IFORCE = 0xE4
    const APDS9960_PICLEAR = 0xE5
    const APDS9960_CICLEAR = 0xE6
    const APDS9960_AICLEAR = 0xE7
    const APDS9960_GFIFO_U = 0xFC
    const APDS9960_GFIFO_D = 0xFD
    const APDS9960_GFIFO_L = 0xFE
    const APDS9960_GFIFO_R = 0xFF
    const PGAIN_2X = 1
    const DEFAULT_PGAIN = 2
    const DEFAULT_LDRIVE = 0
    
    function i2cwrite(addr: number, reg: number, value: number) {
        let buf2 = pins.createBuffer(2)
        buf2[0] = reg
        buf2[1] = value
        pins.i2cWriteBuffer(addr, buf2)
    }

    function i2cread(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }

    //% block="APDS9960 Init"
    //% weight=100
    //% subcategory="Gesture-APDS9960"
    export function Init(): void {
        enableMode(7, 0)
        i2cwrite(ADDR, APDS9960_ATIME, 219) // 103ms
        i2cwrite(ADDR, APDS9960_WTIME, 246) // 27ms
        i2cwrite(ADDR, APDS9960_PPULSE, 0x87) // 16us, 8 pulses
        i2cwrite(ADDR, APDS9960_POFFSET_UR, 0) // 0 offset
        i2cwrite(ADDR, APDS9960_POFFSET_DL, 0) // 0 offset
        i2cwrite(ADDR, APDS9960_CONFIG1, 0x60) // No 12x wait (WTIME) factor


        setLEDDrive(DEFAULT_LDRIVE)
        setProximityGain(DEFAULT_PGAIN)
        setAmbientLightGain(1)
        i2cwrite(ADDR, APDS9960_PILT, 0) // Low proximity threshold
        i2cwrite(ADDR, APDS9960_PIHT, 50) // High proximity threshold
        setLightIntLowThreshold(0xFFFF) // Force interrupt for calibration
        setLightIntHighThreshold(0)
        i2cwrite(ADDR, APDS9960_PERS, 0x11) // 2 consecutive prox or ALS for int.
        i2cwrite(ADDR, APDS9960_CONFIG2, 0x01) // No saturation interrupts or LED boost
        i2cwrite(ADDR, APDS9960_CONFIG3, 0)

        setProximityGain(PGAIN_2X)
        setProximityIntEnable(0)
        enableMode(0, 1)
        enableMode(2, 1)
    }
    /**
     * Gets APDS9960 CHIP ID
     * It should return 0xAB or 171
     */
    //% block="APDS9960 ID"
    //% subcategory="Gesture-APDS9960"
    export function id(): number {
        let chipid = i2cread(ADDR, APDS9960_ID);
        return chipid;
    }

    function setProximityGain(drive: number) {
        let val2 = 0;

        drive &= 0b00000011;
        drive = drive << 2;
        val2 &= 0b11110011;
        val2 |= drive;

        i2cwrite(ADDR, APDS9960_CONTROL, val2)
    }

    function setLEDDrive(drive: number) {
        let val3 = 0;

        drive &= 0b00000011;
        drive = drive << 6;
        val3 &= 0b00111111;
        val3 |= drive;

        i2cwrite(ADDR, APDS9960_CONTROL, val3)
    }

    function setProximityIntEnable(enable: number) {
        let val4 = 0;

        enable &= 0b00000001;
        enable = enable << 5;
        val4 &= 0b11011111;
        val4 |= enable;

        i2cwrite(ADDR, APDS9960_ENABLE, val4)
    }

    function enableMode(mode: number, enable: number) {
        let reg_val = 0;
        enable = enable & 0x01;
        if (mode >= 0 && mode <= 6) {
            if (enable) {
                reg_val |= (1 << mode);
            } else {
                reg_val &= ~(1 << mode);
            }
        } else if (mode == 7) {
            if (enable) {
                reg_val = 0x7F;
            } else {
                reg_val = 0x00;
            }
        }
        i2cwrite(ADDR, APDS9960_ENABLE, reg_val)
    }

    function setAmbientLightGain(drive: number) {
        let val5 = 0;
        drive &= 0b00000011;
        val5 &= 0b11111100;
        val5 |= drive;

        i2cwrite(ADDR, APDS9960_CONTROL, val5)
    }

    function setLightIntLowThreshold(threshold: number) {
        let val_low = 0;
        let val_high = 0;
        val_low = threshold & 0x00FF;
        val_high = (threshold & 0xFF00) >> 8;

        i2cwrite(ADDR, APDS9960_AILTL, val_low)
        i2cwrite(ADDR, APDS9960_AILTH, val_high)
    }

    function setLightIntHighThreshold(threshold: number) {
        let val_low2 = 0;
        let val_high2 = 0;
        val_low2 = threshold & 0x00FF;
        val_high2 = (threshold & 0xFF00) >> 8;

        i2cwrite(ADDR, APDS9960_AIHTL, val_low2)
        i2cwrite(ADDR, APDS9960_AIHTH, val_high2)
    }

    //% block="APDS9960 Proximity"
    //% subcategory="Gesture-APDS9960"
    export function proximity(): number {
        let prox = i2cread(ADDR, APDS9960_PDATA)
        return prox;
    }

}
