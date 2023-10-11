enum Notes {
    Low_Do = 131,
    Low_Re = 147,
    Low_Mi = 165,
    Low_Fa = 175,
    Low_Sol = 196,
    Low_La = 220,
    Low_Si = 247,
    Middle_Do = 262,
    Middle_Re = 294,
    Middle_Mi = 330,
    Middle_Fa = 349,
    Middle_Sol = 392,
    Middle_La = 440,
    Middle_Si = 494,
    High_Do = 523,
    High_Re = 587,
    High_Mi = 659,
    High_Fa = 698,
    High_Sol = 784,
    High_La = 880,
    High_Si = 988
}

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
    let buff = pins.createBuffer(3);
    let tone = 0;
    let volume = 0;
    let noteDuration = 0;

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

        if ((rec_buf[1] & 0x02) != 0) { // A button
            music.play(music.stringPlayable("B4 A4 G4 A4 C5 0 D5 C5 B4 C5 E5 0 F5 E5 D5 E5 B5 A5 G5 A5 B5 A5 G5 A5 C6 0 A5 C6 GS5 AS5 B5 A5 G5 A5 GS5 AS5 B5 A5 G5 A5 GS5 AS5 B5 A5 G5 F5 E5 0", 400), music.PlaybackMode.UntilDone)
        }
        if ((rec_buf[1] & 0x04) != 0) { // B button
            music.play(music.stringPlayable("B4 A4 G4 A4 C5 0 D5 C5 B4 C5 E5 0 F5 E5 D5 E5 B5 A5 G5 A5 B5 A5 G5 A5 C6 0 A5 C6 GS5 AS5 B5 A5 G5 A5 GS5 AS5 B5 A5 G5 A5 GS5 AS5 B5 A5 G5 F5 E5 0", 400), music.PlaybackMode.InBackground)
        }
        if ((rec_buf[1] & 0x80) != 0) { // left button
            music.playTone(NOTE_D4, noteDuration)
            tone -= 1
        }
        if ((rec_buf[1] & 0x20) != 0) { // right button
            music.playTone(NOTE_D4, noteDuration)
            tone += 1
        }
        if ((rec_buf[1] & 0x10) != 0) { // top button
            music.playTone(NOTE_D4, noteDuration)
            volume += 1
        }
        if ((rec_buf[1] & 0x40) != 0) { // down button
            music.playTone(NOTE_D4, noteDuration)
            volume -= 1
        }

        if(tone <= 0)
            tone = 0
        if(tone >= 1)
            tone =1

        if (volume <= 0)
            volume = 0
        if (volume >= 1)
            volume = 1

        if(volume == 0)
            music.setVolume(100)
        if (volume == 1)
            music.setVolume(255)


        if ((rec_buf[1] & 0x08) != 0) { //C
            if (tone == 0){
                music.playTone(NOTE_C4, noteDuration)
            }
            else if (tone == 1){
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

    //% block="Play %PianoKeyAddresses and %Notes"
    //% subcategory="Touch Sensor-Piano"
    export function User_Piano(button: PianoKeyAddresses, tone: Notes): void {
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

    //% block="Key %key|is pressed"
    //% subcategory="Touch Sensor-Piano"
    export function keyIsPressed(key: PianoKeyAddresses): boolean {
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
    export enum PianoKeyAddresses {
        //% block="Touch_A"
        Touch_A = 1,
        //% block="Touch_B"
        Touch_B = 2,
        //% block="Up"
        Up = 3,
        //% block="Down"
        Down = 4,
        //% block="Left"
        Left = 5,
        //% block="Right"
        Right = 6,
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

}