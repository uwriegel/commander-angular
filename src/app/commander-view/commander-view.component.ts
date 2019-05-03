import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core'
import { ThemesService } from '../services/themes.service'
import { TableViewComponent } from '../table-view/table-view.component'
import { Processor } from '../processors/processor'
import { DriveProcessor } from '../processors/drive-processor'
import { DirectoryProcessor } from '../processors/directory-processor'
import { SettingsService } from '../services/settings.service'
import { Observable, fromEvent } from 'rxjs'
import { filter } from 'rxjs/operators'
import { ListItem } from '../pipes/virtual-list.pipe'
import { trigger, state, style, transition, animate } from '@angular/animations'
import { repeatKey } from '../functional/scrolling';
import { ColumnSortSettings } from '../columns/columns.component'
import { DialogComponent } from '../dialog/dialog.component'
import { Buttons } from '../enums/buttons.enum';
import { DialogResultValue } from '../enums/dialog-result-value.enum'

@Component({
    selector: 'app-commander-view',
    templateUrl: './commander-view.component.html',
    styleUrls: ['./commander-view.component.css'],
    animations: [
        trigger('flyInOut', [
            state('in', style({
                opacity: 0,
                width: '0%',
                height: '0px'    
            })),
            transition(":enter", [
                style({
                    opacity: 0,
                    width: '0%',
                    height: '0px'    
                }),
                animate("0.3s ease-out", style({
                    opacity: 1,
                    width: '70%',
                    height: '15px'
                }))
            ]),
            transition(':leave', [
                animate("0.3s ease-in", style({
                    opacity: 0,
                    width: '0%',
                    height: '0px'    
                }))
            ])
        ])    
    ]    
})
export class CommanderViewComponent implements OnInit, AfterViewInit {

    @Input()
    dialog: DialogComponent    

    @Input() 
    id = ""
    
    @Input() 
    set showHidden(value: boolean) {
        this.undoRestriction()
        this.processor.refreshView()
    }

    @ViewChild(TableViewComponent) 
    private tableView: TableViewComponent

    @ViewChild("input") 
    private input: ElementRef

    @Output() 
    gotFocus: EventEmitter<CommanderViewComponent> = new EventEmitter()    

    restrictValue = ""

    processor: Processor
    
    get path() { 
        if (!this._path)
            this._path = this.getValue("recentPath", "root")
        return this._path 
    } 
    set path(value: string) {
        this.setValue("recentPath", value)
        this._path = value
    }
    private _path = ""

    currentItem = ""
    
    constructor(public themes: ThemesService, private settings: SettingsService) { 
        this.processor = new DriveProcessor()
    }

    undoRestriction = () => {}

    async ngOnInit() { 
        setTimeout(() => this.changePath(this.path))
    }

    ngAfterViewInit() {
        this.keyDownEvents = fromEvent(this.tableView.table.nativeElement, "keydown") 
        this.undoRestriction = this.initializeRestrict() 
    }

    selectAllItems(currentItemIndex: number, above: boolean) {
        this.tableView.getAllItems().forEach((item, index) => {
            item.isSelected = this.isItemSelectable(item) 
                ? above ? index <= currentItemIndex : index >= currentItemIndex ? this.isItemSelectable(item) : false
                : false
        })
    }

    refresh() {
        this.changePath(this.path)
    }

    createfolder() {
        if (this.processor.canCreateFolder()) {
            const currentItem = this.tableView.getCurrentItem().name
            this.dialog.buttons = Buttons.OkCancel
            this.dialog.text = "Neuen Ordner anlegen"
            this.dialog.withInput = true
            this.dialog.inputText = currentItem && currentItem != ".." ? currentItem : ""
            const obs = this.dialog.show()
            obs.subscribe(async result => {
                if (result.result == DialogResultValue.Ok) {
                    try {
                        await this.processor.createFolder(this.path, result.text)
                        this.refresh()
                    } catch (err) {
                        this.dialog.buttons = Buttons.Ok
                        this.dialog.text = err.description
                        this.dialog.show()                    
                    }
                    this.focus()
                }
            })
        }
    }

