import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core'

@Component({
    selector: 'app-commander-view',
    templateUrl: './commander-view.component.html',
    styleUrls: ['./commander-view.component.css']
})
export class CommanderViewComponent implements OnInit {

    @Input() 
    id = ""
    @Output() 
    private gotFocus: EventEmitter<CommanderViewComponent> = new EventEmitter()    
    
    constructor() { }

    ngOnInit() {  }

    onFocusIn() { this.gotFocus.emit(this) }

    focus() { 
    //    this.tableView.focus() 
    }
}
