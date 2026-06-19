import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';


@Component({
  selector: 'app-editor-actions',
  templateUrl: './editor-actions.component.html',
  styleUrls: ['./editor-actions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatButton,
    MatIconButton,
    MatIcon,
    MatTooltip,
  ],
})
export class EditorActionsComponent {

  @Input()
  public saveDisabled = false;

  @Input()
  public isMac = false;

  @Input()
  public previewPath: string = null;

  @Output()
  public settings = new EventEmitter<void>();

  @Output()
  public save = new EventEmitter<void>();

  @Output()
  public done = new EventEmitter<void>();

  @Output()
  public preview = new EventEmitter<void>();

}
