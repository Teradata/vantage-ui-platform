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
      url: 'https://github.com/Teradata/covalent/blob/develop/README.md',
    },
  ];
}
