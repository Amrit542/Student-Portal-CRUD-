import { Component, Inject, OnInit, inject } from '@angular/core';
import { StudentWithId } from '../../Model/student';
import { CommonModule } from '@angular/common';
import { StudentsService } from '../../Services/students.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';

type sex = 'male' | 'female';
@Component({
  selector: 'app-single-student',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './single-student.component.html',
  styleUrls: ['./single-student.component.scss'],
})
export class SingleStudentComponent implements OnInit {
  studentServie: StudentsService = inject(StudentsService);
  // student$!: Observable<StudentWithId>;
  student: StudentWithId;
  oldStudent: StudentWithId;
  isediting: boolean = false;
  studentsEqual: boolean = true;
  isDelete: boolean = false;
  notFoundStudent: boolean = false;
  parm_id: number;

  options = ['Football', 'Cricket', 'Badminton', 'Footy'];

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.studentServie.fetchSingleStudent(id).subscribe(
          (res) => {
            this.student = res;
            this.oldStudent = { ...res };
          },
          (err) => {
            this.parm_id = +id;
            this.notFoundStudent = true;
          }
        );
      }
    });
  }

  get message(): string {
    return this.student.message ?? '';
  }

  onEnrolledChange() {}

  onEdit() {
    this.isediting = !this.isediting;

    this.studentServie.updateSingleStudent(this.student);
  }

  onSave(studentForm: NgForm) {
    if (studentForm.valid) {
      this.studentServie
        .updateSingleStudent(this.student)
        .subscribe((updateStudent) => {
          console.log('Updated Student ', updateStudent);

          Object.assign(this.oldStudent, updateStudent);
          this.isediting = !this.isediting;
          this.studentsEqual = true;
        });
    }
  }

  onCancel() {
    Object.assign(this.student, this.oldStudent);
    this.isediting = !this.isediting;
    this.studentsEqual = true;
  }

  checkDataChanged() {
    if (!this.student.enrolled) {
      this.student.year = undefined;
    }
    this.studentsEqual = areStudentsEqual(this.student, this.oldStudent);
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogContent, {
      data: this.student,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog result ');
      console.log(result);

      if (result) {
        this.studentServie.deleteStudent(this.student).subscribe((res) => {
          console.log(res);
          this.isDelete = true;
        });
      }
    });
  }
}

function areStudentsEqual<T extends {}>(obj1: T, obj2: T): boolean {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}

@Component({
  selector: 'dialog-content',
  templateUrl: './dialog-data.component.html',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
})
export class DialogContent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: StudentWithId) {}
}
