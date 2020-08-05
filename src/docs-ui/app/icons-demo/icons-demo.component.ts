import { Component } from '@angular/core';
import { TdIcon, TD_ICONS } from '../../../lib/theme/utilities/icons';

@Component({
  selector: 'app-icons-demo',
  templateUrl: './icons-demo.component.html',
  styleUrls: ['./icons-demo.component.scss'],
})
export class IconsDemoComponent {
  icons: TdIcon[] = TD_ICONS;
}
