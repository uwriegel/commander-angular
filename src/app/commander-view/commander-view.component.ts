import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core'
import { ThemesService } from '../services/themes.service'
import { TableViewComponent } from '../table-view/table-view.component'
import { Processor } from '../processors/processor'
import { DriveProcessor } from '../processors/drive-processor'
import { DirectoryProcessor } from '../processors/directory-processor'

@Component({
    selector: 'app-commander-view',
    templateUrl: './commander-view.component.html',
    styleUrls: ['./commander-view.component.css']
})
export class CommanderViewComponent implements OnInit {

    @ViewChild(TableViewComponent) 
    private tableView: TableViewComponent

    @ViewChild("input") 
    private input: ElementRef

    @Input() 
    id = ""
    
    @Output() 
    gotFocus: EventEmitter<CommanderViewComponent> = new EventEmitter()    

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
    
    constructor(public themes: ThemesService) { 
        this.processor = new DriveProcessor()
    }

    async ngOnInit() { 
        //this.undoRestriction()
        
        setTimeout(() => this.changePath(this.path))
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
        if (!this.processor.isProcessorFromPath(path)) 
            this.processor = path == "root" ? new DriveProcessor() : new DirectoryProcessor()
        this.path = this.processor.correctPath(path)
        this.processor.changePath(this.path)
        this.focus()
    }

    private processItem()  {
        const recentPath = this.path
        const item = this.tableView.getCurrentItem()
        if (!this.processor.processItem(this.path, item)) {
            if (!this.processor.isProcessor(item))
                this.processor = (item as any).isRoot ? new DriveProcessor() : new DirectoryProcessor()
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
}

