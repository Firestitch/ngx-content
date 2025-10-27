import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';

import { HtmlRenderer } from '@firestitch/html';

import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { FS_CONTENT_CONFIG } from '../../../../injectors';
import { FsContentConfig } from '../../../../interfaces';
import { ContentRendererComponent } from '../content-renderer/content-renderer.component';


@Component({
    selector: 'fs-content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [ContentRendererComponent],
})
export class FsContentComponent implements OnInit, OnDestroy {
  private _config = inject<FsContentConfig>(FS_CONTENT_CONFIG);
  private _title = inject(Title);
  private _cdRef = inject(ChangeDetectorRef);
  private _router = inject(Router);
  private _el = inject(ElementRef);
  private _htmlRenderer = inject(HtmlRenderer);


  public contentPage;

  private _destroy$ = new Subject();

  public ngOnInit(): void {
    this._initContent();
    this._initStyles();
  }

  public get el(): any {
    return this._el.nativeElement;
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
    this._title.setTitle('');

    document.querySelector('#content-style')?.remove();
  }

  private _initStyles(): void {
    if(this._config.loadContentStyleCss) {
      this._config.loadContentStyleCss()
        .subscribe((styles) => {
          this._htmlRenderer.addStyle(styles, { id: 'content-style' });
        });
    }
  }

  private _initContent(): void {
    this._loadContent();

    this._router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        takeUntil(this._destroy$),
      )
      .subscribe((e) => {
        this._loadContent();
      });
  }

  private _loadContent() {
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

}
