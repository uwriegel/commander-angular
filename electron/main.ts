import { app, BrowserWindow, protocol } from "electron"
import * as path from "path"
import * as url from "url"
import { getIcon } from 'extension-fs'

let win: BrowserWindow

const createWindow = function() {
    protocol.registerBufferProtocol('atom', async (request, callback) => {
            var icon = await getIcon("*.js")
            callback({mimeType: 'img/png', data: icon})
        }, (error) => {
            if (error) console.error('Failed to register protocol', error)
        }
    )

    win = new BrowserWindow({ 
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }        
    })

    console.log(process.cwd())

    win.loadURL(
        url.format({
            pathname: path.join(__dirname, `/../../dist/commander/index.html`),
            protocol: "file:",
            slashes: true
        })
    )

    win.on("closed", () => win = null)
}

app.on("ready", createWindow)

app.on("activate", () => {
    if (win === null) 
        createWindow()
})