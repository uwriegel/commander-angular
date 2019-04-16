import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core'
import { ThemesService } from '../services/themes.service'
import { TableViewComponent } from '../table-view/table-view.component'
import { Processor } from '../processors/processor'
import { DriveProcessor } from '../processors/drive-processor'
import { DirectoryProcessor } from '../processors/directory-processor'
import { SettingsService } from '../services/settings.service'
import { Observable, fromEvent } from 'rxjs'
import { filter, map } from 'rxjs/operators'
import { ListItem } from '../pipes/virtual-list.pipe'
import { trigger, state, style, transition, animate } from '@angular/animations';

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

    @ViewChild(TableViewComponent) 
    private tableView: TableViewComponent

    @ViewChild("input") 
    private input: ElementRef

    @Input() 
    id = ""
    
    @Input() 
    set showHidden(value: boolean) {
        this.undoRestriction()
        this.processor.refreshView()
    }

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

    onFocusIn() { 
        this.gotFocus.emit(this) 
        this.focus()
    }

    onInputFocusIn(evt: Event) { 
        evt.stopPropagation()
        evt.preventDefault()
    }

    focus() { 
        this.tableView.focus() 
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
                //this.processItem(evt.altKey ? ProcessItemType.Properties : (evt.ctrlKey ? ProcessItemType.StartAs : ProcessItemType.Show))
                this.processItem()
                break
            // case 32: // _                
            //     this.toggleSelection(this.tableView.getCurrentItem())
            //     break
            // case 35: // End
            //     if (evt.shiftKey) 
            //         this.selectAllItems(this.tableView.getCurrentItemIndex(), false)
            //     break
            // case 36: // Pos1
            //     if (evt.shiftKey) 
            //         this.selectAllItems(this.tableView.getCurrentItemIndex(), true)
            //     break                
            // case 45: // Einfg
            //     repeatKey(evt.repeat, () => {
            //         if (this.toggleSelection(this.tableView.getCurrentItem()))
            //             this.tableView.downOne()
            //     })
            //     break;
            // case 107: // NUM +
            //     this.selectAllItems(0, false)
            //     break
            // case 109: // NUM -
            //     this.selectAllItems(0, true)
            //     break                
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
        this.undoRestriction()
        if (!this.processor.isProcessorFromPath(path)) 
            this.processor = path == "root" ? new DriveProcessor() : new DirectoryProcessor(this.settings)
        this.path = this.processor.correctPath(path)
        this.processor.changePath(this.path)
        this.focus()
    }

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
}

