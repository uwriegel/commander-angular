import { Component, AfterViewInit, ViewChild } from '@angular/core'
import { CommanderViewComponent as Commander } from '../../commander-view/commander-view.component'
import { SettingsService } from 'src/app/services/settings.service';

@Component({
    selector: 'app-commander-view-test',
    templateUrl: './commander-view-test.component.html',
    styleUrls: ['./commander-view-test.component.css']
})
export class CommanderViewTestComponent implements AfterViewInit {

    @ViewChild(Commander) private commander: Commander

    ngAfterViewInit() { this.commander.focus() }

    constructor(public settings: SettingsService) {}
}



