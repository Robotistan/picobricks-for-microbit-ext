const enum PicoBricksIrButtonList {
    //% block="1"
    Number_1 = 162,
    //% block="2"
    Number_2 = 98,
    //% block="3"
    Number_3 = 226,
    //% block="4"
    Number_4 = 34,
    //% block="5"
    Number_5 = 2,
    //% block="6"
    Number_6 = 194,
    //% block="7"
    Number_7 = 224,
    //% block="8"
    Number_8 = 168,
    //% block="9"
    Number_9 = 144,
    //% block="*"
    Star = 104,
    //% block="0"
    Number_0 = 152,
    //% block="#"
    Hash = 176,
    //% block=" "
    Unused_4 = -4,
    //% block="^"
    Up = 24,
    //% block=" "
    Unused_2 = -2,
    //% block="<"
    Left = 16,
    //% block="OK"
    Ok = 56,
    //% block=">"
    Right = 90,
    //% block=" "
    Unused_3 = -3,
    //% block="v"
    Down = 74,
    //% block="any"
    Any = -1,
}

const enum PicoBricksIrButtonAction {
    //% block="pressed"
    Pressed = 0,
    //% block="released"
    Released = 1,
}

namespace picobricks {
    let irState: irState;

    const IR_REPEAT = 256;
    const IR_INCOMPLETE = 257;
    const IR_DATAGRAM = 258;

    const REPEAT_TIMEOUT_MS = 120;

    interface irState {
        hasNewDatagram: boolean;
        bitsReceived: uint8;
        addressSectionBits: uint16;
        commandSectionBits: uint16;
        hiword: uint16;
        loword: uint16;
        activeCommand: number;
        repeatTimeout: number;
        onIrButtonPressed: IrButtonHandler[];
        onIrButtonReleased: IrButtonHandler[];
        onIrDatagram: () => void;
    }
    class IrButtonHandler {
        irButton: PicoBricksIrButtonList ;
        onEvent: () => void;

        constructor(
            irButton: PicoBricksIrButtonList ,
            onEvent: () => void
        ) {
            this.irButton = irButton;
            this.onEvent = onEvent;
        }
    }

    function appendBitToDatagram(bit: number): number {
        irState.bitsReceived += 1;

        if (irState.bitsReceived <= 8) {
            irState.hiword = (irState.hiword << 1) + bit;
        } else if (irState.bitsReceived <= 16) {
            irState.hiword = (irState.hiword << 1) + bit;
        } else if (irState.bitsReceived <= 32) {
            irState.loword = (irState.loword << 1) + bit;
        }

        if (irState.bitsReceived === 32) {
            irState.addressSectionBits = irState.hiword & 0xffff;
            irState.commandSectionBits = irState.loword & 0xffff;
            return IR_DATAGRAM;
        } else {
            return IR_INCOMPLETE;
        }
    }

    function decode(markAndSpace: number): number {
        if (markAndSpace < 1600) {
            return appendBitToDatagram(0);
        } else if (markAndSpace < 2700) {
            return appendBitToDatagram(1);
        }

        irState.bitsReceived = 0;

        if (markAndSpace < 12500) {
            return IR_REPEAT;
        } else if (markAndSpace < 14500) {
            return IR_INCOMPLETE;
        } else {
            return IR_INCOMPLETE;
        }
    }

    function enableIrMarkSpaceDetection(pin: DigitalPin) {
        pins.setPull(pin, PinPullMode.PullNone);

        let mark = 0;
        let space = 0;

        pins.onPulsed(pin, PulseValue.Low, () => {
            mark = pins.pulseDuration();
        });

        pins.onPulsed(pin, PulseValue.High, () => {
            space = pins.pulseDuration();
            const status = decode(mark + space);

            if (status !== IR_INCOMPLETE) {
                handleIrEvent(status);
            }
        });
    }

    function handleIrEvent(irEvent: number) {
        if (irEvent === IR_DATAGRAM || irEvent === IR_REPEAT) {
            irState.repeatTimeout = input.runningTime() + REPEAT_TIMEOUT_MS;
        }
        if (irEvent === IR_DATAGRAM) {
            irState.hasNewDatagram = true;
            if (irState.onIrDatagram) {
                background.schedule(irState.onIrDatagram, background.thread.UserCallback, background.irMode.Once, 0);
            }
            const newCommand = irState.commandSectionBits >> 8;
            if (newCommand !== irState.activeCommand) {
                if (irState.activeCommand >= 0) {
                    const releasedHandler = irState.onIrButtonReleased.find(h => h.irButton === irState.activeCommand || PicoBricksIrButtonList .Any === h.irButton);
                    if (releasedHandler) {
                        background.schedule(releasedHandler.onEvent, background.thread.UserCallback, background.irMode.Once, 0);
                    }
                }
                const pressedHandler = irState.onIrButtonPressed.find(h => h.irButton === newCommand || PicoBricksIrButtonList .Any === h.irButton);
                if (pressedHandler) {
                    background.schedule(pressedHandler.onEvent, background.thread.UserCallback, background.irMode.Once, 0);
                }
                irState.activeCommand = newCommand;
            }
        }
    }