    rename() {
        if (this.processor.canRename()) {
            const currentItem = this.tableView.getCurrentItem().name
            this.dialog.buttons = Buttons.OkCancel
            this.dialog.text = "Möchtest Du die Datei umbenennen?"
            this.dialog.withInput = true
            this.dialog.inputText = currentItem
            this.dialog.selectNameOnly = true
            const obs = this.dialog.show()
            obs.subscribe(async result => {
                if (result.result == DialogResultValue.Ok) {
                    try {
                        await this.processor.rename(this.path, currentItem, result.text)
                        this.refresh()
                    } catch (err) {
                        this.dialog.buttons = Buttons.Ok
                        this.dialog.text = err.description
                        this.dialog.show()                    
                    }
                    this.focus()
                }
            })
        }
    }

    deleteFiles() {
        if (this.processor.canDelete()) {
            const selectedItems = this.getSelectedItems()
            const itemsToDelete = (selectedItems.length == 0 ? [this.tableView.getCurrentItem()] : selectedItems)
            if (itemsToDelete.length == 0)
                return
            this.dialog.buttons = Buttons.OkCancel
            this.dialog.text = itemsToDelete.length > 1 
                ? "Möchtest Du die selektierten Einträge löschen?"
                : itemsToDelete[0].isDirectory ? "Möchtest Du den Ordner löschen?" : "Möchtest Du die Datei löschen?"
            const obs = this.dialog.show()
            obs.subscribe(async result => {
                if (result.result == DialogResultValue.Ok) {
                    try {
                        await this.processor.deleteFiles(this.path, itemsToDelete)
                        this.refresh()
                    } catch (err) {
                        this.dialog.buttons = Buttons.Ok
                        this.dialog.text = err.description
                        this.dialog.show()                    
                    }
                    this.focus()
                }
            })
        }
    }

    copyFiles(targetPath: string, move: boolean) {
        if (move ? this.processor.canMove() : this.processor.canCopy()) {
            const selectedItems = this.getSelectedItems()
            const itemsToCopy = (selectedItems.length == 0 ? [this.tableView.getCurrentItem()] : selectedItems)
            if (itemsToCopy.length == 0)
                return
            this.dialog.buttons = Buttons.OkCancel
            const action = move ? "verschieben": "kopieren"
            this.dialog.text = itemsToCopy.length > 1 
                ? `Möchtest Du die selektierten Einträge ${action}?`
                : itemsToCopy[0].isDirectory ? `Möchtest Du den Ordner ${action}?` : `Möchtest Du die Datei ${action}?` 
            const obs = this.dialog.show()
            obs.subscribe(async result => {
                if (result.result == DialogResultValue.Ok) {
                    try {
                        //await this.processor.deleteFiles(this.path, itemsToDelete)
                        this.refresh()
                    } catch (err) {
                        this.dialog.buttons = Buttons.Ok
                        this.dialog.text = err.description
                        this.dialog.show()                    
                    }
                    this.focus()
                }
            })
        }
    }

    canInsertFiles = () => this.processor.canInsertFiles()

    onFocusIn() { 
        this.gotFocus.emit(this) 
        this.focus()
        this.isFocused = true
    }

    onFocusOut() {
        this.isFocused = false
    }

    onInputFocusIn(evt: Event) { 
        evt.stopPropagation()
        evt.preventDefault()
    }

    focus() { 
        this.tableView.focus() 
    }

    onCurrentIndexChanged(evt: number) {
        this.currentItem = this.path + '\\' + this.tableView.getCurrentItem().name
    }

    onResize() { this.tableView.onResize() }

    onKeydown(evt: KeyboardEvent) {
        switch (evt.which) {
            case 9: // TAB
                if (evt.shiftKey) {
                    this.input.nativeElement.focus()
                    setTimeout(() => this.input.nativeElement.select())
                    evt.stopPropagation()
                    evt.preventDefault()
                }    
                break
            case 13: // Return
                if (!evt.altKey && !evt.ctrlKey)
                    this.processItem()
                break
            case 32: // _                
                this.toggleSelection(this.tableView.getCurrentItem())
                break
            case 35: // End
                if (evt.shiftKey) 
                    this.selectAllItems(this.tableView.getCurrentItemIndex(), false)
                break
            case 36: // Pos1
                if (evt.shiftKey) 
                    this.selectAllItems(this.tableView.getCurrentItemIndex(), true)
                break                
            case 45: // Einfg
                repeatKey(evt.repeat, () => {
                    if (this.toggleSelection(this.tableView.getCurrentItem()))
                        this.tableView.downOne()
                })
                break;
        }
    }    

