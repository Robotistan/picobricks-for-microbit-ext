
enum PicoBricksGestureInitType {
    //% block=none
    None = 0,
    //% block=proximity
    Proximity = 1,
    //% block=gesture
    Gesture = 2,
    //% block=color
    Color = 3
}

enum PicoBricksGestureType {
    //% block=none
    None = 0,
    //% block=right
    Right = 1,
    //% block=left
    Left = 2,
    //% block=up
    Up = 3,
    //% block=down
    Down = 4,
}

namespace picobricks {
    const ADDR = 0x39
    const APDS9960_RAM = 0x00
    const APDS9960_ENABLE = 0x80
    const APDS9960_ATIME = 0x81
    const APDS9960_WTIME = 0x83
    const APDS9960_AILTIL = 0x84
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

    let GESTURE_THRESHOLD_OUT = 10;
    let GESTURE_SENSITIVITY_1 = 33
    let GESTURE_SENSITIVITY_2 = 18

    let POWER = 0
    let PROXIMITY = 2
    let WAIT = 3
    let GESTURE = 6
    let ALL = 7

    let LED_DRIVE_100MA = 0

    let PGAIN_4X = 2
    let AGAIN_4X = 1
    let GGAIN_4X = 2

    let LED_BOOST_300 = 3

    let GWTIME_2_8MS = 1

    let DEFAULT_GESTURE_PPULSE = 0x89    // 16us, 10 pulses
    let DEFAULT_GPENTH = 40      // Threshold for entering gesture mode
    let DEFAULT_GEXTH = 30      // Threshold for exiting gesture mode    
    let DEFAULT_GCONF1 = 0x40    // 4 gesture events for int., 1 for exit
    let DEFAULT_GGAIN = GGAIN_4X
    let DEFAULT_GLDRIVE = LED_DRIVE_100MA
    let DEFAULT_GWTIME = GWTIME_2_8MS
    let DEFAULT_GOFFSET = 0       // No offset scaling for gesture mode
    let DEFAULT_GPULSE = 0xC9    // 32us, 10 pulses
    let DEFAULT_GCONF3 = 0       // All photodiodes active during gesture
    let DEFAULT_GIEN = 0       // Disable gesture interrupts

    function i2cwrite(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(addr, buf)
    }

    function i2cread(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }

    function rgb2hue(r: number, g: number, b: number): number {
        // no float support for pxt ts
        r = r * 100 / 255;
        g = g * 100 / 255;
        b = b * 100 / 255;

        let max = Math.max(r, Math.max(g, b))
        let min = Math.min(r, Math.min(g, b))
        let c = max - min;
        let hue = 0;
        let segment = 0;
        let shift = 0;
        if (c != 0) {
            switch (max) {
                case r:
                    segment = (g - b) * 100 / c;
                    shift = 0;       // R° / (360° / hex sides)
                    if (segment < 0) {          // hue > 180, full rotation
                        shift = 360 / 60;         // R° / (360° / hex sides)
                    }
                    hue = segment + shift;
                    break;
                case g:
                    segment = (b - r) * 100 / c;
                    shift = 200;     // G° / (360° / hex sides)
                    hue = segment + shift;
                    break;
                case b:
                    segment = (r - g) * 100 / c;
                    shift = 400;     // B° / (360° / hex sides)
                    hue = segment + shift;
                    break;
            }

        }
        return hue * 60 / 100;
    }

    let currentMode = PicoBricksGestureInitType.None

    /**
     * Initialize the selected gesture module feature
     */
    //% blockId=picoBricksInitGesture
    //% block="gesture sensor init |%sensor"
    //% subcategory="Gesture"
    export function initGesture(sensor: PicoBricksGestureInitType): void {
        i2cwrite(ADDR, APDS9960_ATIME, 252) // default inte time 4x2.78ms
        i2cwrite(ADDR, APDS9960_CONTROL, 0x03) // todo: make gain adjustable
        i2cwrite(ADDR, APDS9960_ENABLE, 0x00) // put everything off
        i2cwrite(ADDR, APDS9960_GCONF4, 0x00) // disable gesture mode
        i2cwrite(ADDR, APDS9960_AICLEAR, 0x00) // clear all interrupt

        gestureRuns = false

        switch (sensor) {
            case PicoBricksGestureInitType.Proximity:
                currentMode = PicoBricksGestureInitType.Proximity
                proximityInit()
                break;
            case PicoBricksGestureInitType.Gesture:
                currentMode = PicoBricksGestureInitType.Gesture
                gestureInit()
                break;
            case PicoBricksGestureInitType.Color:
                currentMode = PicoBricksGestureInitType.Color
                colorInit()
                break;
            default:
        }
    }

