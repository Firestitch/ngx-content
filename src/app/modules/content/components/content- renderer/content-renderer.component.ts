import {
  Component,
  ChangeDetectionStrategy,
  OnDestroy,
  ElementRef,
  Input,
  AfterViewChecked,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Subject } from 'rxjs';


@Component({
  selector: 'fs-content-renderer',
  templateUrl: './content-renderer.component.html',
  styleUrls: ['./content-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentRendererComponent implements OnDestroy, AfterViewChecked {

  @Input() public set contentPage(contentPage) {
    if(contentPage) {
      this.content = this._sanitizer.bypassSecurityTrustHtml(contentPage.content);
      this.styles = contentPage.styles;
    }
  }

  public content;
  public styles;
  public _destroy$ = new Subject();

  constructor(
    private _sanitizer: DomSanitizer,
    private _router: Router,
    private _el: ElementRef,
  ) {}

  public ngAfterViewChecked(): void {
    let el = document.querySelector('#contentPageStyles');
    if(!el) {
      el = document.createElement('style');
      el.setAttribute('id','contentPageStyles');
      document.getElementsByTagName('head')[0].appendChild(el);
    }

    el.innerHTML = this.styles;

    this.registerHrefs();
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
