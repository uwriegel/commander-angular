import { Component, ViewChild, OnInit } from '@angular/core'
import { ScrollbarComponent as ScrollBar } from "../../scrollbar/scrollbar.component"
import { Columns } from 'src/app/columns/columns.component'
import { ListItem } from '../../pipes/virtual-list.pipe'
const extfs = (window as any).require('extension-fs')
interface FileItem extends ListItem {
    displayName: string
    size: number
    time: Date
    isDirectory: boolean
    isHidden: boolean
}
const getFiles: (path: string)=>Promise<FileItem[]> = extfs.getFiles

@Component({
    selector: 'app-test-scrollbar',
    templateUrl: './scrollbar.component.html',
    styleUrls: ['./scrollbar.component.css']
})
export class ScrollbarComponent implements OnInit {

    @ViewChild(ScrollBar) private scrollBar: ScrollBar
    items: ListItem[] = []
    
    ngOnInit() { 
        this.onNew()
    }

    onNew() {
        const index = this.seed++ % 3
        const dir = this.dirs[index]
        this.get(dir)
    }

    async get(path: string) { 
        let items = await getFiles(path) 
        items[0].isCurrent = true
        this.items = items
    }

    onKeyDown(evt: KeyboardEvent) {
        switch (evt.which) {
            case 33:
                this.pageUp()
                break
            case 34:
                this.pageDown()
                break
            case 35: // End
                this.end()
                break
            case 36: //Pos1
                this.pos1()
                break
            case 38:
                this.upOne()
                break
            case 40:
                this.downOne()
                break
            default:
                return // exit this handler for other keys
        }
        evt.preventDefault() // prevent the default action (scroll / move caret)
    }

    private getCurrentIndex(defaultValue?: number) { 
        const index = this.items.findIndex(n => n.isCurrent) 
        if (index != -1 || defaultValue == null)
            return index
        else
            return defaultValue
    }

    private setCurrentIndex(index: number, lastIndex?: number) {
        if (lastIndex == null) 
            lastIndex = this.getCurrentIndex(0)
        this.items[lastIndex].isCurrent = false
        this.items[index].isCurrent = true
        this.scrollBar.scrollIntoView(index)
    }

    private downOne() {
        const index = this.getCurrentIndex(0)
        const nextIndex = index < this.items.length - 1 ? index + 1 : index
        this.setCurrentIndex(nextIndex, index)
    }

    private upOne() {
        const index = this.getCurrentIndex(0)
        const nextIndex = index > 0 ? index - 1 : index
        this.setCurrentIndex(nextIndex, index)
    }    

    private pageDown() {
        const index = this.getCurrentIndex(0)
        const nextIndex = index < this.items.length - this.scrollBar.itemsCapacity + 1 ? index + this.scrollBar.itemsCapacity - 1: this.items.length - 1
        this.setCurrentIndex(nextIndex, index)
    }

    private pageUp() {
        const index = this.getCurrentIndex(0)
        const nextIndex = index > this.scrollBar.itemsCapacity - 1? index - this.scrollBar.itemsCapacity + 1: 0
        this.setCurrentIndex(nextIndex, index)
    }

    private end() { this.setCurrentIndex(this.items.length - 1) } 
    
    private pos1() { this.setCurrentIndex(0) } 

    private dirs = [ "c:\\", "c:\\windows", "c:\\windows\\system32"]
    //private dirs = [ "/", "/usr/share", "/opt"]
    
    private seed = 0
}

