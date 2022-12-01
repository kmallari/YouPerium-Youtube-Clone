import { NgModule } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';



@NgModule({
  declarations: [],
  imports: [
    MatDatepickerModule, 
    MatFormFieldModule, 
    MatNativeDateModule,
    MatIconModule,
    MatCheckboxModule,
    MatInputModule
  ],
  exports : [
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatIconModule,
    MatCheckboxModule,
  ]
})
export class MaterialModule { }
