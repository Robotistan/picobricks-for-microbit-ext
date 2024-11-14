//The MIT License (MIT)
//Copyright (c) <2018> microbit/micropython Chinese community
//<https://github.com/makecode-extensions/OLED12864_I2C>
//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//Minor changes made by: Robotistan

namespace picobricks {
    let font = hex`
    0022d422
    0022d422
    0022d422
    0022d422
    0022d422
    0022d422
    0022d422
    0022d422
    0022d422
    0022d422
    0022d422
    0022d422
    0022d422
    0022d422
    0022d422
    0022d422
    0022d422
    0022d422
    0022d422
    0022d422
    0022d422
    0022d422
    0022d422
    0022d422
    0022d422
    0022d422
    0022d422
    0022d422
    0022d422
    0022d422
    0022d422
    0022d422
    00000000
    000002e0
    00018060
    00afabea
    00aed6ea
    01991133
    010556aa
    00000060
    000045c0
    00003a20
    00051140
    00023880
    00002200
    00021080
    00000100
    00111110
    0007462e
    00087e40
    000956b9
    0005d629
    008fa54c
    009ad6b7
    008ada88
    00119531
    00aad6aa
    0022b6a2
    00000140
    00002a00
    0008a880
    00052940
    00022a20
    0022d422
    00e4d62e
    000f14be
    000556bf
    0008c62e
    0007463f
    0008d6bf
    000094bf
    00cac62e
    000f909f
    000047f1
    0017c629
    0008a89f
    0008421f
    01f1105f
    01f4105f
    0007462e
    000114bf
    000b6526
    010514bf
    0004d6b2
    0010fc21
    0007c20f
    00744107
    01f4111f
    000d909b
    00117041
    0008ceb9
    0008c7e0
    01041041
    000fc620
    00010440
    01084210
    00000820
    010f4a4c
    0004529f
    00094a4c
    000fd288
    000956ae
    000097c4
    0007d6a2
    000c109f
    000003a0
    0006c200
    0008289f
    000841e0
    01e1105e
    000e085e
    00064a4c
    0002295e
    000f2944
    0001085c
    00012a90
    010a51e0
    010f420e
    00644106
    01e8221e
    00093192
    00222292
    00095b52
    0008fc80
    000003e0
    000013f1
    00841080
    0022d422`

    let _I2CAddr = 0;
    let _screen = pins.createBuffer(1025);
    let _buf2 = pins.createBuffer(2);
    let _buf3 = pins.createBuffer(3);
    let _buf4 = pins.createBuffer(4);
    let _ZOOM = 1;

    function cmd1(d: number) {
        let n = d % 256;
        pins.i2cWriteNumber(_I2CAddr, n, NumberFormat.UInt16BE);
    }

    function cmd2(d1: number, d2: number) {
        _buf3[0] = 0;
        _buf3[1] = d1;
        _buf3[2] = d2;
        pins.i2cWriteBuffer(_I2CAddr, _buf3);
    }

    function cmd3(d1: number, d2: number, d3: number) {
        _buf4[0] = 0;
        _buf4[1] = d1;
        _buf4[2] = d2;
        _buf4[3] = d3;
        pins.i2cWriteBuffer(_I2CAddr, _buf4);
    }

    function set_pos(col: number = 0, page: number = 0) {
        cmd1(0xb0 | page) // page number
        let c = col * (_ZOOM + 1)
        cmd1(0x00 | (c % 16)) // lower start column address
        cmd1(0x10 | (c >> 4)) // upper start column address    
    }

    // clear bit
    function clrbit(d: number, b: number): number {
        if (d & (1 << b))
            d -= (1 << b)
        return d
    }

    /**
     * set pixel in OLED
     * @param x is X alis, eg: 0
     * @param y is Y alis, eg: 0
     * @param color is dot color, eg: 1
     */
    //% blockId=picoBricksPixel block="set pixel at x %x|y %y|color %color"
    //% weight=70 blockGap=8
    //% parts=OLED12864_I2C trackArgs=0
    //% subcategory="OLED"
    export function pixel(x: number, y: number, color: number = 1) {
        let page = y >> 3
        let shift_page = y % 8
        let ind = x * (_ZOOM + 1) + page * 128 + 1
        let b = (color) ? (_screen[ind] | (1 << shift_page)) : clrbit(_screen[ind], shift_page)
        _screen[ind] = b
        set_pos(x, page)
        if (_ZOOM) {
            _screen[ind + 1] = b
            _buf3[0] = 0x40
            _buf3[1] = _buf3[2] = b
            pins.i2cWriteBuffer(_I2CAddr, _buf3)
        }
        else {
            _buf2[0] = 0x40
            _buf2[1] = b
            pins.i2cWriteBuffer(_I2CAddr, _buf2)
        }
    }