    function colorInit(): void {
        // power on
        i2cwrite(ADDR, APDS9960_ENABLE, 0x03) // enable ALS,PROX,GESTURE
    }

    function proximityInit(): void {
        // power on
        i2cwrite(ADDR, APDS9960_ENABLE, 0x05) // enable ALS,PROX,GESTURE
    }

    /**
     * Read the gesture sensor ID
     */
    //% blockId=picoBricksGestureId
    //% block="gesture sensor id"
    //% subcategory="Gesture"
    export function gestureId(): number {
        let chipid = i2cread(ADDR, APDS9960_ID);
        return chipid;
    }

    /**
     * Read the Hue value
     */
    //% blockId=picoBricksReadHue
    //% block="gesture sensor hue value"
    //% subcategory="Gesture"
    export function readHue(): number {
        if (!(currentMode == PicoBricksGestureInitType.Color)) {
            return 0
        }
        let tmp = i2cread(ADDR, APDS9960_STATUS) & 0x1;
        while (!tmp) {
            basic.pause(5);
            tmp = i2cread(ADDR, APDS9960_STATUS) & 0x1;
        }
        let c = i2cread(ADDR, APDS9960_CDATAL) + i2cread(ADDR, APDS9960_CDATAH) * 256;
        let r = i2cread(ADDR, APDS9960_RDATAL) + i2cread(ADDR, APDS9960_RDATAH) * 256;
        let g = i2cread(ADDR, APDS9960_GDATAL) + i2cread(ADDR, APDS9960_GDATAH) * 256;
        let b = i2cread(ADDR, APDS9960_BDATAL) + i2cread(ADDR, APDS9960_BDATAH) * 256;
        // map to rgb based on clear channel
        let avg = c / 3;
        r = r * 255 / avg;
        g = g * 255 / avg;
        b = b * 255 / avg;
        let hue = rgb2hue(r, g, b);
        return hue
    }

    /**
     * Read the color
     */
    //% blockId=picoBricksReadColor
    //% block="gesture sensor color"
    //% subcategory="Gesture"
    export function readColor(): string {
        let tmp = i2cread(ADDR, APDS9960_STATUS) & 0x1;
        while (!tmp) {
            basic.pause(5);
            tmp = i2cread(ADDR, APDS9960_STATUS) & 0x1;
        }
        let r = i2cread(ADDR, APDS9960_RDATAL) + i2cread(ADDR, APDS9960_RDATAH) * 256;
        let g = i2cread(ADDR, APDS9960_GDATAL) + i2cread(ADDR, APDS9960_GDATAH) * 256;
        let b = i2cread(ADDR, APDS9960_BDATAL) + i2cread(ADDR, APDS9960_BDATAH) * 256;

        if((r > g) && (r > b))  
            return "RED"
        else if ((g > r) && (g > b))   
            return "GREEN"
        else if ((b > r) && (b > g))    
            return "BLUE"
        else
            return "NO COLOR"
    }

    /**
     * Read the red color (0-255) value from the gesture sensor 
     */
    //% blockId=picoBricksReadRedColor
    //% block="gesture sensor red color value"
    //% subcategory="Gesture"
    export function readRedColor(): number {
        if (!(currentMode == PicoBricksGestureInitType.Color)) {
            return 0
        }
        let tmp = i2cread(ADDR, APDS9960_STATUS) & 0x1;
        while (!tmp) {
            basic.pause(5);
            tmp = i2cread(ADDR, APDS9960_STATUS) & 0x1;
        }
        let r = i2cread(ADDR, APDS9960_RDATAL) + i2cread(ADDR, APDS9960_RDATAH) * 256;
        return r
    }

