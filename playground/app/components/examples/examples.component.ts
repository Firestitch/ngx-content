import { Component } from '@angular/core';
import { environment } from '@env';
import { FsExampleModule } from '@firestitch/example';
import { ContentPagesComponent } from '../content-pages/content-pages.component';
import { ContentLayoutsComponent } from '../content-layouts/content-layouts.component';
import { ContentStyleComponent } from '../content-style/content-style.component';
import { ContentComponent } from '../content/content.component';


@Component({
    templateUrl: 'examples.component.html',
    standalone: true,
    imports: [FsExampleModule, ContentPagesComponent, ContentLayoutsComponent, ContentStyleComponent, ContentComponent]
})
export class ExamplesComponent {
  public config = environment;
}
