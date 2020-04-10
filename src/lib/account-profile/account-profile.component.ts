import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'vui-account-profile',
  templateUrl: './account-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VantageAccountProfileComponent {
  @Input() name: string;
  @Input() email: string;
}
