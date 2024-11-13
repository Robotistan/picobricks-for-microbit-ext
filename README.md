# Picobricks for Micro:Bit

Picobricks for Micro:Bit teaches kids and adults coding, electronics basics and advanced technology while providing a fun and fascinating experience filled with project. 
[Click Here to Explore PicoBricks for micro:bit Kits](https://picobricks.com/collections/micro-bit-kits)

## Blocks

* Piano And Gaming Brick : This touchpad module is designed to offer makers an interactive and ecciting world.
* Micro:Bit Brick : It is a module that will enable Micro:Bit to connect to Picobricks more easily.
* Oled Screen Brick ([source](https://github.com/makecode-extensions/OLED12864_I2C)) : This is the area where you will show the degrees you measured in Picobircks for Micro:Bit.
* RGB LED Brick ([source](https://github.com/microsoft/pxt-neopixel)) : This bricks will allow you to turn routine notifications into a colorful show instead of receiving them in a boring way.
* Gesture Brick : This module is your ticket to transforming mundane routines into an extraordinary experience.
* Motion Brick : This sensor aims to add some excitement to every moment, instead of boring routine motion detection.
* Relay Brick : This brick puts control of electrical devices in your hands and makes your life more comfortable.
* Motor Driver Brick : This birck allows to control 2 DC and 4 Servo motors at the same time.
* Wireless Brick ([source](https://github.com/cytrontechnologies/pxt-esp8266)) : This brick allows you to push the boundaries of the entertainment world with wifi.
* Temperature And Humidity Brick : This brick is designed to measure and monitor temprature and humidity levels.
* LDR (Light Sensor) Brick : This brick allows you to make projects by detecting the level of light around you.
* Button And Potentiometer Brick : This brick aloows control of button and potentiometer.  

## Examples

* Oled Screen Brick : This is the area where you will show the degrees which you measured in Picobricks for Micro:Bit or any words. Let's write Hello on oled screen.                  

```blocks
picobricks.oledinit(60)
basic.forever(function () {
    picobricks.showString(
        0,
        0,
        "Hello!",
        1
    )
})
```

* RGB LED Brick : Here is the RGB LED bricks where notifiations are full of colorful explosions and at the same time it has a party atmosphere! Let's color red to all LEDS.

```blocks
let strip = picobricks.create(DigitalPin.P8, 3)
basic.forever(function () {
    strip.showColor(picobricks.rgbcolors(PicoBricksRgbColorsList.Red))
})
```

* Gesture Brick : This brick is your ticket to transforming mundane routines into an extraordinary experience. Let's show something to sensor and name of color scrolls on Micro:Bit screen.
 Read color and scroll on the Micro:Bit screen.

```blocks
picobricks.initGesture(PicoBricksGestureInitType.Color)
basic.forever(function () {
    basic.showString(picobricks.readColor())
})
```

* Button And Potentiometer Brick : Simple button can actually be the key to great power. Let's press button and result scrolls on Micro:Bit Screen. (0 or 1)

```blocks
basic.forever(function () {
    basic.showNumber(picobricks.buttonRead())
})
```

* Motor Driver Brick : This brick is not just a motor driver but also a tool to push the limits of your imagination and enjoy directing movement. Let's set 90 degree angle to servo 1 motor.

```blocks
basic.forever(function () {
    picobricks.servoMotor(PicoBricksServoMotorType.Servo1, 90)
})
```

* Piano And Gaming Brick : This brick designed of offer makers an interactive and exciting world. Let's play piano.

```blocks
picobricks.touchInit()
basic.forever(function () {
    picobricks.playPiano(PicoBricksVolumeStatus.Passive, PicoBricksToneStatus.Passive)
})
```

* Wireless Brick : This brick allows you create new and exciting experiences by using wireless communication. Draw smile icon on Micro:Bit when the selected IR controller button is pressed.

```blocks
picobricks.onIrButton(PicoBricksIrButtonList.Number_1, PicoBricksIrButtonAction.Pressed, function () {
    basic.showIcon(IconNames.Heart)
})
picobricks.connectIrReceiver(DigitalPin.P15)
```

* Temperature And Humidity Brick : This brick is designed to measure and monitor temperature and humidity levels. Let's scroll temperature value on the Micro:Bit screen.

```blocks
picobricks.shtcInit()
basic.forever(function () {
    basic.showNumber(picobricks.temperature(PicoBricksTempList.Celsius))
})
```

## Education Material and Tutorials

[PicoBricks for Micro:Bit MakeCode Project Book](https://rbt.ist/makecodeprojectbook)


## Meta

Questions? [Email us](mailto:support@picobricks.com)

Keywords: picobricks, microbit

## License

This software made available under the MIT open source license.

## Supported targets

* for microbit v1 and microbit v2
