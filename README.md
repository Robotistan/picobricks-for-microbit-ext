# Picobricks for Micro:Bit

Picobricks for Micro:Bit teaches kids and adults coding, electronics basics and advanced technology while providing a fun and fascinating experience filled with project. 
[Click Here to Explore PicoBricks for micro:bit](https://picobricks.com/pages/kickstarter)

## Blocks

* Piano And Gaming Brick : This touchpad module is designed to offer makers an interactive and ecciting world.
* Micro:Bit Brick : It is a module that will enable Micro:Bit to connect to Picobricks more easily.
* Oled Screen Brick ([source](https://github.com/tinkertanker/pxt-oled-ssd1306)) : This is the area where you will show the degrees you measured in Picobircks for Micro:Bit.
* RGB LED Brick ([source](https://github.com/microsoft/pxt-neopixel)) : This bricks will allow you to turn routine notifications into a colorful show instead of receiving them in a boring way.
* Action Brick : This module is your ticket to transforming mundane routines into an extraordinary experience.
* PIR Brick (IR Motion Brick) : This sensor aims to add some excitement to every moment, instead of boring routine motion detection.
* Relay Brick : This brick puts control of electrical devices in your hands and makes your life more comfortable.
* Motor Driver Brick : This birck allows to control 2 DC and 4 Servo motors at the same time.
* Wireless Brick ([source](https://github.com/cytrontechnologies/pxt-esp8266)) : This brick allows you to push the boundaries of the entertainment world with wifi.
* Temperature And Humidity Brick : This brick is designed to measure and monitor temprature and humidity levels.
* LDR Module (Light Sensor) : This brick allows you to make projects by detecting the level of light around you.
* Button And Potentiometer Module : This brick aloows control of button and potentiometer.  

## Examples

In this example, you can use and control action brick, oled brick, temperature - humidity brick and LDR brick. Micro:bit screen will show way of gesture and oled bricks will show temperature, humidity and light value every 5 seconds.

```blocks
PicoBricks.onGesture(GESTURE_TYPE.Left, function () {
    basic.showLeds(`
        . . # . .
        . # . . .
        # # # # #
        . # . . .
        . . # . .
        `)
})
PicoBricks.onGesture(GESTURE_TYPE.Up, function () {
    basic.showLeds(`
        . . # . .
        . # # # .
        # . # . #
        . . # . .
        . . # . .
        `)
})
PicoBricks.onGesture(GESTURE_TYPE.Right, function () {
    basic.showLeds(`
        . . # . .
        . . . # .
        # # # # #
        . . . # .
        . . # . .
        `)
})
PicoBricks.onGesture(GESTURE_TYPE.Down, function () {
    basic.showLeds(`
        . . # . .
        . . # . .
        # . # . #
        . # # # .
        . . # . .
        `)
})
PicoBricks.initOled(128, 64)
PicoBricks.shtcInit()
PicoBricks.initGesture(SENSORINIT.Gesture)
basic.forever(function () {
    PicoBricks.clear()
    basic.pause(5000)
    PicoBricks.writeStringNewLine("Temprature")
    PicoBricks.writeNumNewLine(PicoBricks.temperature())
    PicoBricks.writeStringNewLine("Humidity")
    PicoBricks.writeNumNewLine(PicoBricks.humidity())
    PicoBricks.writeStringNewLine("Light Sensor")
    PicoBricks.writeNumNewLine(PicoBricks.ldrRead())
    basic.pause(5000)
})
```


## Meta

Questions? [Email us](mailto:support@picobricks.com)

Keywords: picobricks, microbit

## License

This software made available under the MIT open source license.

## Supported targets

* for microbit v1 and microbit v2
