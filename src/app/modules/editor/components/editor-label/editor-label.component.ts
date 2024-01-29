import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';


@Component({
  selector: 'app-editor-label',
  templateUrl: './editor-label.component.html',
  styleUrls: ['./editor-label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorLabelComponent {

  @Input()
  public changed: boolean;

  @Input()
  public focused: boolean;

}
