import { Component, OnInit } from '@angular/core';
import { FsContentLayoutsComponent } from '../../../../src/app/modules/content-layouts/components/content-layouts/content-layouts.component';


@Component({
    selector: 'app-content-layouts',
    templateUrl: './content-layouts.component.html',
    styleUrls: ['./content-layouts.component.scss'],
    standalone: true,
    imports: [FsContentLayoutsComponent]
})
export class ContentLayoutsComponent implements OnInit {

  constructor() { }

  public ngOnInit(): void {
 
  }

}
