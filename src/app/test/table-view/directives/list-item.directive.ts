import { Directive, Input, OnInit, ViewContainerRef, ComponentFactoryResolver, Renderer2 } from '@angular/core'
import { ListItem } from 'src/app/pipes/virtual-list.pipe'
import { ItemTemplateComponent } from '../item-template/item-template.component'

@Directive({
    selector: '[appListItem]'
})
export class ListItemDirective implements OnInit {

    @Input("item")
    item: ListItem

    constructor(private viewContainerRef: ViewContainerRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private renderer: Renderer2) { }

    ngOnInit(): void {
        console.log(`On Init mit ${this.item}`)

        this.viewContainerRef.clear();
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ItemTemplateComponent)
        let componentRef = this.viewContainerRef.createComponent(componentFactory) 
        let component = componentRef.instance as ItemTemplateComponent
        component.item = this.item
    }
}