    /**
     * Read the green color (0-255) value from the gesture sensor
     */
    //% blockId=picoBricksReadGreenColor
    //% block="gesture sensor green color value"
    //% subcategory="Gesture"
    export function readGreenColor(): number {
        if (!(currentMode == PicoBricksGestureInitType.Color)) {
            return 0
        }
        let tmp = i2cread(ADDR, APDS9960_STATUS) & 0x1;
        while (!tmp) {
            basic.pause(5);
            tmp = i2cread(ADDR, APDS9960_STATUS) & 0x1;
        }
        let g = i2cread(ADDR, APDS9960_GDATAL) + i2cread(ADDR, APDS9960_GDATAH) * 256;
        return g
    }

    /**
     * Read the blue color (0-255) value from the gesture sensor
     */
    //% blockId=picoBricksReadBlueColor
    //% block="gesture sensor blue color value"
    //% subcategory="Gesture"
    export function readBlueColor(): number {
        if (!(currentMode == PicoBricksGestureInitType.Color)) {
            return 0
        }
        let tmp = i2cread(ADDR, APDS9960_STATUS) & 0x1;
        while (!tmp) {
            basic.pause(5);
            tmp = i2cread(ADDR, APDS9960_STATUS) & 0x1;
        }
        let b = i2cread(ADDR, APDS9960_BDATAL) + i2cread(ADDR, APDS9960_BDATAH) * 256;
        return b
    }

    /**
     * Read the light value 
     */
    //% blockId=picoBricksBrightness
    //% block="gesture sensor brightness"
    //% subcategory="Gesture"
    export function brightness(): number {
        if (!(currentMode == PicoBricksGestureInitType.Color)) {
            return 0
        }
        let tmp = i2cread(ADDR, APDS9960_STATUS) & 0x1;
        while (!tmp) {
            basic.pause(5);
            tmp = i2cread(ADDR, APDS9960_STATUS) & 0x1;
        }
        let c = i2cread(ADDR, APDS9960_CDATAL) + i2cread(ADDR, APDS9960_CDATAH) * 256;
        return c
    }

    /**
     * Read the proximity value 
     */
    //% blockId=picoBricksReadProximity
    //% block="gesture sensor proximity value"
    //% subcategory="Gesture"
    export function readProximity(): number {
        if (!(currentMode == PicoBricksGestureInitType.Proximity)) {
            return 0
        }
        let tmp = i2cread(ADDR, APDS9960_STATUS) & 0x2;
        while (!tmp) {
            basic.pause(5);
            tmp = i2cread(ADDR, APDS9960_STATUS) & 0x2;
        }
        let p = i2cread(ADDR, APDS9960_PDATA);
        return p
    }

    enum direction {
        none,
        left,
        right,
        up,
        down,
        all
    }
    enum state {
        na,
        near,
        far,
        all
    }

    export class GestureDataType {
        u_data: Buffer;
        d_data: Buffer;
        l_data: Buffer;
        r_data: Buffer;
        index: number;
        total_gestures: number;
        in_threshold: number;
        out_threshold: number;
    }

    let gesture_data = new GestureDataType;
    let data_buf: Buffer = pins.createBuffer(128);

    export class Apds9960Class {
        gesture_ud_delta: number;
        gesture_lr_delta: number;
        gesture_ud_count: number;
        gesture_lr_count: number;
        gesture_near_count: number;
        gesture_far_count: number;
        gesture_state: number;
        gesture_motion: number;

        APDS9960ReadReg(addr: number): number {
            let buf: Buffer = pins.createBuffer(1);

            buf[0] = addr;
            pins.i2cWriteBuffer(ADDR, buf, false);
            buf = pins.i2cReadBuffer(ADDR, 1, false);
            return buf[0];
        }

        APDS9960WriteReg(addr: number, cmd: number) {
            let buf2: Buffer = pins.createBuffer(2);

            buf2[0] = addr;
            buf2[1] = cmd;
            pins.i2cWriteBuffer(ADDR, buf2, false);
        }

