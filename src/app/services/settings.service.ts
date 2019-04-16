import { Injectable, EventEmitter, NgZone } from '@angular/core'

@Injectable({
    providedIn: 'root'
})
export class SettingsService {

    constructor(private zone: NgZone) { }

    get showHidden() { 
        return this._showHidden
    }
    set showHidden(value: boolean) {
        this.zone.run(() => {
            this._showHidden = value    
        })
    }
    private _showHidden = false
}
