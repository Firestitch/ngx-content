import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { MatButtonToggle, MatButtonToggleChange, MatButtonToggleGroup } from '@angular/material/button-toggle';

import { EditorType } from '../../../../enums';


@Component({
  selector: 'app-editor-toggles',
  templateUrl: './editor-toggles.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatButtonToggleGroup,
    MatButtonToggle,
  ],
})
export class EditorTogglesComponent {

  @Input()
  public editors: Record<string, boolean>;

  @Input()
  public showJs = false;

  @Output()
  public toggleChange = new EventEmitter<MatButtonToggleChange>();

  public EditorType = EditorType;

}
