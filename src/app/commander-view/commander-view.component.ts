import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core'
import { ThemesService } from '../services/themes.service'
import { Columns, ColumnsType } from '../columns/columns.component'
import { ListItem } from '../pipes/virtual-list.pipe'
import { TableViewComponent } from '../table-view/table-view.component'
import { Processor } from '../processors/processor'
import { DriveProcessor } from '../processors/drive-processor'
import { DirectoryProcessor } from '../processors/directory-processor';

@Component({
    selector: 'app-commander-view',
    templateUrl: './commander-view.component.html',
    styleUrls: ['./commander-view.component.css']
})
export class CommanderViewComponent implements OnInit {

    @ViewChild(TableViewComponent) 
    private tableView: TableViewComponent

    @Input() 
    id = ""
    
    @Output() 
    gotFocus: EventEmitter<CommanderViewComponent> = new EventEmitter()    

    processor: Processor
    
    path = "root"
    
    constructor(public themes: ThemesService) { 
        this.processor = new DriveProcessor()
    }

    async ngOnInit() { 
        //this.undoRestriction()
        await this.changePath(this.path)
        this.focus()
    }

    onFocusIn() { 
        this.gotFocus.emit(this) 
        this.focus()
    }

    focus() { 
        this.tableView.focus() 
    }

    onResize() { this.tableView.onResize() }

    onKeydown(evt: KeyboardEvent) {
        switch (evt.which) {
            // case 9: // TAB
            //     if (evt.shiftKey) {
            //         this.input.nativeElement.focus()
            //         evt.stopPropagation()
            //         evt.preventDefault()
            //     }    
            //     break
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

    changePath(path: string) {
        if (!this.processor.isProcessorFromPath(path)) 
            this.processor = path == "root" ? new DriveProcessor() : new DirectoryProcessor()
        this.path = this.processor.correctPath(this.path)
        this.processor.changePath(this.path)
        this.focus()
    }

    private processItem()  {
        const item = this.tableView.getCurrentItem()
        if (!this.processor.processItem(this.path, item)) {
            if (!this.processor.isProcessor(item))
                this.processor = (item as any).isRoot ? new DriveProcessor() : new DirectoryProcessor()
            this.path = this.processor.correctPath(this.path, item.name)
            this.processor.changePath(this.path)
            this.focus()
        }
    }
}

