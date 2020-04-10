import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'vui-account-profile-menu',
  templateUrl: './account-profile-menu.component.html',
  styleUrls: ['./account-profile-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VantageAccountProfileMenuComponent {
  @Input() email: string;
  @Input() name: string;

  _blockEvent(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }
}