    /**
     * show text in OLED
     * @param x is X alis, eg: 0
     * @param y is Y alis, eg: 0
     * @param s is the text will be show, eg: 'Hello!'
     * @param color is string color, eg: 1
     */
    //% blockId=picoBricksShowString block="show string at x %x|y %y|text %s|color %color"
    //% weight=80 blockGap=8
    //% parts=OLED12864_I2C trackArgs=0
    //% subcategory="OLED"
    export function showString(x: number, y: number, s: string, color: number = 1) {
        let col = 0
        let p = 0
        let ind = 0
        for (let n = 0; n < s.length; n++) {
            p = font[s.charCodeAt(n)]
            for (let i = 0; i < 5; i++) {
                col = 0
                for (let j = 0; j < 5; j++) {
                    if (p & (1 << (5 * i + j)))
                        col |= (1 << (j + 1))
                }
                ind = (x + n) * 5 * (_ZOOM + 1) + y * 128 + i * (_ZOOM + 1) + 1
                if (color == 0)
                    col = 255 - col
                _screen[ind] = col
                if (_ZOOM)
                    _screen[ind + 1] = col
            }
        }
        set_pos(x * 5, y)
        let ind0 = x * 5 * (_ZOOM + 1) + y * 128
        let buf = _screen.slice(ind0, ind + 1)
        buf[0] = 0x40
        pins.i2cWriteBuffer(_I2CAddr, buf)
    }

    /**
     * show a number in OLED
     * @param x is X alis, eg: 0
     * @param y is Y alis, eg: 0
     * @param num is the number will be show, eg: 12
     * @param color is number color, eg: 1
     */
    //% blockId=picoBricksShowNumber block="show a number at x %x|y %y|number %num|color %color"
    //% weight=80 blockGap=8
    //% parts=OLED12864_I2C trackArgs=0
    //% subcategory="OLED"
    export function showNumber(x: number, y: number, num: number, color: number = 1) {
        showString(x, y, num.toString(), color)
    }

    /**
     * draw a horizontal line between 0 and 30
     * @param x is X alis, eg: 0
     * @param y is Y alis, eg: 0
     * @param len is the length of line, eg: 10
     */
    //% blockId=picoBricksHline block="draw a horizontal line at x %x|y %y|length %len"
    //% weight=71 blockGap=8
    //% parts=OLED12864_I2C trackArgs=0
    //% subcategory="OLED"
    export function hline(x: number, y: number, len: number) {
        for (let i = x; i < (x + len); i++)
            pixel(i, y, 1)
    }

    /**
     * draw a vertical line between 0 and 30
     * @param x is X alis, eg: 0
     * @param y is Y alis, eg: 0
     * @param len is the length of line, eg: 10
     */
    //% blockId=picoBricksVline block="draw a vertical line at x %x|y %y|length %len"
    //% weight=72 blockGap=8
    //% parts=OLED12864_I2C trackArgs=0
    //% subcategory="OLED"
    export function vline(x: number, y: number, len: number) {
        for (let i = y; i < (y + len); i++)
            pixel(x, i, 1)
    }

    /**
     * draw a rectangle
     * @param x1 is X alis, eg: 0
     * @param y1 is Y alis, eg: 0
     * @param x2 is X alis, eg: 60
     * @param y2 is Y alis, eg: 30
     * @param color is line color, eg: 1
     */
    //% blockId=picoBricksRect block="draw a rectangle at x1 %x1|y1 %y1|x2 %x2|y2 %y2|color %color"
    //% weight=73 blockGap=8
    //% parts=OLED12864_I2C trackArgs=0
    //% subcategory="OLED"
    export function rect(x1: number, y1: number, x2: number, y2: number, color: number = 1) {
        if (x1 > x2)
            x1 = [x2, x2 = x1][0];
        if (y1 > y2)
            y1 = [y2, y2 = y1][0];
        hline(x1, y1, x2 - x1 + 1)
        hline(x1, y2, x2 - x1 + 1)
        vline(x1, y1, y2 - y1 + 1)
        vline(x2, y1, y2 - y1 + 1)
    }

