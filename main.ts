namespace PicoBricks {


}
PicoBricks.TouchInit()
basic.forever(function () {
    if (PicoBricks.keyIsPressed(PicoBricks.PianoKeyAddresses.E)) {
        basic.showIcon(IconNames.Yes)
    } else {
        basic.showIcon(IconNames.No)
    }
})
