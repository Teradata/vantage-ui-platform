import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-mat-components',
  templateUrl: './mat-components.component.html',
  styleUrls: ['./mat-components.component.scss'],
})
export class MatComponentsComponent {
  lastDialogResult: string;
  mode: string;
  value: number;

  foods: any[] = [
    { name: 'Pizza', rating: 'Excellent' },
    { name: 'Burritos', rating: 'Great' },
    { name: 'French fries', rating: 'Pretty good' },
  ];

  public selectedValue: string;

  public games: any[] = [
    { value: 'rts-0', viewValue: 'Starcraft' },
    { value: 'rpg-1', viewValue: "Baldur's Gate" },
    { value: 'fps-2', viewValue: 'Doom' },
  ];

  public progress: number = 0;
  public slider: any = {
    autoTicks: false,
    disabled: false,
    invert: false,
    max: 100,
    min: 0,
    showTicks: false,
    step: 1,
    thumbLabel: false,
    value: 0,
    vertical: false,
    tickInterval: 1,
    checked: true,
  };
  public tiles: any = [
    { text: 'One', cols: 3, rows: 1, color: 'lightblue' },
    { text: 'Two', cols: 1, rows: 2, color: 'lightgreen' },
    { text: 'Three', cols: 1, rows: 1, color: 'lightpink' },
    { text: 'Four', cols: 2, rows: 1, color: '#DDBDF1' },
  ];

  public color: string;

  public availableColors: any[] = [
    { name: 'none', color: '' },
    { name: 'Primary', color: 'primary' },
    { name: 'Accent', color: 'accent' },
    { name: 'Warn', color: 'warn' },
  ];

  constructor(private _dialog: MatDialog, private _snackbar: MatSnackBar) {
    // Update the value for the progress-bar on an interval.
    setInterval(() => {
      this.progress = (this.progress + Math.floor(Math.random() * 4) + 1) % 100;
    }, 200);
  }

  openDialog(): void {
    const dialogRef: any = this._dialog.open(DialogContentComponent);

    dialogRef.afterClosed().subscribe((result: any) => {
      this.lastDialogResult = result;
    });
  }

  showSnackbar(): void {
    this._snackbar.open('YUM SNACKS', 'CHEW');
  }
  get tickInterval(): number | 'auto' {
    return this.slider.showTicks ? (this.slider.autoTicks ? 'auto' : this.slider.tickInterval) : undefined;
  }
  set tickInterval(v: number | 'auto') {
    this.slider.tickInterval = Number(v);
  }
}

@Component({
  template: `
    <h1 matDialogTitle>This is a dialog</h1>
    <div matDialogContent>
      <mat-form-field>
        <label>
          This is a text box inside of a dialog.
          <input matInput #dialogInput />
        </label>
      </mat-form-field>
    </div>
    <div matDialogActions>
      <button mat-button [matDialogClose]="dialogInput.value">CLOSE</button>
    </div>
  `,
})
export class DialogContentComponent {
  constructor(public dialogRef: MatDialogRef<DialogContentComponent>) {}
}