    /**
     * invert display
     * @param d true: invert / false: normal, eg: true
     */
    //% blockId=picoBricksOledInvert block="invert display %d"
    //% weight=65 blockGap=8
    //% parts=OLED12864_I2C trackArgs=0
    //% subcategory="OLED"
    export function oledInvert(d: boolean = true) {
        let n = (d) ? 0xA7 : 0xA6
        cmd1(n)
    }

    /**
     * draw / redraw screen
     */
    //% blockId=picoBricksDraw block="draw"
    //% weight=64 blockGap=8
    //% parts=OLED12864_I2C trackArgs=0
    //% subcategory="OLED"
    export function draw() {
        set_pos()
        pins.i2cWriteBuffer(_I2CAddr, _screen)
    }

    /**
     * clear screen
     */
    //% blockId=picoBricksOledClear block="clear"
    //% weight=63 blockGap=8
    //% parts=OLED12864_I2C trackArgs=0
    //% subcategory="OLED"
    export function oledclear() {
        _screen.fill(0)
        _screen[0] = 0x40
        draw()
    }

    /**
     * turn on screen
     */
    //% blockId=picoBricksOledOn block="turn on"
    //% weight=62 blockGap=8
    //% parts=OLED12864_I2C trackArgs=0
    //% subcategory="OLED"
    export function oledon() {
        cmd1(0xAF)
    }

    /**
     * turn off screen
     */
    //% blockId=picoBricksOledOff block="turn off"
    //% weight=61 blockGap=8
    //% parts=OLED12864_I2C trackArgs=0
    //% subcategory="OLED"
    export function oledoff() {
        cmd1(0xAE)
    }

    /**
     * zoom mode
     * @param d true zoom / false normal, eg: true
     */
    //% blockId=picoBricksOledZoom block="zoom %d"
    //% weight=60 blockGap=8
    //% parts=OLED12864_I2C trackArgs=0
    //% subcategory="OLED"
    export function oledzoom(d: boolean = true) {
        _ZOOM = (d) ? 1 : 0
        cmd2(0xd6, _ZOOM)
    }

    /**
     * OLED initialize
     * @param addr is i2c addr, eg: 60
     */
    //% blockId=picoBricksOledInit block="init OLED with addr %addr"
    //% weight=100 blockGap=8
    //% parts=OLED12864_I2C trackArgs=0
    //% subcategory="OLED"
    export function oledinit(addr: number) {
        _I2CAddr = addr;
        cmd1(0xAE)       // SSD1306_DISPLAYOFF
        cmd1(0xA4)       // SSD1306_DISPLAYALLON_RESUME
        cmd2(0xD5, 0xF0) // SSD1306_SETDISPLAYCLOCKDIV
        cmd2(0xA8, 0x3F) // SSD1306_SETMULTIPLEX
        cmd2(0xD3, 0x00) // SSD1306_SETDISPLAYOFFSET
        cmd1(0 | 0x0)    // line #SSD1306_SETSTARTLINE
        cmd2(0x8D, 0x14) // SSD1306_CHARGEPUMP
        cmd2(0x20, 0x00) // SSD1306_MEMORYMODE
        cmd3(0x21, 0, 127) // SSD1306_COLUMNADDR
        cmd3(0x22, 0, 63)  // SSD1306_PAGEADDR
        cmd1(0xa0 | 0x1) // SSD1306_SEGREMAP
        cmd1(0xc8)       // SSD1306_COMSCANDEC
        cmd2(0xDA, 0x12) // SSD1306_SETCOMPINS
        cmd2(0x81, 0xCF) // SSD1306_SETCONTRAST
        cmd2(0xd9, 0xF1) // SSD1306_SETPRECHARGE
        cmd2(0xDB, 0x40) // SSD1306_SETVCOMDETECT
        cmd1(0xA6)       // SSD1306_NORMALDISPLAY
        cmd2(0xD6, 1)    // zoom on
        cmd1(0xAF)       // SSD1306_DISPLAYON
        oledclear()
        _ZOOM = 1
    }
}
