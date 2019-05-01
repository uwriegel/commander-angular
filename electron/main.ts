import { app, BrowserWindow, Menu, protocol, ipcMain, RegisterBufferProtocolRequest, MimeTypedBuffer } from "electron"
import * as path from "path"
import * as url from "url"
import { getIcon, open, openAs, showInfo, createDirectory } from 'extension-fs'
import * as settings from 'electron-settings'
import * as fs from 'fs'
import { subscribe } from './ipc';

const PROPERTIES = "properties"
const OPEN_WITH = "openWith"
const THEME = "theme"
const SHOWHIDDEN = "showHidden"
const PREVIEW = "preview"
const SELECT_ALL = "selectAll"
const DESELECT_ALL = "deselectAll"
const REFRESH = "refresh"
const CREATE_FOLDER = "createfolder"
const ADAPT_PATH = "adaptPath"
const themeBlue = "blue"
const themeLightBlue = "lightblue"
const themeDark = "dark"

let win: BrowserWindow
let theme = settings.get(THEME, themeBlue)

const setTheme = function(themeToSet: string) {
    theme = themeToSet
    win.webContents.send(THEME, theme)
    settings.set(THEME, theme)    
}

const createWindow = function() {
    protocol.registerBufferProtocol('icon', async (request, callback) => {
        const url = request.url
        var ext = url.substr(7)
        var icon = await getIcon(ext)
        callback({mimeType: 'img/png', data: icon})
    }, (error) => {
        if (error) console.error('Failed to register protocol', error)
    })

    let recentUrl = ""
    protocol.registerBufferProtocol('getfile', (request, callback) => {
        recentUrl = request.url
        var file = decodeURIComponent(recentUrl.substr(10))
        if (file.toLowerCase().endsWith(".jpg")) 
            setTimeout(() => {
                if (recentUrl == request.url)
                    fs.readFile(file, (_, data) => {
                        if (recentUrl == request.url)
                            callback({mimeType: 'img/jpg', data: data})
                        else
                            callback({mimeType: 'img/jpg', data: null})
                    })
                else
                    callback({mimeType: 'img/jpg', data: null})
            }, 50)
        else if (file.toLowerCase().endsWith(".png")) 
            fs.readFile(file, (_, data) => {
                callback({mimeType: 'img/png', data: data})
            })
        else if (file.toLowerCase().endsWith(".pdf")) 
            fs.readFile(file, (_, data) => {
                callback({mimeType: 'application/pdf', data: data})
            })
    }, (error) => {
        if (error) console.error('Failed to register protocol', error)
    })
    const bounds = JSON.parse(settings.get("window-bounds", JSON.stringify({ 
        width: 800,
        height: 600,
    })) as string)
    bounds.webPreferences = { nodeIntegration: true }    
    bounds.icon = '../kirk2.png'
    bounds.webPreferences = {
        nodeIntegration: true,
    }        
    
    win = new BrowserWindow(bounds)

    if (settings.get("isMaximized"))
        win.maximize()

    ipcMain.on("getTheme", (evt, arg) => {
        setTheme(settings.get("theme"))
    })
    ipcMain.on("showInfo", (evt, arg) => showInfo(arg))
    ipcMain.on("open", (evt, arg) => open(arg))
    ipcMain.on("openWith", (evt, arg) => openAs(arg))
    subscribe(win.webContents, async (method: string, arg: any) => {
        switch (method) {
            case "createDirectory":
                await createDirectory(arg)
                return ""
        }
    })
    
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
                accelerator: "F7",
                click: evt => win.webContents.send(CREATE_FOLDER)
            },
            {
                type: 'separator'
            },            
            {
                label: '&Eigenschaften',
                accelerator: "Alt+Return",
                click: evt => win.webContents.send(PROPERTIES)
            },
            {
                label: 'Öffnen &mit',
                accelerator: "Ctrl+Return",
                click: evt => win.webContents.send(OPEN_WITH)
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
                accelerator: 'F9',
                click: evt => win.webContents.send(ADAPT_PATH)
            }
        ]},
        {
            label: '&Selektion',
            submenu: [{
                label: '&Alles',
                accelerator: 'numadd',
                click: evt => win.webContents.send(SELECT_ALL)
            },
            {
                label: 'Alle &deselektieren',
                accelerator: 'numsub',
                click: evt => win.webContents.send(DESELECT_ALL)
            }
        ]},
        {
            label: '&Ansicht',
            submenu: [{
                label: '&Versteckte Dateien',
                accelerator: "Ctrl+H",
                type: "checkbox",
                click: evt => win.webContents.send(SHOWHIDDEN, evt.checked)
            },
            {
                label: '&Aktualisieren',
                accelerator: "Ctrl+R",
                click: evt => win.webContents.send(REFRESH)
            },
            {
                type: 'separator'
            },            
            {
                label: '&Vorschau',
                type: "checkbox",
                accelerator: "F3",
                click: evt => win.webContents.send(PREVIEW, evt.checked)
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
                    checked: theme == themeBlue,
                    click: evt => setTheme(themeBlue)
                },
                {
                    label: '&Hellblau',
                    type: "radio",
                    checked: theme == themeLightBlue,
                    click: evt => setTheme(themeLightBlue)
                },
                {
                    label: '&Dunkel',
                    type: "radio",
                    checked: theme == themeDark,
                    click: evt => setTheme(themeDark)
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

