# Picobricks for Micro:Bit

Picobricks for Micro:Bit teaches kids and adults coding, electronics basics and advanced technology while providing a fun and fascinating experience filled with project. 
[Click Here to Explore PicoBricks for micro:bit](https://picobricks.com/pages/kickstarter)

## Blocks

* Piano And Gaming Brick : This touchpad module is designed to offer makers an interactive and ecciting world.
* Micro:Bit Brick : It is a module that will enable Micro:Bit to connect to Picobricks more easily.
* Oled Screen Brick ([source](https://github.com/makecode-extensions/OLED12864_I2C)) : This is the area where you will show the degrees you measured in Picobircks for Micro:Bit.
* RGB LED Brick ([source](https://github.com/microsoft/pxt-neopixel)) : This bricks will allow you to turn routine notifications into a colorful show instead of receiving them in a boring way.
* Gesture Brick : This module is your ticket to transforming mundane routines into an extraordinary experience.
* PIR Brick (IR Motion Brick) : This sensor aims to add some excitement to every moment, instead of boring routine motion detection.
* Relay Brick : This brick puts control of electrical devices in your hands and makes your life more comfortable.
* Motor Driver Brick : This birck allows to control 2 DC and 4 Servo motors at the same time.
* Wireless Brick ([source](https://github.com/cytrontechnologies/pxt-esp8266)) : This brick allows you to push the boundaries of the entertainment world with wifi.
* Temperature And Humidity Brick : This brick is designed to measure and monitor temprature and humidity levels.
* LDR Module (Light Sensor) : This brick allows you to make projects by detecting the level of light around you.
* Button And Potentiometer Module : This brick aloows control of button and potentiometer.  

## Examples

Show red color all rgb leds.

```blocks
let strip = picobricks.create(DigitalPin.P8, 3)
basic.forever(function () {
    strip.showColor(picobricks.colors(rgbColors.Red))
```

Read color and scroll on the micro:bit screen.

```blocks
picobricks.initGesture(sensorinit.color)
basic.forever(function () {
    basic.showString(picobricks.readColor())
})
```

Scroll button state on the micro:bit screen. (0 or 1)

```blocks
basic.forever(function () {
    basic.showNumber(picobricks.buttonRead())
})
```

Set 90 degree angle to servo 1 motor.

```blocks
basic.forever(function () {
    picobricks.servomotor(servoMotorType.Servo1, 90)
})
```

Play piano.

```blocks
picobricks.touchInit()
basic.forever(function () {
    picobricks.play()
})
```

Draw smile icon on micro:bit when the selected IR controller button is pressed.

```blocks
picobricks.onIrButton(irButtonList.Number_1, irButtonAction.Pressed, function () {
    basic.showIcon(IconNames.Heart)
})
picobricks.connectIrReceiver(DigitalPin.P15)
```

Scroll temperature value on the micro:bit screen.

```blocks
picobricks.shtcInit()
basic.forever(function () {
    basic.showNumber(picobricks.temperature())
})
```

Show text on OLED.

```blocks
picobricks.init(60)
basic.forever(function () {
    picobricks.showString(
    0,
    0,
    "Hello!",
    1
    )
})
```

## Meta

Questions? [Email us](mailto:support@picobricks.com)

Keywords: picobricks, microbit

## License

This software made available under the MIT open source license.

## Supported targets

* for microbit v1 and microbit v2