        APDS9960ReadRegBlock(addr: number, len: number): number {
            let i: number = 0;
            let y: number = 0;

            for (let j = 0; j < len; j = j + 4) {

                data_buf[j] = this.readi2c(APDS9960_GFIFO_U);
                data_buf[j + 1] = this.readi2c(APDS9960_GFIFO_D);
                data_buf[j + 2] = this.readi2c(APDS9960_GFIFO_L);
                data_buf[j + 3] = this.readi2c(APDS9960_GFIFO_R);
                basic.pause(10);
            }
            return len;
        }

        getMode(): number {
            let enable_value: number;
            enable_value = this.APDS9960ReadReg(APDS9960_ENABLE);
            return enable_value;
        }

        setMode(mode: number, enable: number) {
            let reg_val: number;

            reg_val = this.getMode();
            enable = enable & 0x01;
            if (mode >= 0 && mode <= 6) {
                if (enable) {
                    reg_val |= (1 << mode);
                } else {
                    reg_val = 0x00;
                }
            } 
            else if (mode == ALL) {
                if (enable) {
                    reg_val = 0x7F;
                } else {
                    reg_val = 0x00;
                }
            }
            this.APDS9960WriteReg(APDS9960_ENABLE, reg_val);
        }
        setGestureGain(gain: number) {
            let val: number;
            
            val = this.APDS9960ReadReg(APDS9960_GCONF2);
            gain &= 0b00000011;
            gain = gain << 5;
            val &= 0b10011111;
            val |= gain;
            this.APDS9960WriteReg(APDS9960_GCONF2, val);
        }

        setGestureLEDDrive(drive: number) {
            let val2: number;

            val2 = this.APDS9960ReadReg(APDS9960_GCONF2);
            drive &= 0b00000011;
            drive = drive << 3;
            val2 &= 0b11100111;
            val2 |= drive;
            this.APDS9960WriteReg(APDS9960_GCONF2, val2);
        }

        setLEDBoost(boost: number) {
            let val3: number;

            val3 = this.APDS9960ReadReg(APDS9960_CONFIG2);
            boost &= 0b00000011;
            boost = boost << 4;
            val3 &= 0b11001111;
            val3 |= boost;
            this.APDS9960WriteReg(APDS9960_CONFIG2, val3);
        }

        setGestureWaitTime(time: number) {
            let val4: number;

            val4 = this.APDS9960ReadReg(APDS9960_GCONF2);
            time &= 0b00000111;
            val4 &= 0b11111000;
            val4 |= time;
            this.APDS9960WriteReg(APDS9960_GCONF2, val4);
        }

        setGestureIntEnable(enable: number) {
            let val5: number;

            val5 = this.APDS9960ReadReg(APDS9960_GCONF4);
            enable &= 0b00000001;
            enable = enable << 1;
            val5 &= 0b11111101;
            val5 |= enable;
            this.APDS9960WriteReg(APDS9960_GCONF4, val5);
        }

        resetGestureParameters() {
            gesture_data.index = 0;
            gesture_data.total_gestures = 0;

            this.gesture_ud_delta = 0;
            this.gesture_lr_delta = 0;
            this.gesture_ud_count = 0;
            this.gesture_lr_count = 0;
            this.gesture_near_count = 0;
            this.gesture_far_count = 0;
            this.gesture_state = 0;
            this.gesture_motion = direction.none;
        }

        setGestureMode(mode: number) {
            let val6: number;

            val6 = this.APDS9960ReadReg(APDS9960_GCONF4);
            mode &= 0b00000001;
            val6 &= 0b11111110;
            val6 |= mode;
            this.APDS9960WriteReg(APDS9960_GCONF4, val6);
        }

        enablePower() {
            this.setMode(POWER, 1);
        }

        enableGestureSensor(interrupts: boolean) {
            this.resetGestureParameters();
            this.APDS9960WriteReg(APDS9960_WTIME, 0xFF);
            this.APDS9960WriteReg(APDS9960_PPULSE, DEFAULT_GESTURE_PPULSE);
            this.setLEDBoost(LED_BOOST_300);
            if (interrupts) {
                this.setGestureIntEnable(1);
            } else {
                this.setGestureIntEnable(0);
            }
            this.setGestureMode(1);
            this.enablePower();
            this.setMode(WAIT, 1)
            this.setMode(PROXIMITY, 1);
            this.setMode(GESTURE, 1);
        }

