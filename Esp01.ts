namespace PicoBricks {
    let rxData = ""
    let esp8266Initialized = false
    let telegramMessageSent = false
    let thingspeakUploaded = false

    const TELEGRAM_API_URL = "api.telegram.org"
    const THINGSPEAK_API_URL = "api.thingspeak.com"

    function sendCommand(command: string, expected_response: string = null, timeout: number = 100): boolean {
        basic.pause(10)
        serial.readString()
        rxData = ""
        serial.writeString(command + "\r\n")
        if (expected_response == null) {
            return true
        }

        let result = false
        let timestamp = input.runningTime()
        while (true) {
            // Timeout.
            if (input.runningTime() - timestamp > timeout) {
                result = false
                break
            }

            rxData += serial.readString()
            if (rxData.includes("\r\n")) {
                if (rxData.slice(0, rxData.indexOf("\r\n")).includes(expected_response)) {
                    result = true
                    break
                }

                if (expected_response == "OK") {
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

    function getResponse(response: string, timeout: number = 100): string {
        let responseLine = ""
        let timestamp2 = input.runningTime()
        while (true) {
            if (input.runningTime() - timestamp2 > timeout) {
                if (rxData.includes(response)) {
                    responseLine = rxData
                }
                break
            }

            rxData += serial.readString()
            if (rxData.includes("\r\n")) {
                if (rxData.slice(0, rxData.indexOf("\r\n")).includes(response)) {
                    responseLine = rxData.slice(0, rxData.indexOf("\r\n"))
                    rxData = rxData.slice(rxData.indexOf("\r\n") + 2)
                    break
                }
                rxData = rxData.slice(rxData.indexOf("\r\n") + 2)
            }
        }
        return responseLine
    }

    function formatUrl(url: string): string {
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

    //% weight=30
    //% blockGap=8
    //% blockId=isESP8266Initialized
    //% block="ESP8266 initialized"
    //% subcategory="ESP01"
    export function isESP8266Initialized(): boolean {
        return esp8266Initialized
    }

    //% weight=29
    //% blockGap=40
    //% blockId=espinit
    //% block="initialize ESP8266: Tx %tx Rx %rx Baudrate %baudrate"
    //% subcategory="ESP01"
    export function espinit(tx: SerialPin, rx: SerialPin, baudrate: BaudRate) {
        // Redirect the serial port.
        serial.redirect(tx, rx, baudrate)
        serial.setTxBufferSize(128)
        serial.setRxBufferSize(128)
        esp8266Initialized = false
        if (sendCommand("AT+RESTORE", "ready", 5000) == false) 
            return

        if (sendCommand("ATE0", "OK") == false) 
            return

        esp8266Initialized = true
    }

    //% weight=28
    //% blockGap=8
    //% blockId=isWifiConnected
    //% block="WiFi connected"
    //% subcategory="ESP01"
    export function isWifiConnected(): boolean {
        sendCommand("AT+CIPSTATUS")
        let status = getResponse("STATUS:", 1000)
        getResponse("OK")
        if ((status == "") || status.includes("STATUS:5")) {
            return false
        }
        else {
            return true
        }
    }

    //% weight=27
    //% blockGap=8
    //% blockId=connectWiFi
    //% block="connect to WiFi: SSID %ssid Password %password"
    //% subcategory="ESP01"
    export function connectWiFi(ssid: string, password: string) {
        sendCommand("AT+CWMODE=1", "OK")
        sendCommand("AT+CWJAP=\"" + ssid + "\",\"" + password + "\"", "OK", 20000)
    }

    //% weight=30
    //% blockGap=8
    //% blockId=isTelegramMessageSent
    //% block="Telegram message sent"
    //% subcategory="ESP01"
    export function isTelegramMessageSent(): boolean {
        return telegramMessageSent
    }

    //% weight=29
    //% blockGap=8
    //% blockId=sendTelegramMessage
    //% block="send message to Telegram:|API Key %apiKey|Chat ID %chatId|Message %message"
    //% subcategory="ESP01"
    export function sendTelegramMessage(apiKey: string, chatId: string, message: string) {
        telegramMessageSent = false
        if (isWifiConnected() == false) 
            return
        if (sendCommand("AT+CIPSTART=\"SSL\",\"" + TELEGRAM_API_URL + "\",443", "OK", 10000) == false) 
            return

        let data4 = "GET /bot" + formatUrl(apiKey) + "/sendMessage?chat_id=" + formatUrl(chatId) + "&text=" + formatUrl(message)
        data4 += " HTTP/1.1\r\n"
        data4 += "Host: " + TELEGRAM_API_URL + "\r\n"

        sendCommand("AT+CIPSEND=" + (data4.length + 2))
        sendCommand(data4)

        if (getResponse("SEND OK", 1000) == "") {
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return
        }

        let response = getResponse("\"ok\":true", 1000)
        if (response == "") {
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return
        }

        sendCommand("AT+CIPCLOSE", "OK", 1000)
        telegramMessageSent = true
        return
    }

    //% weight=30
    //% blockGap=8
    //% blockId=isThingspeakUploaded
    //% block="ThingSpeak data uploaded"
    //% subcategory="ESP01"
    export function isThingspeakUploaded(): boolean {
        return thingspeakUploaded
    }

    //% weight=29
    //% blockGap=8
    //% blockId=uploadThingspeak
    //% block="Upload data to ThingSpeak|Write API key %writeApiKey|Field 1 %field1||Field 2 %field2|Field 3 %field3|Field 4 %field4|Field 5 %field5|Field 6 %field6|Field 7 %field7|Field 8 %field8"
    //% subcategory="ESP01"
    export function uploadThingspeak(writeApiKey: string,
        field1: number,
        field2: number = null,
        field3: number = null,
        field4: number = null,
        field5: number = null,
        field6: number = null,
        field7: number = null,
        field8: number = null) {

        thingspeakUploaded = false
        if (isWifiConnected() == false) 
            return

        if (sendCommand("AT+CIPSTART=\"TCP\",\"" + THINGSPEAK_API_URL + "\",80", "OK", 10000) == false) 
            return

        let data = "GET /update?api_key=" + writeApiKey + "&field1=" + field1
        if (field2 != null) 
            data += "&field2=" + field2
        if (field2 != null) 
            data += "&field3=" + field3
        if (field2 != null) 
            data += "&field4=" + field4
        if (field2 != null) 
            data += "&field5=" + field5
        if (field2 != null) 
            data += "&field6=" + field6
        if (field2 != null) 
            data += "&field7=" + field7
        if (field2 != null) 
            data += "&field8=" + field8

        sendCommand("AT+CIPSEND=" + (data.length + 2))
        sendCommand(data)

        if (getResponse("SEND OK", 1000) == "") 
            return

        let response = getResponse("+IPD", 1000)
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