    function initIrState() {
        if (irState) {
            return;
        }
        irState = {
            bitsReceived: 0,
            hasNewDatagram: false,
            addressSectionBits: 0,
            commandSectionBits: 0,
            hiword: 0, 
            loword: 0,
            activeCommand: -1,
            repeatTimeout: 0,
            onIrButtonPressed: [],
            onIrButtonReleased: [],
            onIrDatagram: undefined,
        };
    }

    /**
     * Connect IR receiver
     * @param pin digital input pin where IR sensor is connected, eg: DigitalPin.P15
     */
    //% blockId=picoBricksConnectIrReceiver
    //% block="connect IR receiver at pin %pin"
    //% subcategory="IR Receiver"
    //% weight=90
    export function connectIrReceiver(pin: DigitalPin): void {
        initIrState();

        enableIrMarkSpaceDetection(pin);
        background.schedule(notifyIrEvents, background.thread.Priority, background.irMode.Repeat, REPEAT_TIMEOUT_MS);
    }

    function notifyIrEvents() {
        if (irState.activeCommand === -1) {
        } else {
            const now = input.runningTime();
            if (now > irState.repeatTimeout) {
                const handler = irState.onIrButtonReleased.find(h => h.irButton === irState.activeCommand || PicoBricksIrButtonList .Any === h.irButton);
                if (handler) {
                    background.schedule(handler.onEvent, background.thread.UserCallback, background.irMode.Once, 0);
                }
                irState.bitsReceived = 0;
                irState.activeCommand = -1;
            }
        }
    }

    /**
     * When the selected IR controller button is pressed
     */
    //% subcategory="IR Receiver"
    //% blockId=picoBricksOnIrButton
    //% block="on IR button | %button | %action"
    //% button.fieldEditor="gridpicker"
    //% button.fieldOptions.columns=3
    //% button.fieldOptions.tooltips="false"
    //% weight=80
    export function onIrButton(button: PicoBricksIrButtonList , action: PicoBricksIrButtonAction, handler: () => void) {
        initIrState();
        if (action === PicoBricksIrButtonAction.Pressed) {
            irState.onIrButtonPressed.push(new IrButtonHandler(button, handler));
        }
        else {
            irState.onIrButtonReleased.push(new IrButtonHandler(button, handler));
        }
    }

    /**
     * Value of the selected IR Controller button
     */
    //% subcategory="IR Receiver"
    //% blockId=picoBricksSelectIrButton
    //% block="select IR button"
    //% weight=20
    export function selectIrButton(): string {
        basic.pause(0); 
        if ((irState.commandSectionBits >> 8) == 162)
            return "1"
        else if ((irState.commandSectionBits >> 8) == 98)
            return "2"
        else if ((irState.commandSectionBits >> 8) == 226)
            return "3"
        else if ((irState.commandSectionBits >> 8) == 34)
            return "4"
        else if ((irState.commandSectionBits >> 8) == 2)
            return "5"
        else if ((irState.commandSectionBits >> 8) == 194)
            return "6"
        else if ((irState.commandSectionBits >> 8) == 224)
            return "7"
        else if ((irState.commandSectionBits >> 8) == 168)
            return "8"
        else if ((irState.commandSectionBits >> 8) == 144)
            return "9"
        else if ((irState.commandSectionBits >> 8) == 152)
            return "0"
        else if ((irState.commandSectionBits >> 8) == 104)  
            return "*"
        else if ((irState.commandSectionBits >> 8) == 176) 
            return "#"
        else if ((irState.commandSectionBits >> 8) == 24)   
            return "Up"
        else if ((irState.commandSectionBits >> 8) == 74)   
            return "Down"
        else if ((irState.commandSectionBits >> 8) == 16)   
            return "Left"
        else if ((irState.commandSectionBits >> 8) == 90) 
            return "Right"
        else if ((irState.commandSectionBits >> 8) == 56)  
            return "Ok"
        else
            return "0"
    }

