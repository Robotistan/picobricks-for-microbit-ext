enum PicoBricksNotes {
    //% block=low_do
    LowDo = 131,
    //% block=low_re
    LowRe = 147,
    //% block=low_mi
    LowMi = 165,
    //% block=low_fa
    LowFa = 175,
    //% block=low_sol
    LowSol = 196,
    //% block=low_la
    LowLa = 220,
    //% block=low_si
    LowSi = 247,
    //% block=middle_do
    MiddleDo = 262,
    //% block=middle_re
    MiddleRe = 294,
    //% block=middle_mi
    MiddleMi = 330,
    //% block=middle_fa
    MiddleFa = 349,
    //% block=middle_sol
    MiddleSol = 392,
    //% block=middle_la
    MiddleLa = 440,
    //% block=middle_si
    MiddleSi = 494,
    //% block=high_do
    HighDo = 523,
    //% block=high_re
    HighRe = 587,
    //% block=high_mi
    HighMi = 659,
    //% block=high_fa
    HighFa = 698,
    //% block=high_sol
    HighSol = 784,
    //% block=high_la
    HighLa = 880,
    //% block=high_si
    HighSi = 988
}

enum PicoBricksVolumeStatus {
    //% block=passive
    Passive = 0,
    //% block=active
    Active = 1
}

enum PicoBricksToneStatus {
    //% block=passive
    Passive = 0,
    //% block=active
    Active = 1
}

namespace picobricks {
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

    const NOTE_B0 = 31
    const NOTE_C1 = 33
    const NOTE_CS1 = 35
    const NOTE_D1 = 37
    const NOTE_DS1 = 39
    const NOTE_E1 = 41
    const NOTE_F1 = 44
    const NOTE_FS1 = 46
    const NOTE_G1 = 49
    const NOTE_GS1 = 52
    const NOTE_A1 = 55
    const NOTE_AS1 = 58
    const NOTE_B1 = 62
    const NOTE_C2 = 65
    const NOTE_CS2 = 69
    const NOTE_D2 = 73
    const NOTE_DS2 = 78
    const NOTE_E2 = 82
    const NOTE_F2 = 87
    const NOTE_FS2 = 93
    const NOTE_G2 = 98
    const NOTE_GS2 = 104
    const NOTE_A2 = 110
    const NOTE_AS2 = 117
    const NOTE_B2 = 123
    const NOTE_C3 = 131
    const NOTE_CS3 = 139
    const NOTE_D3 = 147
    const NOTE_DS3 = 156
    const NOTE_E3 = 165
    const NOTE_F3 = 175
    const NOTE_FS3 = 185
    const NOTE_G3 = 196
    const NOTE_GS3 = 208
    const NOTE_A3 = 220
    const NOTE_AS3 = 233
    const NOTE_B3 = 247
    const NOTE_C4 = 262
    const NOTE_CS4 = 277
    const NOTE_D4 = 294
    const NOTE_DS4 = 311
    const NOTE_E4 = 330
    const NOTE_F4 = 349
    const NOTE_FS4 = 370
    const NOTE_G4 = 392
    const NOTE_GS4 = 415
    const NOTE_A4 = 440
    const NOTE_AS4 = 466
    const NOTE_B4 = 494
    const NOTE_C5 = 523
    const NOTE_CS5 = 554
    const NOTE_D5 = 587
    const NOTE_DS5 = 622
    const NOTE_E5 = 659
    const NOTE_F5 = 698
    const NOTE_FS5 = 740
    const NOTE_G5 = 784
    const NOTE_GS5 = 831
    const NOTE_A5 = 880
    const NOTE_AS5 = 932
    const NOTE_B5 = 988
    const NOTE_C6 = 1047
    const NOTE_CS6 = 1109
    const NOTE_D6 = 1175
    const NOTE_DS6 = 1245
    const NOTE_E6 = 1319
    const NOTE_F6 = 1397
    const NOTE_FS6 = 1480
    const NOTE_G6 = 1568
    const NOTE_GS6 = 1661
    const NOTE_A6 = 1760
    const NOTE_AS6 = 1865
    const NOTE_B6 = 1976
    const NOTE_C7 = 2093
    const NOTE_CS7 = 2217
    const NOTE_D7 = 2349
    const NOTE_DS7 = 2489
    const NOTE_E7 = 2637
    const NOTE_F7 = 2794
    const NOTE_FS7 = 2960
    const NOTE_G7 = 3136
    const NOTE_GS7 = 3322
    const NOTE_A7 = 3520
    const NOTE_AS7 = 3729
    const NOTE_B7 = 3951
    const NOTE_C8 = 4186
    const NOTE_CS8 = 4435
    const NOTE_D8 = 4699
    const NOTE_DS8 = 4978