        pads9960_init() {
            let aa = this.APDS9960ReadReg(0X92);
            if (aa == 0xAB) {
                this.APDS9960WriteReg(APDS9960_GPENTH, DEFAULT_GPENTH);//0x28
                this.APDS9960WriteReg(APDS9960_GEXTH, DEFAULT_GEXTH);//0x1e
                this.APDS9960WriteReg(APDS9960_GCONF1, DEFAULT_GCONF1);//0x40
                this.setGestureGain(DEFAULT_GGAIN);//0x41
                this.setGestureLEDDrive(DEFAULT_GLDRIVE);
                this.setGestureWaitTime(DEFAULT_GWTIME);
                this.APDS9960WriteReg(APDS9960_GOFFSET_U, DEFAULT_GOFFSET);
                this.APDS9960WriteReg(APDS9960_GOFFSET_D, DEFAULT_GOFFSET);
                this.APDS9960WriteReg(APDS9960_GOFFSET_L, DEFAULT_GOFFSET);
                this.APDS9960WriteReg(APDS9960_GOFFSET_R, DEFAULT_GOFFSET);
                this.APDS9960WriteReg(APDS9960_GPULSE, DEFAULT_GPULSE);//0xc9
                this.APDS9960WriteReg(APDS9960_GCONF3, DEFAULT_GCONF3);//00
                this.setGestureIntEnable(DEFAULT_GIEN);
            }
        }

        isGestureAvailable(): boolean {
            let val8: number;

            val8 = this.APDS9960ReadReg(0xAF);
            val8 &= 0b00000001;
            if (val8 == 1) {
                return true;
            } else {
                return false;
            }
        }

