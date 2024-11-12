//The MIT License (MIT)
//Copyright (c) <2021> Cytron Technologies 
//<https://github.com/cytrontechnologies/pxt-esp8266>
//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//Minor changes made by: Robotistan

namespace picobricks {
    const THINGSPEAK_API_URL = "api.thingspeak.com"
    
    let ThingSpeakUploaded = false
    let espInitialized = false
    let rxData = ""

    /**
     * Send AT command and wait for response.
     * Return true if expected response is received.
     * @param command The AT command without the CRLF.
     * @param expected_response Wait for this response.
     * @param timeout Timeout in milliseconds.
     */
    //% blockHidden=true
    //% blockId=picoBricksSendCommand
    export function sendCommand(command: string, expected_response: string = null, timeout: number = 100): boolean {
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

    /**
     * Get the specific response from ESP.
     * Return the line start with the specific response.
     * @param command The specific response we want to get.
     * @param timeout Timeout in milliseconds.
     */
    //% blockHidden=true
    //% blockId=picoBricksGetResponse
    export function getResponse(response: string, timeout: number = 100): string {
        let responseLine = ""
        let timestamp = input.runningTime()
        while (true) {
            if (input.runningTime() - timestamp > timeout) {
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



    /**
     * Format the encoding of special characters in the url.
     * @param url The url that we want to format.
     */
    //% blockHidden=true
    //% blockId=picoBricksFormatUrl
    export function formatUrl(url: string): string {
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

    /**
     * Return true if the ESP is already initialized.
     */
    //% weight=80
    //% blockId=picoBricksIsESPInitialized
    //% block="Wi-Fi module initialized"
    //% subcategory="Wi-Fi"
    export function isESPInitialized(): boolean {
        return espInitialized
    }

    /**
     * Initialize Wi-Fi Module
     * @param tx Tx pin of micro:bit. eg: SerialPin.P14
     * @param rx Rx pin of micro:bit. eg: SerialPin.P15
     * @param baudrate UART baudrate. eg: BaudRate.BaudRate115200
     */
    //% weight=70
    //% blockId=picoBricksEsp01init
    //% block="initialize Wi-Fi module: tx %tx rx %rx baudrate %baudrate"
    //% subcategory="Wi-Fi"
    export function esp01init(tx: SerialPin, rx: SerialPin, baudrate: BaudRate) {
        // Redirect the serial port.
        serial.redirect(tx, rx, baudrate)
        serial.setTxBufferSize(128)
        serial.setRxBufferSize(128)
        espInitialized = false
        if (sendCommand("AT+RESTORE", "ready", 5000) == false) return

        if (sendCommand("ATE0", "OK") == false) return

        espInitialized = true
    }

    /**
     * Check if ESP is successfully Wi-Fi connected
     */
    //% weight=50
    //% blockId=picoBricksIsWifiConnected
    //% block="Wi-Fi connected"
    //% subcategory="Wi-Fi"
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

    /**
     * Connect to WiFi router.
     * @param ssid Your WiFi SSID.
     * @param password Your WiFi password.
     */
    //% weight=60
    //% blockId=picoBricksConnectWiFi
    //% block="connect to Wi-Fi: ssid %ssid password %password"
    //% subcategory="Wi-Fi"
    export function connectWiFi(ssid: string, password: string) {
        sendCommand("AT+CWMODE=1", "OK")
        sendCommand("AT+CWJAP=\"" + ssid + "\",\"" + password + "\"", "OK", 20000)
    }

    /**
     * Return true if data is uploaded to ThingSpeak successfully.
     */
    //% weight=30
    //% blockGap=8
    //% blockId=picoBricksIsThingSpeakUploaded
    //% block="ThingSpeak data uploaded"
    //% subcategory="Wi-Fi"
    export function isThingSpeakUploaded(): boolean {
        return ThingSpeakUploaded
    }

    /**
     * Upload data to ThingSpeak (Data can only be updated to ThingSpeak every 15 seconds).
     * @param writeApiKey ThingSpeak Write API Key.
     * @param field1 Data for Field 1.
     * @param field2 Data for Field 2.
     * @param field3 Data for Field 3.
     * @param field4 Data for Field 4.
     * @param field5 Data for Field 5.
     * @param field6 Data for Field 6.
     * @param field7 Data for Field 7.
     * @param field8 Data for Field 8.
     */
    //% weight=40
    //% blockId=picoBricksUploadThingSpeak
    //% block="upload data to ThingSpeak|write API key %writeApiKey|field 1 %field1||field 2 %field2|field 3 %field3|field 4 %field4|field 5 %field5|field 6 %field6|field 7 %field7|field 8 %field8"
    //% subcategory="Wi-Fi"
    export function uploadThingSpeak(writeApiKey: string,
        field1: number,
        field2: number = null,
        field3: number = null,
        field4: number = null,
        field5: number = null,
        field6: number = null,
        field7: number = null,
        field8: number = null) {

        ThingSpeakUploaded = false
        if (isWifiConnected() == false) return

        if (sendCommand("AT+CIPSTART=\"TCP\",\"" + THINGSPEAK_API_URL + "\",80", "OK", 10000) == false) return

        let data = "GET /update?api_key=" + writeApiKey + "&field1=" + field1
        if (field2 != null) data += "&field2=" + field2
        if (field2 != null) data += "&field3=" + field3
        if (field2 != null) data += "&field4=" + field4
        if (field2 != null) data += "&field5=" + field5
        if (field2 != null) data += "&field6=" + field6
        if (field2 != null) data += "&field7=" + field7
        if (field2 != null) data += "&field8=" + field8

        sendCommand("AT+CIPSEND=" + (data.length + 2))
        sendCommand(data)

        if (getResponse("SEND OK", 1000) == "") return

        let response = getResponse("+IPD", 1000)
        if (response == "") return

        response = response.slice(response.indexOf(":") + 1, response.indexOf("CLOSED"))
        let uploadCount = parseInt(response)

        if (uploadCount == 0) return

        ThingSpeakUploaded = true
        return
    }
}
