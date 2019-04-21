import { Component, } from '@angular/core'

@Component({
  selector: 'grid-splitter-test',
  templateUrl: './grid-splitter-test.component.html',
  styleUrls: ['./grid-splitter-test.component.css']
})
export class GridComponent {

    isLastVisible = true

    onClick() {
        this.isLastVisible = !this.isLastVisible
    }

    onRatioChanged() {
        console.log("onRatioChanged")
    }
}
