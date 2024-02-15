import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { HtmlRenderer } from '@firestitch/html';

import { Subject } from 'rxjs';


@Component({
  selector: 'fs-content-renderer',
  templateUrl: './content-renderer.component.html',
  styleUrls: ['./content-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentRendererComponent implements OnDestroy, AfterViewChecked, OnChanges{

  @ViewChild('script', { read: ElementRef })
  public script: ElementRef;

  @Input() public contentPage;

  public content: SafeHtml;

  private _destroy$ = new Subject();

  constructor(
    private _sanitizer: DomSanitizer,
    private _router: Router,
    private _el: ElementRef,
    private _htmlRenderer: HtmlRenderer,
  ) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if(changes.contentPage.currentValue) {
      this._htmlRenderer.addStyle(this.contentPage.styles, { id: 'contentPageStyles' });
      this.content = this._sanitizer.bypassSecurityTrustHtml(this.contentPage.content);
    }
  }

  public ngAfterViewChecked(): void {
    this.registerHrefs();

    if(this.contentPage.js) {
      const script = document.createElement('script');
      script.text = this.contentPage.js;
      this.script.nativeElement.after(script);
    }
  }

  public registerHrefs(): void {
    Array.from(this.el.querySelectorAll('a[href]'))
      .filter((el: Element) => {
        return el.getAttribute('href').match(/^\//);
      })
      .forEach((el: Element) => {
        el.addEventListener('click',(event: MouseEvent) => {
          if(!event.shiftKey && !event.ctrlKey) {
            event.preventDefault();
            const href = el.getAttribute('href');
            this._router.navigateByUrl(href);
          }
        });
      });
  }

  public get el(): any {
    return this._el.nativeElement;
  }

  public ngOnDestroy(): void {
    this.removeStyles();
    this._destroy$.next();
    this._destroy$.complete();
  }

  public removeStyles(): void {
    const el = document.querySelector('#contentPageStyles');
    if(el) {
      el.remove();
    }
  }

}
