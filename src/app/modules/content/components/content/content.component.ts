import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  ElementRef,
  Inject,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';

import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { FS_CONTENT_CONFIG } from '../../../../injectors';
import { FsContentConfig } from '../../../../interfaces';


@Component({
  selector: 'fs-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsContentComponent implements OnInit, OnDestroy {

  public contentPage;
  
  private _destroy$ = new Subject();

  constructor(
    @Inject(FS_CONTENT_CONFIG) private _config: FsContentConfig,
    private _title: Title,
    private _cdRef: ChangeDetectorRef,
    private _router: Router,
    private _el: ElementRef,
  ) {}

  public ngOnInit(): void {
    this.load();

    this._router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this.load();
      });
  }

  public load(): void {
    const path = (window as any).location.pathname;
    this._config.loadContent(path)
      .subscribe((contentPage) => {
        if(contentPage.title) {
          this._title.setTitle(contentPage.title);

          let ogTitleEl = document.querySelector('head meta[property="og:title"]');
          if(!ogTitleEl) {
            ogTitleEl = document.createElement('meta');
            ogTitleEl.setAttribute('property','og:title');
            document.getElementsByTagName('head')[0].appendChild(ogTitleEl);
          }

          ogTitleEl.setAttribute('content',contentPage.title);
        }

        this.contentPage = contentPage;
        this._cdRef.markForCheck();
      });
  }

  public get el(): any {
    return this._el.nativeElement;
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    this._title.setTitle('');
  }

}