    let rec_buf = pins.createBuffer(3);
    let buff = pins.createBuffer(32);
    let buff1 = pins.createBuffer(1);
    let buff2 = pins.createBuffer(2);
    let buff5 = pins.createBuffer(5);
    let tone = 0;
    let volume = 1;
    let noteDuration = 0;

    function configureMB(): void {
        //pins.i2cWriteNumber(CHIP_ADDRESS, 0x8F, NumberFormat.UInt8BE, false)
        //let val = pins.i2cReadNumber(CHIP_ADDRESS, NumberFormat.UInt8BE)
        //control.waitMicros(2000);
        // WAKE UP
        buff2[0] = 0x00
        buff2[1] = 0x00
        pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, true)
        buff2[0] = 0x00
        buff2[1] = 0x00
        pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, true)
        // ENABLE SENSORS
        buff[0] = 0x00
        buff[1] = 0xFF
        buff[2] = 0x7F
        buff[3] = 0xFE
        buff[4] = 0x7F
        buff[5] = 0x00
        buff[6] = 0x00
        buff[7] = 0x00
        buff[8] = 0x00
        buff[9] = 0x00
        buff[10] = 0x00
        buff[11] = 0x00
        buff[12] = 0x00
        // FINGER THRESHOLDS 27
        buff[13] = 0x0E
        buff[14] = 0x84
        buff[15] = 0x84
        buff[16] = 0x84
        buff[17] = 0x84
        buff[18] = 0x84
        buff[19] = 0x84
        buff[20] = 0x84
        buff[21] = 0x84
        buff[22] = 0x84
        buff[23] = 0x84
        buff[24] = 0x84
        buff[25] = 0x84
        buff[26] = 0x84
        buff[27] = 0x84
        buff[28] = 0x84
        // Debounce 
        buff[29] = 0x03
        // HYSTERESIS 
        buff[30] = 0x00
        buff[31] = 0x00
        pins.i2cWriteBuffer(CHIP_ADDRESS, buff, false)
        //ADRESS
        buff[0] = 0x1F //31
        // LBR
        buff[1] = 0x00
        // RESERVED
        buff[2] = 0x00
        buff[3] = 0x00
        buff[4] = 0x00
        buff[5] = 0x00
        // NEGATIVE NOISE TH
        buff[6] = 0x00
        // NOISE TH
        buff[7] = 0x00
        // PROX_EN  38 
        buff[8] = 0x01
        // PROX CFG1-2
        buff[9] = 0x81
        buff[10] = 0x06
        // PS0 TH
        buff[11] = 0x00
        buff[12] = 0x00
        buff[13] = 0xFF
        // PS1 TH
        buff[14] = 0xF0
        buff[15] = 0x02
        // PROX_RESOLUTION0-1
        buff[16] = 0x00
        buff[17] = 0x00
        // PROX HYS
        buff[18] = 0x00
        // RESERVED
        buff[19] = 0x00
        // PROX LBR
        buff[20] = 0x00
        // PROX NNT
        buff[21] = 0x00
        // PROX NT
        buff[22] = 0x00
        // PROX POS TH 0 -1
        buff[23] = 0x00
        buff[24] = 0x00
        // RESERVED
        buff[25] = 0x00
        buff[26] = 0x00
        // PROX NEGATIVE TH0 -1
        buff[27] = 0x00
        buff[28] = 0x00
        // RESERVED
        buff[29] = 0x00
        buff[30] = 0x00
        // 61
        buff[31] = 0x00
        pins.i2cWriteBuffer(CHIP_ADDRESS, buff, false)
        //ADRESS
        buff[0] = 0x3E //62
        // BUZZER
        buff[1] = 0x00
        // BUZZER ONT  //63
        buff[2] = 0x00
        // RESERVED
        buff[3] = 0x00
        buff[4] = 0xFF
        buff[5] = 0xFF
        buff[6] = 0xFF
        buff[7] = 0xFF
        buff[8] = 0xFF
        buff[9] = 0xFF
        buff[10] = 0xFF
        buff[11] = 0xFF
        buff[12] = 0x00
        buff[13] = 0x00
        buff[14] = 0x00
        // SPO CFG, NExt time might be 0x20
        buff[15] = 0x00
        // D_CFG0
        buff[16] = 0x03
        // D_CFG1
        buff[17] = 0x01
        // DEVICE CFG 3 
        buff[18] = 0x58
        buff[19] = 0x00
        // 81 I2C address
        buff[20] = 0x37
        // REFRSH CTRL
        buff[21] = 0x06
        // RESERVED
        buff[22] = 0x00
        buff[23] = 0x00
        // STT TIMEOUT
        buff[24] = 0x0A
        // RESERVED
        buff[25] = 0x00
        buff[26] = 0x00
        buff[27] = 0x00
        buff[28] = 0x00
        buff[29] = 0x00
        buff[30] = 0x00
        buff[31] = 0x00
        pins.i2cWriteBuffer(CHIP_ADDRESS, buff, false)
        //ADRESS
        buff[0] = 0x5D //93
        // SLIDERS 115
        buff[1] = 0x00
        buff[2] = 0x00
        buff[3] = 0x00
        buff[4] = 0x00
        buff[5] = 0x00
        buff[6] = 0x00
        buff[7] = 0x00
        buff[8] = 0x00
        buff[9] = 0x00
        buff[10] = 0x00
        buff[11] = 0x00
        buff[12] = 0x00
        buff[13] = 0x00
        buff[14] = 0x00
        buff[15] = 0x00
        buff[16] = 0x00
        buff[17] = 0x00
        buff[18] = 0x00
        buff[19] = 0x00
        buff[20] = 0x00
        buff[21] = 0x00
        buff[22] = 0x00
        buff[23] = 0x00
        // RESERVED
        buff[24] = 0x00
        buff[25] = 0x00
        buff[26] = 0x00
        buff[27] = 0x00
        buff[28] = 0x00
        buff[29] = 0x00
        // SCRATCHPAD0-1 123
        buff[30] = 0x00
        buff[31] = 0x00
        pins.i2cWriteBuffer(CHIP_ADDRESS, buff, false)
        //ADRESS
        buff5[0] = 0x7C //124
        // RESERVED
        buff5[1] = 0x00
        buff5[2] = 0x00
        //CRC
        buff5[3] = 0x87
        buff5[4] = 0x04
        pins.i2cWriteBuffer(CHIP_ADDRESS, buff5, false)
        ///////////////////////////////////////////////
        buff2[0] = CTRL_CMD
        buff2[1] = SAVE_CHECK_CRC
        pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, false)
        control.waitMicros(200000);
        ///////////////////////////////////////////////
        buff2[0] = CTRL_CMD
        buff2[1] = SW_RESET
        pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, false)
        control.waitMicros(200000);
    }

    /**
     * Touch sensor init
     */
    //% blockId="picoBricksTouchInit" block="touch sensor init"
    //% subcategory="Touch Sensor-Piano"
    export function touchInit(): void {
        configureMB()
        
    }

    /**
     * Touch any PicoBricksNotes on touch sensor brick and start to play piano,
     * set "volume buttons" to 1 to enable volume control with "up","down" buttons,
     * set "tone buttons" to 1 to enable tone switch with "left","right" buttons
     */
    //% blockId="picoBricksPlayPiano" block="play piano volume buttons %PicoBricksVolumeStatus and tone buttons %PicoBricksToneStatus"
    //% subcategory="Touch Sensor-Piano"
    export function playPiano(volumeButtons: PicoBricksVolumeStatus, toneButtons: PicoBricksToneStatus): void {
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
        if ((rec_buf[0] & 0x01) != 0) {
            if (++proximityCounter > 30) {
                proximityStatus = 1
                proximityCounter = 0
            }
        }
        else {
            proximityCounter = 0;
            proximityStatus = 0;
        }

        if (((rec_buf[1] & 0x80) != 0) && (toneButtons == 1)) { // left button
            music.playTone(NOTE_D4, noteDuration)
            tone -= 1
        }
        if (((rec_buf[1] & 0x20) != 0) && (toneButtons == 1)) { // right button
            music.playTone(NOTE_D4, noteDuration)
            tone += 1
        }
        if (((rec_buf[1] & 0x10) != 0) && (volumeButtons == 1)) { // up button
            music.playTone(NOTE_D4, noteDuration)
            volume += 1
        }
        if (((rec_buf[1] & 0x40) != 0) && (volumeButtons == 1)) { // down button
            music.playTone(NOTE_D4, noteDuration)
            volume -= 1
        }

        if (tone <= 0)
            tone = 0
        if (tone >= 1)
            tone = 1

        if (volume <= 0)
            volume = 0
        if (volume >= 1)
            volume = 1

        if (volume == 0)
            music.setVolume(100)
        if (volume == 1)
            music.setVolume(255)


        if ((rec_buf[1] & 0x08) != 0) { //C
            if (tone == 0) {
                music.playTone(NOTE_C4, noteDuration)
            }
            else if (tone == 1) {
                music.playTone(NOTE_C5, noteDuration)
            }
        }
        if ((rec_buf[2] & 0x40) != 0) { //D
            if (tone == 0) {
                music.playTone(NOTE_D4, noteDuration)
            }
            else if (tone == 1) {
                music.playTone(NOTE_D5, noteDuration)
            }
        }
        if ((rec_buf[2] & 0x20) != 0) { //E
            if (tone == 0) {
                music.playTone(NOTE_E4, noteDuration)
            }
            else if (tone == 1) {
                music.playTone(NOTE_E5, noteDuration)
            }
        }
        if ((rec_buf[2] & 0x10) != 0) { //F
            if (tone == 0) {
                music.playTone(NOTE_F4, noteDuration)
            }
            else if (tone == 1) {
                music.playTone(NOTE_F5, noteDuration)
            }
        }
        if ((rec_buf[2] & 0x08) != 0) { //G
            if (tone == 0) {
                music.playTone(NOTE_G4, noteDuration)
            }
            else if (tone == 1) {
                music.playTone(NOTE_G5, noteDuration)
            }
        }
        if ((rec_buf[2] & 0x04) != 0) { //A
            if (tone == 0) {
                music.playTone(NOTE_A4, noteDuration)
            }
            else if (tone == 1) {
                music.playTone(NOTE_A5, noteDuration)
            }
        }
        if ((rec_buf[2] & 0x02) != 0) { //B
            if (tone == 0) {
                music.playTone(NOTE_B4, noteDuration)
            }
            else if (tone == 1) {
                music.playTone(NOTE_B5, noteDuration)
            }
        }
        if ((rec_buf[2] & 0x01) != 0) { //C
            if (tone == 0) {
                music.playTone(NOTE_C5, noteDuration)
            }
            else if (tone == 1) {
                music.playTone(NOTE_C6, noteDuration)
            }
        }
        if (((rec_buf[2] & 0x08) == 0) && ((rec_buf[2] & 0xFF) == 0) && ((rec_buf[1] & 0x08) == 0) && ((rec_buf[1] & 0xFF) == 0)) {
            music.playTone(0, noteDuration)
        }
    }

    /**
     * Play the selected note when the selected button is pressed
     */
    //% blockId="picoBricksUserPiano" block="play %pianoKeyAddresses and %PicoBricksNotes"
    //% subcategory="Touch Sensor-Piano"
    export function userPiano(button: pianoKeyAddresses, tone: PicoBricksNotes): void {
        let val = 0;

        pins.i2cWriteNumber(CHIP_ADDRESS, PROX_STAT, NumberFormat.UInt8BE)
        val = pins.i2cReadNumber(CHIP_ADDRESS, NumberFormat.UInt8BE)

        pins.i2cWriteNumber(CHIP_ADDRESS, BUTTON_STATUS, NumberFormat.UInt8BE)
        buff = pins.i2cReadBuffer(CHIP_ADDRESS, 2, false)

        rec_buf[0] = val
        rec_buf[1] = buff[0]
        rec_buf[2] = buff[1]

        if (((rec_buf[1] & 0x02) != 0) && (button == 1)) { // A button
            music.playTone(tone, noteDuration)
        }
        if (((rec_buf[1] & 0x04) != 0) && (button == 2)) { // B button
            music.playTone(tone, noteDuration)
        }
        if (((rec_buf[1] & 0x80) != 0) && (button == 5)) { // left button
            music.playTone(tone, noteDuration)
        }
        if (((rec_buf[1] & 0x20) != 0) && (button == 6)) { // right button
            music.playTone(tone, noteDuration)
        }
        if (((rec_buf[1] & 0x10) != 0) && (button == 3)){ // top button
            music.playTone(tone, noteDuration)
        }
        if (((rec_buf[1] & 0x40) != 0) && (button == 4)) { // down button
            music.playTone(tone, noteDuration)
        }
        if (((rec_buf[1] & 0x08) != 0) && (button == 7)) { //Left C
            music.playTone(tone, noteDuration)
        }
        if (((rec_buf[2] & 0x40) != 0) && (button == 8)) { //D
            music.playTone(tone, noteDuration)
        }
        if (((rec_buf[2] & 0x20) != 0) && (button == 9)) { //E
            music.playTone(tone, noteDuration)
        }
        if (((rec_buf[2] & 0x10) != 0) && (button == 10)) { //F
            music.playTone(tone, noteDuration)
        }
        if (((rec_buf[2] & 0x08) != 0) && (button == 11)) { //G
            music.playTone(tone, noteDuration)
        }
        if (((rec_buf[2] & 0x04) != 0) && (button == 12)) { //A
            music.playTone(tone, noteDuration)
        }
        if (((rec_buf[2] & 0x02) != 0) && (button == 13)) { //B
            music.playTone(tone, noteDuration)
        }
        if (((rec_buf[2] & 0x01) != 0) && (button == 14)) { //Right C
            music.playTone(tone, noteDuration)
        }
        if (((rec_buf[2] & 0x08) == 0) && ((rec_buf[2] & 0xFF) == 0) && ((rec_buf[1] & 0x08) == 0) && ((rec_buf[1] & 0xFF) == 0)) {
            music.playTone(0, noteDuration)
        }
    }

    /**
     * Check if Touch Sensor & Piano buttons successfully pressed
     */
    //% blockId=picoBricksKeyIsPressed
    //% block="key %key|is pressed"
    //% subcategory="Touch Sensor-Piano"
    export function keyIsPressed(key: pianoKeyAddresses): boolean {
        let val = 0;

        pins.i2cWriteNumber(CHIP_ADDRESS, PROX_STAT, NumberFormat.UInt8BE)
        val = pins.i2cReadNumber(CHIP_ADDRESS, NumberFormat.UInt8BE)

        pins.i2cWriteNumber(CHIP_ADDRESS, BUTTON_STATUS, NumberFormat.UInt8BE)
        buff = pins.i2cReadBuffer(CHIP_ADDRESS, 2, false)

        rec_buf[0] = val
        rec_buf[1] = buff[0]
        rec_buf[2] = buff[1]

        if (((rec_buf[1] & 0x02) != 0) && (key == 1)) { // A button
            return true;
        }
        if (((rec_buf[1] & 0x04) != 0) && (key == 2)) { // B button
            return true;
        }
        if (((rec_buf[1] & 0x80) != 0) && (key == 5)) { // left button
            return true;
        }
        if (((rec_buf[1] & 0x20) != 0) && (key == 6)) { // right button
            return true;
        }
        if (((rec_buf[1] & 0x10) != 0) && (key == 3)) { // top button
            return true;
        }
        if (((rec_buf[1] & 0x40) != 0) && (key == 4)) { // down button
            return true;
        }
        if (((rec_buf[1] & 0x08) != 0) && (key == 7)) { //Left C
            return true;
        }
        if (((rec_buf[2] & 0x40) != 0) && (key == 8)) { //D
            return true;
        }
        if (((rec_buf[2] & 0x20) != 0) && (key == 9)) { //E
            return true;
        }
        if (((rec_buf[2] & 0x10) != 0) && (key == 10)) { //F
            return true;
        }
        if (((rec_buf[2] & 0x08) != 0) && (key == 11)) { //G
            return true;
        }
        if (((rec_buf[2] & 0x04) != 0) && (key == 12)) { //A
            return true;
        }
        if (((rec_buf[2] & 0x02) != 0) && (key == 13)) { //B
            return true;
        }
        if (((rec_buf[2] & 0x01) != 0) && (key == 14)) { //Right C
            return true;
        }

        return false;
    }
    
    export enum pianoKeyAddresses {
        //% block="X"
        X = 1,
        //% block="Y"
        Y = 2,
        //% block="Up"
        up = 3,
        //% block="Down"
        down = 4,
        //% block="Left"
        left = 5,
        //% block="Right"
        right = 6,
        //% block="C1"
        C1 = 7,
        //% block="D"
        D = 8,
        //% block="E"
        E = 9,
        //% block="F"
        F = 10,
        //% block="G"
        G = 11,
        //% block="A"
        A = 12,
        //% block="B"
        B = 13,
        //% block="C2"
        C2 = 14
    }

    /**
     * Value of touch sensor buttons
     */
    //% blockId=picoBricksKeyValue
    //% block="key %key|value"
    //% subcategory="Touch Sensor-Piano"
    export function keyValue(key: pianoKeyAddresses): number {
        let val = 0;

        pins.i2cWriteNumber(CHIP_ADDRESS, PROX_STAT, NumberFormat.UInt8BE)
        val = pins.i2cReadNumber(CHIP_ADDRESS, NumberFormat.UInt8BE)

        pins.i2cWriteNumber(CHIP_ADDRESS, BUTTON_STATUS, NumberFormat.UInt8BE)
        buff = pins.i2cReadBuffer(CHIP_ADDRESS, 2, false)

        rec_buf[0] = val
        rec_buf[1] = buff[0]
        rec_buf[2] = buff[1]

        if (((rec_buf[1] & 0x02) != 0) && (key == 1)) { // A button
            return 1;
        }
        if (((rec_buf[1] & 0x04) != 0) && (key == 2)) { // B button
            return 1;
        }
        if (((rec_buf[1] & 0x80) != 0) && (key == 5)) { // left button
            return 1;
        }
        if (((rec_buf[1] & 0x20) != 0) && (key == 6)) { // right button
            return 1;
        }
        if (((rec_buf[1] & 0x10) != 0) && (key == 3)) { // top button
            return 1;
        }
        if (((rec_buf[1] & 0x40) != 0) && (key == 4)) { // down button
            return 1;
        }
        if (((rec_buf[1] & 0x08) != 0) && (key == 7)) { //Left C
            return 1;
        }
        if (((rec_buf[2] & 0x40) != 0) && (key == 8)) { //D
            return 1;
        }
        if (((rec_buf[2] & 0x20) != 0) && (key == 9)) { //E
            return 1;
        }
        if (((rec_buf[2] & 0x10) != 0) && (key == 10)) { //F
            return 1;
        }
        if (((rec_buf[2] & 0x08) != 0) && (key == 11)) { //G
            return 1;
        }
        if (((rec_buf[2] & 0x04) != 0) && (key == 12)) { //A
            return 1;
        }
        if (((rec_buf[2] & 0x02) != 0) && (key == 13)) { //B
            return 1;
        }
        if (((rec_buf[2] & 0x01) != 0) && (key == 14)) { //Right C
            return 1;
        }
        return 0;
    }
}