    /**
     * Returns the value (True or False) when any button on the IR remote control is pressed
     */
    //% subcategory="IR Receiver"
    //% blockId=picoBricksWasIrDataReceived
    //% block="IR data was received"
    //% weight=70
    export function wasIrDataReceived(): boolean {
        basic.pause(0); 
        initIrState();
        if (irState.hasNewDatagram) {
            irState.hasNewDatagram = false;
            return true;
        } else {
            return false;
        }
    }

    /**
     * Code of the selected IR controller button
     */
    //% subcategory="IR Receiver"
    //% blockId=picoBricksIrButtonCode
    //% button.fieldEditor="gridpicker"
    //% button.fieldOptions.columns=3
    //% button.fieldOptions.tooltips="false"
    //% block="IR button code %button"
    //% weight=60
    export function irButtonCode(button: PicoBricksIrButtonList ): number {
        basic.pause(0); 
        return button as number;
    }

    function ir_rec_to16BitHex(value: number): string {
        let hex = "";
        for (let pos = 0; pos < 4; pos++) {
            let remainder = value % 16;
            if (remainder < 10) {
                hex = remainder.toString() + hex;
            } else {
                hex = String.fromCharCode(55 + remainder) + hex;
            }
            value = Math.idiv(value, 16);
        }
        return hex;
    }

    export namespace background {
        export enum thread {
            Priority = 0,
            UserCallback = 1,
        }

        export enum irMode {
            Repeat,
            Once,
        }

        class Executor {
            _newJobs: Job[] = undefined;
            _jobsToRemove: number[] = undefined;
            _pause: number = 100;
            _type: thread;

            constructor(type: thread) {
                this._type = type;
                this._newJobs = [];
                this._jobsToRemove = [];
                control.runInParallel(() => this.loop());
            }

            push(task: () => void, delay: number, mode: irMode): number {
                if (delay > 0 && delay < this._pause && mode === irMode.Repeat) {
                    this._pause = Math.floor(delay);
                }
                const job = new Job(task, delay, mode);
                this._newJobs.push(job);
                return job.id;
            }

            cancel(jobId: number) {
                this._jobsToRemove.push(jobId);
            }

            loop(): void {
                const _jobs: Job[] = [];

                let previous = control.millis();

                while (true) {
                    const now = control.millis();
                    const delta = now - previous;
                    previous = now;

                    this._newJobs.forEach(function (job: Job, index: number) {
                        _jobs.push(job);
                    });
                    this._newJobs = [];
                    this._jobsToRemove.forEach(function (jobId: number, index: number) {
                        for (let i = _jobs.length - 1; i >= 0; i--) {
                            const job = _jobs[i];
                            if (job.id == jobId) {
                                _jobs.removeAt(i);
                                break;
                            }
                        }
                    });
                    this._jobsToRemove = []
                    if (this._type === thread.Priority) {
                        for (let i = _jobs.length - 1; i >= 0; i--) {
                            if (_jobs[i].run(delta)) {
                                this._jobsToRemove.push(_jobs[i].id)
                            }
                        }
                    } else {
                        for (let i = 0; i < _jobs.length; i++) {
                            if (_jobs[i].run(delta)) {
                                this._jobsToRemove.push(_jobs[i].id)
                            }
                        }
                    }
                    basic.pause(this._pause);
                }
            }
        }

        class Job {
            id: number;
            func: () => void;
            delay: number;
            remaining: number;
            mode: irMode;

            constructor(func: () => void, delay: number, mode: irMode) {
                this.id = randint(0, 2147483647)
                this.func = func;
                this.delay = delay;
                this.remaining = delay;
                this.mode = mode;
            }

            run(delta: number): boolean {
                if (delta <= 0) {
                    return false;
                }

                this.remaining -= delta;
                if (this.remaining > 0) {
                    return false;
                }

                switch (this.mode) {
                    case irMode.Once:
                        this.func();
                        basic.pause(0);
                        return true;
                    case irMode.Repeat:
                        this.func();
                        this.remaining = this.delay;
                        basic.pause(0);
                        return false;
                }
            }
        }

        const queues: Executor[] = [];

        export function schedule(func: () => void, type: thread,
            mode: irMode,
            delay: number,
        ): number {
            if (!func || delay < 0) return 0;

            if (!queues[type]) {
                queues[type] = new Executor(type);
            }

            return queues[type].push(func, delay, mode);
        }

        export function remove(type: thread, jobId: number): void {
            if (queues[type]) {
                queues[type].cancel(jobId);
            }
        }
    }
}
