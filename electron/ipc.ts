import { ipcMain } from 'electron'

export const subscribe = (webContents: Electron.WebContents, onMessage: (method: string, arg: string)=>Promise<string>) => {
    callback = onMessage
    ipcMain.on("call", async (evt: any, method: string, requestId: number, arg: string) => {
        try {
            const result = await callback(method, arg)
            webContents.send("response", requestId, result)
        } catch (err) {
            webContents.send("exception", requestId, JSON.stringify(err))
        }
    })
}

var callback: (method: string, arg: string)=>Promise<string>