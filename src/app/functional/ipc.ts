const electron = (window as any).require('electron')
const ipcRenderer = electron.ipcRenderer

ipcRenderer.on("response", (event, requestId: number, arg: string) => {
    const promise = requests.get(requestId)
    requests.delete(requestId)
    promise.res(arg)
})

ipcRenderer.on("exception", (event, requestId: number, arg: string) => {
    const promise = requests.get(requestId)
    requests.delete(requestId)
    promise.rej(JSON.parse(arg))
})

export const sendToMainAsync = (method: string, arg: string) => {
    return new Promise<string>((res, rej) => {
        requests.set(++requestId, { res: res, rej: rej })
        ipcRenderer.send("call", method, requestId, arg)
    })
}

var requests = new Map();
var requestId = 0