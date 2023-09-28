namespace PicoBricks {
    let rxData = ""
    let esp8266Initialized = false
    let telegramMessageSent = false

    const TELEGRAM_API_URL = "api.telegram.org"

    function sendCommand(command: string, expected_response: string = null, timeout: number = 100): boolean {
        // Wait a while from previous command.
        basic.pause(10)

        // Flush the Rx buffer.
        serial.readString()
        rxData = ""

        // Send the command and end with "\r\n".
        serial.writeString(command + "\r\n")

        // Don't check if expected response is not specified.
        if (expected_response == null) {
            return true
        }

        // Wait and verify the response.
        let result2 = false
        let timestamp = input.runningTime()
        while (true) {
            // Timeout.
            if (input.runningTime() - timestamp > timeout) {
                result2 = false
                break
            }

            // Read until the end of the line.
            rxData += serial.readString()
            if (rxData.includes("\r\n")) {
                // Check if expected response received.
                if (rxData.slice(0, rxData.indexOf("\r\n")).includes(expected_response)) {
                    result2 = true
                    break
                }

                // If we expected "OK" but "ERROR" is received, do not wait for timeout.
                if (expected_response == "OK") {
                    if (rxData.slice(0, rxData.indexOf("\r\n")).includes("ERROR")) {
                        result2 = false
                        break
                    }
                }

                // Trim the Rx data before loop again.
                rxData = rxData.slice(rxData.indexOf("\r\n") + 2)
            }
        }

        return result2
    }

    function getResponse(response: string, timeout: number = 100): string {
        let responseLine = ""
        let timestamp2 = input.runningTime()
        while (true) {
            // Timeout.
            if (input.runningTime() - timestamp2 > timeout) {
                // Check if expected response received in case no CRLF received.
                if (rxData.includes(response)) {
                    responseLine = rxData
                }
                break
            }

            // Read until the end of the line.
            rxData += serial.readString()
            if (rxData.includes("\r\n")) {
                // Check if expected response received.
                if (rxData.slice(0, rxData.indexOf("\r\n")).includes(response)) {
                    responseLine = rxData.slice(0, rxData.indexOf("\r\n"))

                    // Trim the Rx data for next call.
                    rxData = rxData.slice(rxData.indexOf("\r\n") + 2)
                    break
                }

                // Trim the Rx data before loop again.
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

    /**
     * Return true if the ESP8266 is already initialized.
     */
    //% weight=30
    //% blockGap=8
    //% block="ESP8266 initialized"
    //% subcategory="ESP01"
    export function isESP8266Initialized(): boolean {
        return esp8266Initialized
    }

    /**
     * Initialize the ESP8266.
     * @param tx Tx pin of micro:bit. eg: SerialPin.P16
     * @param rx Rx pin of micro:bit. eg: SerialPin.P15
     * @param baudrate UART baudrate. eg: BaudRate.BaudRate115200
     */
    //% weight=29
    //% blockGap=40
    //% block="initialize ESP8266: Tx %tx Rx %rx Baudrate %baudrate"
    //% subcategory="ESP01"
    export function espinit(tx: SerialPin, rx: SerialPin, baudrate: BaudRate) {
        // Redirect the serial port.
        serial.redirect(tx, rx, baudrate)
        serial.setTxBufferSize(128)
        serial.setRxBufferSize(128)

        // Reset the flag.
        esp8266Initialized = false

        // Restore the ESP8266 factory settings.
        if (sendCommand("AT+RESTORE", "ready", 5000) == false) return

        // Turn off echo.
        if (sendCommand("ATE0", "OK") == false) return

        // Initialized successfully.
        // Set the flag.
        esp8266Initialized = true
    }

    /**
 * Return true if the ESP8266 is connected to WiFi router.
 */
    //% weight=28
    //% blockGap=8
    //% block="WiFi connected"
    //% subcategory="ESP01"
    export function isWifiConnected(): boolean {
        // Get the connection status.
        sendCommand("AT+CIPSTATUS")
        let status = getResponse("STATUS:", 1000)

        // Wait until OK is received.
        getResponse("OK")

        // Return the WiFi status.
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
    //% weight=27
    //% blockGap=8
    //% block="connect to WiFi: SSID %ssid Password %password"
    //% subcategory="ESP01"
    export function connectWiFi(ssid: string, password: string) {
        // Set to station mode.
        sendCommand("AT+CWMODE=1", "OK")

        // Connect to WiFi router.
        sendCommand("AT+CWJAP=\"" + ssid + "\",\"" + password + "\"", "OK", 20000)
    }

    /**
 * Return true if the Telegram message was sent successfully.
 */
    //% weight=30
    //% blockGap=8
    //% block="Telegram message sent"
    //% subcategory="ESP01"
    export function isTelegramMessageSent(): boolean {
        return telegramMessageSent
    }

    /**
 * Send Telegram message.
 * @param apiKey Telegram API Key.
 * @param chatId The chat ID we want to send message to.
 */
    //% weight=29
    //% blockGap=8
    //% block="send message to Telegram:|API Key %apiKey|Chat ID %chatId|Message %message"
    //% subcategory="ESP01"
    export function sendTelegramMessage(apiKey: string, chatId: string, message: string) {

        // Reset the upload successful flag.
        telegramMessageSent = false

        // Make sure the WiFi is connected.
        if (isWifiConnected() == false) return

        // Connect to Telegram. Return if failed.
        if (sendCommand("AT+CIPSTART=\"SSL\",\"" + TELEGRAM_API_URL + "\",443", "OK", 10000) == false) return

        // Construct the data to send.
        let data4 = "GET /bot" + formatUrl(apiKey) + "/sendMessage?chat_id=" + formatUrl(chatId) + "&text=" + formatUrl(message)
        data4 += " HTTP/1.1\r\n"
        data4 += "Host: " + TELEGRAM_API_URL + "\r\n"

        // Send the data.
        sendCommand("AT+CIPSEND=" + (data4.length + 2))
        sendCommand(data4)

        // Return if "SEND OK" is not received.
        if (getResponse("SEND OK", 1000) == "") {
            // Close the connection and return.
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return
        }

        // Validate the response from Telegram.
        let response = getResponse("\"ok\":true", 1000)
        if (response == "") {
            // Close the connection and return.
            sendCommand("AT+CIPCLOSE", "OK", 1000)
            return
        }

        // Close the connection.
        sendCommand("AT+CIPCLOSE", "OK", 1000)

        // Set the upload successful flag and return.
        telegramMessageSent = true
        return
    }


}
