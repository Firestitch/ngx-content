import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FsContentComponent } from '../../../../src/app/modules/content/components/content/content.component';


@Component({
    selector: 'app-content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [FsContentComponent],
})
export class ContentComponent {


}
