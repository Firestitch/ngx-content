import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import { NgClass } from '@angular/common';


@Component({
    selector: 'app-editor-label',
    templateUrl: './editor-label.component.html',
    styleUrls: ['./editor-label.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [NgClass],
})
export class EditorLabelComponent {

  @Input()
  public changed: boolean;

  @Input()
  public focused: boolean;

}