    onDblClick(evt: MouseEvent) { 
        if ((evt.target as HTMLElement).closest("td")) 
            //this.processItem(evt.altKey ? ProcessItemType.Properties : (evt.ctrlKey ? ProcessItemType.StartAs : ProcessItemType.Show))
            this.processItem()
    }

    onInputChange() {
        this.changePath(this.input.nativeElement.value)
    }

    onMouseUp() {
        setTimeout(() => this.input.nativeElement.select())
    }

    onInputKeydown(evt: KeyboardEvent) {
        switch (evt.which) {
            case 9: // TAB
                this.focus()
                evt.stopPropagation()
                evt.preventDefault()
                break
        }
    }   

    changePath(path: string) {
        const focus = this.isFocused
        this.undoRestriction()
        if (!this.processor.isProcessorFromPath(path)) 
            this.processor = path == "root" ? new DriveProcessor() : new DirectoryProcessor(this.settings)
        this.path = this.processor.correctPath(path)
        this.processor.changePath(this.path)
        if (focus)
            this.focus()
    }

    onColumnSort(evt: ColumnSortSettings) {
        console.log("Spaltensortierung", evt)
        this.processor.sort(evt)
    }

    getSelectedItems = () => this.tableView.getAllItems().filter((item) => item.isSelected)

    private processItem()  {
        this.undoRestriction()
        const recentPath = this.path
        const item = this.tableView.getCurrentItem()
        if (!this.processor.processItem(this.path, item)) {
            if (!this.processor.isProcessor(item))
                this.processor = (item as any).isRoot ? new DriveProcessor() : new DirectoryProcessor(this.settings)
            this.path = this.processor.correctPath(this.path, item.name)
            this.processor.changePath(this.path, recentPath)
            this.focus()
        }
    }

    private getValue(id: string, fallback?: string) {
        const result = localStorage[this.id + '-' + id]
        return result ? result : fallback
    }

    private setValue(id: string, value: string) {
        localStorage[this.id + '-' + id] = value
    }

    private toggleSelection(item: ListItem) {
        let result = false
        if (this.isItemSelectable(item)) {
            item.isSelected = !item.isSelected
            result = true
        }
        return result
    }

    private isItemSelectable(item: ListItem) {
        if (item.name == "..")
            return false
        // switch (item.itemType) {
        //     case ItemType.Parent:
        //     case ItemType.Drive:
        //         return false
        //     default:
            return true
//        }
    }

    private initializeRestrict() {
        const inputChars = this.keyDownEvents.pipe(filter(n => !n.altKey && !n.ctrlKey && !n.shiftKey && n.key.length > 0 && n.key.length < 2))
        const backSpaces = this.keyDownEvents.pipe(filter(n => n.which == 8))
        const escapes = this.keyDownEvents.pipe(filter(n => n.which == 27))
        let originalItems: ListItem[]
        
        inputChars.subscribe(evt => {
            const items = this.processor.items.filter(n => n.name.toLowerCase().startsWith(this.restrictValue + evt.key))
            if (items.length > 0) {
                this.restrictValue += evt.key
                if (!originalItems)
                    originalItems = this.processor.items
                this.processor.items.forEach(n => n.isCurrent = false)    
                this.processor.items = items
                items[0].isCurrent = true
                //this.onCurrentIndexChanged(0)
                this.tableView.focus()
            }
        })
        backSpaces.subscribe(() => {
            if (this.restrictValue.length > 0) {
                this.restrictValue = this.restrictValue.substr(0, this.restrictValue.length - 1);
                const items = originalItems.filter(n => n.name.toLowerCase().startsWith(this.restrictValue));
                this.processor.items = items
            }
        })

        const undoRestriction = () => {
            if (originalItems) {
                this.processor.items = originalItems
                originalItems = null
                this.restrictValue = ""
            }
        }

        escapes.subscribe(() => undoRestriction())
        return undoRestriction
    }

    private keyDownEvents: Observable<KeyboardEvent>
    private isFocused
}

