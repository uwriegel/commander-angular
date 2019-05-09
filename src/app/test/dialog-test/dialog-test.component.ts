import { Component, OnInit, Input } from '@angular/core'
import { DialogComponent as Dialog } from '../../dialog/dialog.component'
import { Buttons } from '../../enums/buttons.enum'

@Component({
    selector: 'test-dialog',
    templateUrl: './dialog-test.component.html',
    styleUrls: ['./dialog-test.component.css']
})
export class DialogComponent implements OnInit {

    @Input() 
    dialog: Dialog

    ngOnInit() { }

    async onOk() { 
        this.dialog.buttons = Buttons.Ok
        this.dialog.text = "Das ist der OK-Dialog"
        await this.dialog.show()
        this.dialog.buttons = Buttons.OkCancel
        this.dialog.text = "Ja Wahnsinn, jetzt tut er"
        this.dialog.show()
    }

    async onOkCancel() { 
        this.dialog.buttons = Buttons.OkCancel
        this.dialog.text = "Das ist der OK-Cancel-Dialog"
        const result = await this.dialog.show()
        console.log(result)
    }

    async onYesNoCancel() { 
        this.dialog.buttons = Buttons.YesNoCancel
        this.dialog.text = "Das ist der JaNeinCancel-Dialog"
        const result = await this.dialog.show()
        console.log(result)
    }
    
    async onInputYesNoCancel() { 
        this.dialog.buttons = Buttons.YesNoCancel
        this.dialog.text = "Das ist der Input-JaNeinCancel-Dialog"
        this.dialog.withInput = true
        this.dialog.inputText = "Dateiname.ext"
        this.dialog.noIsDefault = true
        const result = await this.dialog.show()
        console.log(result)
    }

    async onRename() { 
        this.dialog.buttons = Buttons.OkCancel
        this.dialog.text = "Möchtest Du die Datei umbenennen?"
        this.dialog.withInput = true
        this.dialog.inputText = "Dateiname.ext"
        this.dialog.selectNameOnly = true
        const result = await this.dialog.show()
        console.log(result)
    }
    
    async onlongText() { 
        this.dialog.buttons = Buttons.YesNoCancel
        this.dialog.text = "Mitte des Jahres 1992 lernte Nas MC Serch von 3rd Bass kennen, der sein Manager wurde und ihm noch im selben Jahr einen Plattendeal bei Columbia Records verschaffen konnte. Nas machte sein Solodebüt mit der Single Halftime zum Soundtrack des Films Zebrahead."
        this.dialog.withInput = true
        const result = await this.dialog.show()
        console.log(result)
    }

    async extendedRename() {
        this.dialog.buttons = Buttons.Ok
        this.dialog.rename = true
        this.dialog.renameData.isActive = true
        this.dialog.renameData.numberOfDigits = 3
        this.dialog.renameData.prefix = "Bild"
        this.dialog.renameData.startingIndex = 45
        const result = await this.dialog.show()
        console.log(result)
    }
}