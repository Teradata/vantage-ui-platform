import { Component, OnInit } from '@angular/core';
import { IMarkdownNavigatorItem } from '@covalent/markdown-navigator';
@Component({
  selector: 'app-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.scss'],
})
export class TypographyComponent {
  items: IMarkdownNavigatorItem[] = [
    {
      title: 'Covalent',
      description: 'Terdata UI Platform',
      icon: 'whatshot',
      url: 'https://raw.githubusercontent.com/ngx-translate/core/master/README.md',
    },
  ];
}