        processGestureData(): boolean {
            let u_first: number = 0;
            let d_first: number = 0;
            let l_first: number = 0;
            let r_first: number = 0;
            let u_last: number = 0;
            let d_last: number = 0;
            let l_last: number = 0;
            let r_last: number = 0;
            let ud_ratio_first: number;
            let lr_ratio_first: number;
            let ud_ratio_last: number;
            let lr_ratio_last: number;
            let ud_delta: number;
            let lr_delta: number;
            let k: number;

            if (gesture_data.total_gestures <= 4) {
                return false;
            }

            if ((gesture_data.total_gestures <= 32) && (gesture_data.total_gestures > 0)) {
                for (k = 0; k < gesture_data.total_gestures; k++) {
                    if ((gesture_data.u_data[k] > GESTURE_THRESHOLD_OUT) &&
                        (gesture_data.d_data[k] > GESTURE_THRESHOLD_OUT) &&
                        (gesture_data.l_data[k] > GESTURE_THRESHOLD_OUT) &&
                        (gesture_data.r_data[k] > GESTURE_THRESHOLD_OUT)) {

                        u_first = gesture_data.u_data[k];
                        d_first = gesture_data.d_data[k];
                        l_first = gesture_data.l_data[k];
                        r_first = gesture_data.r_data[k];
                        break;
                    }
                }

                if ((u_first == 0) || (d_first == 0) || (l_first == 0) || (r_first == 0)) {

                    return false;
                }

                for (k = gesture_data.total_gestures - 1; k >= 0; k--) {
                    if ((gesture_data.u_data[k] > GESTURE_THRESHOLD_OUT) &&
                        (gesture_data.d_data[k] > GESTURE_THRESHOLD_OUT) &&
                        (gesture_data.l_data[k] > GESTURE_THRESHOLD_OUT) &&
                        (gesture_data.r_data[k] > GESTURE_THRESHOLD_OUT)) {

                        u_last = gesture_data.u_data[k];
                        d_last = gesture_data.d_data[k];
                        l_last = gesture_data.l_data[k];
                        r_last = gesture_data.r_data[k];
                        break;
                    }
                }
            }

            ud_ratio_first = ((u_first - d_first) * 100) / (u_first + d_first);
            lr_ratio_first = ((l_first - r_first) * 100) / (l_first + r_first);
            ud_ratio_last = ((u_last - d_last) * 100) / (u_last + d_last);
            lr_ratio_last = ((l_last - r_last) * 100) / (l_last + r_last);
            if (ud_ratio_first == 0 && lr_ratio_first == 0 && ud_ratio_last == 0 && lr_ratio_last == 0) {
                this.pads9960_init();
                this.enableGestureSensor(false);
            }

            ud_delta = ud_ratio_last - ud_ratio_first;
            lr_delta = lr_ratio_last - lr_ratio_first;

            this.gesture_ud_delta += ud_delta;
            this.gesture_lr_delta += lr_delta;

            if (this.gesture_ud_delta >= GESTURE_SENSITIVITY_1) {
                this.gesture_ud_count = 1;
            } else if (this.gesture_ud_delta <= -GESTURE_SENSITIVITY_1) {
                this.gesture_ud_count = -1;
            } else {
                this.gesture_ud_count = 0;
            }

            if (this.gesture_lr_delta >= GESTURE_SENSITIVITY_1) {
                this.gesture_lr_count = 1;
            } else if (this.gesture_lr_delta <= -GESTURE_SENSITIVITY_1) {
                this.gesture_lr_count = -1;
            } else {
                this.gesture_lr_count = 0;
            }

            if ((this.gesture_ud_count == 0) && (this.gesture_lr_count == 0)) {
                if ((Math.abs(ud_delta) < GESTURE_SENSITIVITY_2) && (Math.abs(lr_delta) < GESTURE_SENSITIVITY_2)) {
                    if ((ud_delta == 0) && (lr_delta == 0)) {
                        this.gesture_near_count++;
                    } else if ((ud_delta != 0) || (lr_delta != 0)) {
                        this.gesture_far_count++;
                    }
                    if ((this.gesture_near_count >= 10) && (this.gesture_far_count >= 2)) {
                        if ((ud_delta == 0) && (lr_delta == 0)) {
                            this.gesture_state = state.near;
                        } else if ((ud_delta != 0) && (lr_delta != 0)) {
                            this.gesture_state = state.far;
                        }
                        return true;
                    }
                }
            } 
            else {
                if ((Math.abs(ud_delta) < GESTURE_SENSITIVITY_2) && (Math.abs(lr_delta) < GESTURE_SENSITIVITY_2)) {
                    if ((ud_delta == 0) && (lr_delta == 0)) {
                        this.gesture_near_count++;
                    }
                    if (this.gesture_near_count >= 10) {
                        this.gesture_ud_count = 0;
                        this.gesture_lr_count = 0;
                        this.gesture_ud_delta = 0;
                        this.gesture_lr_delta = 0;
                    }
                }
            }
            return true;
        }
        decodeGesture(): boolean {
            if ((this.gesture_ud_count == -1) && (this.gesture_lr_count == 0)) {
                this.gesture_motion = direction.up;
            } else if ((this.gesture_ud_count == 1) && (this.gesture_lr_count == 0)) {
                this.gesture_motion = direction.down;
            } else if ((this.gesture_ud_count == 0) && (this.gesture_lr_count == 1)) {
                this.gesture_motion = direction.right;
            } else if ((this.gesture_ud_count == 0) && (this.gesture_lr_count == -1)) {
                this.gesture_motion = direction.left;
            } else if ((this.gesture_ud_count == -1) && (this.gesture_lr_count == 1)) {
                if (Math.abs(this.gesture_ud_delta) > Math.abs(this.gesture_lr_delta)) {
                    this.gesture_motion = direction.up;
                } else {
                    this.gesture_motion = direction.right;
                }
            } else if ((this.gesture_ud_count == 1) && (this.gesture_lr_count == -1)) {
                if (Math.abs(this.gesture_ud_delta) > Math.abs(this.gesture_lr_delta)) {
                    this.gesture_motion = direction.down;
                } else {
                    this.gesture_motion = direction.left;
                }
            } else if ((this.gesture_ud_count == -1) && (this.gesture_lr_count == -1)) {
                if (Math.abs(this.gesture_ud_delta) > Math.abs(this.gesture_lr_delta)) {
                    this.gesture_motion = direction.up;
                } else {
                    this.gesture_motion = direction.left;
                }
            } else if ((this.gesture_ud_count == 1) && (this.gesture_lr_count == 1)) {
                if (Math.abs(this.gesture_ud_delta) > Math.abs(this.gesture_lr_delta)) {
                    this.gesture_motion = direction.down;
                } else {
                    this.gesture_motion = direction.right;
                }
            } else {
                return false;
            }
            return true;
        }

