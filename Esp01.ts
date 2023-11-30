namespace PicoBricks {
    let rxData = ""
    let espinit = false
    let telegramMessageSent = false
    let thingspeakUploaded = false

    const TELEGRAM_API_URL = "api.telegram.org"
    const THINGSPEAK_API_URL = "api.thingspeak.com"

    function urlformat(url: string): string {
        url = url.replaceAll("%", "%25")
        url = url.replaceAll(" ", "%20")
        url = url.replaceAll("!", "%21")
        url = url.replaceAll("\"", "%22")
        url = url.replaceAll("#", "%23")
        url = url.replaceAll("$", "%24")
        url = url.replaceAll("&", "%26")
        url = url.replaceAll("'", "%27")
        url = url.replaceAll("(", "%28")
        url = url.replaceAll(")", "%29")
        url = url.replaceAll("*", "%2A")
        url = url.replaceAll("+", "%2B")
        url = url.replaceAll(",", "%2C")
        url = url.replaceAll("-", "%2D")
        url = url.replaceAll(".", "%2E")
        url = url.replaceAll("/", "%2F")
        url = url.replaceAll(":", "%3A")
        url = url.replaceAll(";", "%3B")
        url = url.replaceAll("<", "%3C")
        url = url.replaceAll("=", "%3D")
        url = url.replaceAll(">", "%3E")
        url = url.replaceAll("?", "%3F")
        url = url.replaceAll("@", "%40")
        url = url.replaceAll("[", "%5B")
        url = url.replaceAll("\\", "%5C")
        url = url.replaceAll("]", "%5D")
        url = url.replaceAll("^", "%5E")
        url = url.replaceAll("_", "%5F")
        url = url.replaceAll("`", "%60")
        url = url.replaceAll("{", "%7B")
        url = url.replaceAll("|", "%7C")
        url = url.replaceAll("}", "%7D")
        url = url.replaceAll("~", "%7E")
        return url
    }

    function send(command: string, response: string = null, timeout: number = 100): boolean {
        basic.pause(10)
        serial.readString()
        rxData = ""
        serial.writeString(command + "\r\n")
        if (response == null) {
            return true
        }

        let result = false
        let time_val = input.runningTime()
        while (true) {
            if (input.runningTime() - time_val > timeout) {
                result = false
                break
            }

            rxData += serial.readString()
            if (rxData.includes("\r\n")) {
                if (rxData.slice(0, rxData.indexOf("\r\n")).includes(response)) {
                    result = true
                    break
                }

                if (response == "OK") {
                    if (rxData.slice(0, rxData.indexOf("\r\n")).includes("ERROR")) {
                        result = false
                        break
                    }
                }
                rxData = rxData.slice(rxData.indexOf("\r\n") + 2)
            }
        }
        return result
    }

    function receive(response: string, timeout: number = 100): string {
        let receivebuf = ""
        let time_val2 = input.runningTime()
        while (true) {
            if (input.runningTime() - time_val2 > timeout) {
                if (rxData.includes(response)) {
                    receivebuf = rxData
                }
                break
            }

            rxData += serial.readString()
            if (rxData.includes("\r\n")) {
                if (rxData.slice(0, rxData.indexOf("\r\n")).includes(response)) {
                    receivebuf = rxData.slice(0, rxData.indexOf("\r\n"))
                    rxData = rxData.slice(rxData.indexOf("\r\n") + 2)
                    break
                }
                rxData = rxData.slice(rxData.indexOf("\r\n") + 2)
            }
        }
        return receivebuf
    }

    /**
     * Check if ESP successfully Wi-Fi initialize
     */
    //% weight=80
    //% blockId=espcontrol
    //% block="wifi module initialized"
    //% subcategory="Wi-Fi"
    export function espcontrol(): boolean {
        return espinit
    }

    /**
     * Initialize Wi-Fi Module
     */
    //% weight=70
    //% blockId=esp01init
    //% block="initialize wifi module: tx %tx rx %rx baudrate %baudrate"
    //% subcategory="Wi-Fi"
    export function esp01init(tx: SerialPin, rx: SerialPin, baudrate: BaudRate) {
        serial.redirect(tx, rx, baudrate)
        serial.setTxBufferSize(128)
        serial.setRxBufferSize(128)
        espinit = false
        if (send("AT+RESTORE", "ready", 5000) == false) 
            return

        if (send("ATE0", "OK") == false) 
            return

        espinit = true
    }

    /**
     * Check if ESP is successfully Wi-Fi connected
     */
    //% weight=50
    //% blockId=isWifiConnected
    //% block="wifi connected"
    //% subcategory="Wi-Fi"
    export function isWifiConnected(): boolean {
        send("AT+CIPSTATUS")
        let status = receive("STATUS:", 1000)
        receive("OK")
        if ((status == "") || status.includes("STATUS:5")) {
            return false
        }
        else {
            return true
        }
    }

    /**
     * Connect to the WiFi router
     */
    //% weight=60
    //% blockId=connectWiFi
    //% block="connect to wifi: ssid %ssid password %password"
    //% subcategory="Wi-Fi"
    export function connectWiFi(ssid: string, password: string) {
        send("AT+CWMODE=1", "OK")
        send("AT+CWJAP=\"" + ssid + "\",\"" + password + "\"", "OK", 20000)
    }

    /**
     * Check if ESP successfully telegram message send
     */
    //% weight=10
    //% blockId=isTelegramMessageSent
    //% block="telegram message sent"
    //% subcategory="Wi-Fi"
    export function isTelegramMessageSent(): boolean {
        return telegramMessageSent
    }

    /**
     * Connect to the set telegram channel and send the message
     */
    //% weight=20
    //% blockId=sendTelegramMessage
    //% block="send message to telegram:|api key %apiKey|chat id %chatId|message %message"
    //% subcategory="Wi-Fi"
    export function sendTelegramMessage(apiKey: string, chatId: string, message: string) {
        telegramMessageSent = false
        if (isWifiConnected() == false) 
            return
        if (send("AT+CIPSTART=\"SSL\",\"" + TELEGRAM_API_URL + "\",443", "OK", 10000) == false) 
            return

        let getdata = "GET /bot" + urlformat(apiKey) + "/sendMessage?chat_id=" + urlformat(chatId) + "&text=" + urlformat(message)
        getdata += " HTTP/1.1\r\n"
        getdata += "Host: " + TELEGRAM_API_URL + "\r\n"

        send("AT+CIPSEND=" + (getdata.length + 2))
        send(getdata)

        if (receive("SEND OK", 1000) == "") {
            send("AT+CIPCLOSE", "OK", 1000)
            return
        }

        let response = receive("\"ok\":true", 1000)
        if (response == "") {
            send("AT+CIPCLOSE", "OK", 1000)
            return
        }

        send("AT+CIPCLOSE", "OK", 1000)
        telegramMessageSent = true
        return
    }

    /**
     * Check if ESP successfully thingSpeak data uploaded
     */
    //% weight=30
    //% blockId=isThingspeakUploaded
    //% block="thingSpeak data uploaded"
    //% subcategory="Wi-Fi"
    export function isThingspeakUploaded(): boolean {
        return thingspeakUploaded
    }

    /**
     * Connect to thingspeak and upload data. it would not upload anything if it failed to connect to Wi-Fi or thingSpeak 
     */
    //% weight=40
    //% blockId=uploadThingspeak
    //% block="upload data to thingspeak|write api key %writeApiKey|field 1 %field1||field 2 %field2|field 3 %field3|field 4 %field4|field 5 %field5|field 6 %field6|field 7 %field7|field 8 %field8"
    //% subcategory="Wi-Fi"
    export function uploadThingspeak(writeApiKey: string,
        val1: number,
        val2: number = null,
        val3: number = null,
        val4: number = null,
        val5: number = null,
        val6: number = null,
        val7: number = null,
        val8: number = null) {

        thingspeakUploaded = false
        if (isWifiConnected() == false) 
            return

        if (send("AT+CIPSTART=\"TCP\",\"" + THINGSPEAK_API_URL + "\",80", "OK", 10000) == false) 
            return

        let data = "GET /update?api_key=" + writeApiKey + "&field1=" + val1
        if (val2 != null)
            data += "&val2=" + val2
        if (val2 != null)
            data += "&val3=" + val3
        if (val2 != null)
            data += "&val4=" + val4
        if (val2 != null)
            data += "&val5=" + val5
        if (val2 != null)
            data += "&val6=" + val6
        if (val2 != null)
            data += "&val7=" + val7
        if (val2 != null)
            data += "&val8=" + val8

        send("AT+CIPSEND=" + (data.length + 2))
        send(data)

        if (receive("SEND OK", 1000) == "")
            return

        let response = receive("+IPD", 1000)
        if (response == "") 
            return

        response = response.slice(response.indexOf(":") + 1, response.indexOf("CLOSED"))
        let uploadCount = parseInt(response)

        if (uploadCount == 0) 
            return

        thingspeakUploaded = true
        return
    }
}
