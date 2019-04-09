import { app, BrowserWindow, Menu, protocol } from "electron"
import * as path from "path"
import * as url from "url"
import { getIcon } from 'extension-fs'
import * as settings from 'electron-settings'

let win: BrowserWindow

const createWindow = function() {
    protocol.registerBufferProtocol('atom', async (request, callback) => {
            var icon = await getIcon("*.js")
            callback({mimeType: 'img/png', data: icon})
        }, (error) => {
            if (error) console.error('Failed to register protocol', error)
        }
    )

    const bounds = JSON.parse(settings.get("window-bounds", JSON.stringify({ 
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }        
    })) as string)
    bounds.webPreferences = { nodeIntegration: true }    
    bounds.icon = '../kirk2.png'

    win = new BrowserWindow(bounds)

    if (settings.get("isMaximized"))
        win.maximize()
    
    win.loadURL(
        url.format({
            pathname: path.join(__dirname, `/../../dist/commander/index.html`),
            protocol: "file:",
            slashes: true
        })
    )

    const zf = win.webContents.getZoomFactor()

    win.on('close', () => {
        if (!win.isMaximized()) {
            const bounds = win.getBounds()
            settings.set("window-bounds", JSON.stringify(bounds))
            win.webContents.send("closed")
        }
        //child.send("kill")
    })

    win.on('maximize', () => {
        const bounds = win.getBounds()
        settings.set("window-bounds", JSON.stringify(bounds))
        settings.set("isMaximized", true)
    })

    win.on('unmaximize', () => {
        settings.set("isMaximized", false)
    })    

    win.on("closed", () => win = null)

    const menu = Menu.buildFromTemplate([
        {
            label: '&Datei',
            submenu: [{
                label: '&Umbenennen',
                accelerator: "F2"
            },
            {
                type: 'separator'
            },            
            {
                label: '&Kopieren',
                accelerator: "F5"
            },
            {
                label: '&Verschieben',
                accelerator: "F6"
            },
            {
                label: '&Löschen',
                accelerator: "F8"
            },
            {
                type: 'separator'
            },            
            {
                label: '&Ordner anlegen',
                accelerator: "F7"
            },
            {
                type: 'separator'
            },            
            {
                label: '&Eigenschaften',
                accelerator: "Alt+Enter"
            },
            {
                type: 'separator'
            },            
            {
                label: '&Beenden',
                accelerator: 'Alt+F4',
                role: "quit"
            }
        ]},
        {
            label: '&Navigation',
            submenu: [{
                label: '&Favoriten',
                accelerator: 'F1'
            },
            {
                label: '&Gleichen Ordner öffnen',
                accelerator: 'F9'
            }
        ]},
        {
            label: '&Selektion',
            submenu: [{
                label: '&Alles'
            },
            {
                label: 'Alle &deselektieren'
            }
        ]},
        {
            label: '&Ansicht',
            submenu: [{
                label: '&Versteckte Dateien',
                accelerator: "Ctrl+H",
                type: "checkbox",
                //click: evt => mainWindow.webContents.send("showHidden", evt.checked)
            },
            {
                label: '&Aktualisieren',
                accelerator: "Ctrl+R",
                //click: evt => mainWindow.webContents.send("darkTheme", evt.checked)
            },
            {
                type: 'separator'
            },            
            {
                label: '&Vorschau',
                type: "checkbox",
                accelerator: "F3",
                //click: evt => mainWindow.webContents.send("preview", evt.checked)
            },
            {
                type: 'separator'
            },            
            {
                label: '&Themen',
                type: "submenu",
                submenu: [{
                    label: '&Blau',
                    type: "radio",
                    //click: evt => mainWindow.webContents.send("preview", evt.checked)
                },
                {
                    label: '&Hellblau',
                    type: "radio",
                    //click: evt => mainWindow.webContents.send("preview", evt.checked)
                },
                {
                    label: '&Dunkel',
                    type: "radio",
                    //click: evt => mainWindow.webContents.send("preview", evt.checked)
                }]
            },
            {
                type: 'separator'
            },            
            {
                label: '&Zoomlevel',
                type: "submenu",
                submenu: [{
                    label: '50%',
                    type: "radio",
                    click: evt => win.webContents.setZoomFactor(0.5)
                },
                {
                    label: '75%',
                    type: "radio",
                    click: evt => win.webContents.setZoomFactor(0.75)
                },
                {
                    label: '100%',
                    type: "radio",
                    click: evt => win.webContents.setZoomFactor(1.0)
                },
                {
                    label: '150%',
                    type: "radio",
                    click: evt => win.webContents.setZoomFactor(1.5)
                },
                {
                    label: '200%',
                    type: "radio",
                    click: evt => win.webContents.setZoomFactor(2.0)
                },
                {
                    label: '250%',
                    type: "radio",
                    click: evt => win.webContents.setZoomFactor(2.5)
                },
                {
                    label: '300%',
                    type: "radio",
                    click: evt => win.webContents.setZoomFactor(3.0)
                },
                {
                    label: '350%',
                    type: "radio",
                    click: evt => win.webContents.setZoomFactor(3.5)
                },
                {
                    label: '400%',
                    type: "radio",
                    click: evt => win.webContents.setZoomFactor(4.0)
                }]
            },
            {
                label: '&Vollbild',
                click: () => win.setFullScreen(!win.isFullScreen()),
                accelerator: "F11"
            },
            {
                type: 'separator'
            },            
            {
                label: '&Entwicklerwerkzeuge',
                click: () => win.webContents.openDevTools(),
                accelerator: "F12"
            }
        ]}
    ])
    
    Menu.setApplicationMenu(menu)    
}

app.on("ready", createWindow)

app.on("activate", () => {
    if (win === null) 
        createWindow()
})