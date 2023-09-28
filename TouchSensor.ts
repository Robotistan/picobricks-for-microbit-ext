enum PianoKeyAddresses {
    //% block="K0"
    PIANO_ID_KEY_K0 = 0x100,
    //% block="K1"
    PIANO_ID_KEY_K1 = 0x200,
    //% block="K2"
    PIANO_ID_KEY_K2 = 0x400,
    //% block="K3"
    PIANO_ID_KEY_K3 = 0x800,
    //% block="K4"
    PIANO_ID_KEY_K4 = 0x1000,
    //% block="K5"
    PIANO_ID_KEY_K5 = 0x2000,
    //% block="K6"
    PIANO_ID_KEY_K6 = 0x4000,
    //% block="K7"
    PIANO_ID_KEY_K7 = 0x8000,
    //% block="K8"
    PIANO_ID_KEY_K8 = 0x01,
    //% block="K9"
    PIANO_ID_KEY_K9 = 0x02,
    //% block="K10"
    PIANO_ID_KEY_K10 = 0x04,
    //% block="K11"
    PIANO_ID_KEY_K11 = 0x08,
    //% block="K12"
    PIANO_ID_KEY_K12 = 0x10,
    //% block="K13"
    PIANO_ID_KEY_K13 = 0x20,
    //% block="K14"
    PIANO_ID_KEY_K14 = 0x40
}

namespace PicoBricks {
    const CHIP_ADDRESS = 0x37;
    const PROX_STAT = 0xAE;
    const CY8CMBR3xxx_CCITT16_DEFAULT_SEED = 0xffff;

    let buff = pins.createBuffer(1);
    let buff2 = pins.createBuffer(2);
    let buff3 = pins.createBuffer(5);
    let buff4 = pins.createBuffer(1);
    let buff5 = pins.createBuffer(16);
    let buff6 = pins.createBuffer(15);
    let keySensitivity = 8;
    let keyNoiseThreshold = 5;
    let keyRegValue = 0x0000;
    let initialisedFlag = 0;
    let octaveFlag = 0;
    let noteLength = 500;

    function initPiano(): void {
        pins.setPull(DigitalPin.P1, PinPullMode.PullUp)
        //Startup procedure
        //Test /change pin is low, then test basic communication
        if (pins.digitalReadPin(DigitalPin.P1) == 0) {
            //Reads the chip ID, should be 0x11 (chip ID addr = 0)
            buff[0] = 0
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff, true)
            buff = pins.i2cReadBuffer(CHIP_ADDRESS, 1, false)
            while (buff[0] != 0x11) {
                buff = pins.i2cReadBuffer(CHIP_ADDRESS, 1, false)
            }

            //Change sensitivity (burst length) of keys 0-14 to 8
            buff2[0] = 54
            buff2[1] = keySensitivity
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, true)
            buff2[0] = 55
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, true)
            buff2[0] = 56
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, true)
            buff2[0] = 57
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, true)
            buff2[0] = 58
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, true)
            buff2[0] = 59
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, true)
            buff2[0] = 60
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, true)
            buff2[0] = 61
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, true)
            buff2[0] = 62
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, true)
            buff2[0] = 63
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, true)
            buff2[0] = 64
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, true)
            buff2[0] = 65
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, true)
            buff2[0] = 66
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, true)
            buff2[0] = 67
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, true)
            buff2[0] = 68
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, false)

            //Disable key 15 as it is not used
            buff2[0] = 69
            buff2[1] = 0
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, false)

            //Set Burst Repetition to 5
            buff2[0] = 13
            buff2[1] = keyNoiseThreshold
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, false)

            //Configure Adjacent Key Suppression (AKS) Groups
            //AKS Group 1: ALL KEYS
            buff2[0] = 22
            buff2[1] = 1
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, true)
            buff2[0] = 23
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, true)
            buff2[0] = 24
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, true)
            buff2[0] = 25
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, true)
            buff2[0] = 26
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, true)
            buff2[0] = 27
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, true)
            buff2[0] = 28
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, true)
            buff2[0] = 29
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, true)
            buff2[0] = 30
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, true)
            buff2[0] = 31
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, true)
            buff2[0] = 32
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, true)
            buff2[0] = 33
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, true)
            buff2[0] = 34
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, true)
            buff2[0] = 35
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, true)
            buff2[0] = 36
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, false)

            //Send calibration command
            buff2[0] = 10
            buff2[1] = 1
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff2, false)
        }

        //Read all change status address (General Status addr = 2)
        buff[0] = 2
        pins.i2cWriteBuffer(CHIP_ADDRESS, buff, true)
        buff3 = pins.i2cReadBuffer(CHIP_ADDRESS, 5, false)
        //Continue reading change status address until /change pin goes high
        while (pins.digitalReadPin(DigitalPin.P1) == 0) {
            buff[0] = 2
            pins.i2cWriteBuffer(CHIP_ADDRESS, buff, true)
            buff3 = pins.i2cReadBuffer(CHIP_ADDRESS, 5, false)
        }
        //Uncomment setSilence command when it becomes available in live MakeCode - fixes V2 micro:but humming noise
        music.setSilenceLevel(0)
        initialisedFlag = 1
    }

    function CY8CMBR3xxx_CalculateCrc(): number {
        let messageIndex;
        let byteValue;
        let seed = CY8CMBR3xxx_CCITT16_DEFAULT_SEED;

        return 0;
    }

}