        readGesture(): number {
            let fifo_level: number = 0;
            let bytes_read: number = 0;
            let fifo_data: number[] = [];
            let gstatus: number;
            let motion: number;
            let l: number;

            gesture_data.d_data = pins.createBuffer(32);
            gesture_data.u_data = pins.createBuffer(32);
            gesture_data.l_data = pins.createBuffer(32);
            gesture_data.r_data = pins.createBuffer(32);

            if (!this.isGestureAvailable() || !(this.getMode() & 0b01000001)) {
                return direction.none;
            }
            while (1) {
                basic.pause(30);
                gstatus = this.APDS9960ReadReg(0xAF);
                if ((gstatus & 0b00000001) == 0b00000001) {
                    fifo_level = this.APDS9960ReadReg(APDS9960_GFLVL);
                    if (fifo_level > 0) {
                        bytes_read = this.APDS9960ReadRegBlock(APDS9960_GFIFO_U,(fifo_level * 4));

                        for (let m = 0; m < bytes_read; m++) {
                            fifo_data[m] = data_buf[m];
                        }

                        if (bytes_read >= 4) {
                            for (let ii = 0; ii < bytes_read; ii = ii + 4) {
                                gesture_data.u_data[gesture_data.index] = fifo_data[ii + 0];
                                gesture_data.d_data[gesture_data.index] = fifo_data[ii + 1];
                                gesture_data.l_data[gesture_data.index] = fifo_data[ii + 2];
                                gesture_data.r_data[gesture_data.index] = fifo_data[ii + 3];
                                gesture_data.index++;
                                gesture_data.total_gestures++;
                            }

                            if (this.processGestureData()) {
                                if (this.decodeGesture()) {
                                    motion = this.gesture_motion;
                                    this.resetGestureParameters();
                                    return motion;
                                }
                            }
                            gesture_data.index = 0;
                            gesture_data.total_gestures = 0;
                        }
                    }
                }
                else {
                    basic.pause(30);
                    this.decodeGesture();
                    motion = this.gesture_motion;
                    this.resetGestureParameters();
                    return motion;
                }
            }
            motion = this.gesture_motion;
            return motion;
        }
        read(): number {
            if (!(currentMode == PicoBricksGestureInitType.Gesture)) {
                return 0
            }
            let result = PicoBricksGestureType.None;
            switch (this.readGesture()) {
                case direction.up:
                    result = PicoBricksGestureType.Up;
                    break;
                case direction.down:
                    result = PicoBricksGestureType.Down;
                    break;
                case direction.left:
                    result = PicoBricksGestureType.Left;
                    break;
                case direction.right:
                    result = PicoBricksGestureType.Right;
                    break;
                default:
                    result = PicoBricksGestureType.None;
                    break;
            }
            return result;
        }
        readi2c(addr: number): number {
            return this.APDS9960ReadReg(addr);
        }
    }

    let gestureRuns = false
    function gestureInit() {
        gestureRuns = true
        let apds9960 = new Apds9960Class();
        apds9960.pads9960_init();
        apds9960.enableGestureSensor(false);
        basic.pause(100);
        control.inBackground(() => {
            let prevGst = PicoBricksGestureType.None;
            while (gestureRuns) {
                let gst = apds9960.read();
                if (gst != prevGst) {
                    prevGst = gst;
                    control.raiseEvent(3100, gst, EventCreationMode.CreateAndFire);
                }
                basic.pause(50);
            }
        })
    }

    /**
     * When the sensor detects the set value
     */
    //% blockId=picoBricksOnGesture
    //% blockId="picoBricksOnGesture" block="on gesture |%gesture"
    //% subcategory="Gesture"
    export function onGesture(gesture: PicoBricksGestureType, handler: () => void) {
        control.onEvent(3100, gesture, handler);
    }
}
