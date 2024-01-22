import { Component, OnInit, inject } from '@angular/core';
import { Student, StudentWithId } from '../../Model/student';
import { NgForm } from '@angular/forms';
import { StudentsService } from '../../Services/students.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-student',
  templateUrl: './create-student.component.html',
  styleUrls: ['./create-student.component.scss'],
})
export class CreateStudentComponent implements OnInit {
  studentService: StudentsService = inject(StudentsService);
  router: Router = inject(Router);
  isSubmitted: boolean = false;
  submitStudent: StudentWithId;
  emailPatternError: boolean = false;
  student: Student = {
    firstName: '',
    lastName: '',
    email: '',
    dob: undefined,
    gender: undefined,
    enrolled: false,
    year: undefined,
    favSport: '',
    message: undefined,
  };
  options = ['Football', 'Cricket', 'Badminton', 'Footy'];
  gender_options = ['male', 'female'];

  ngOnInit(): void {}

  onSubmit(studentForm: NgForm) {
    if (studentForm.valid) {
      this.studentService.createStudent(this.student).subscribe((res) => {
        this.submitStudent = res;
      });
      this.isSubmitted = true;
    }
  }

  onEmailInputBlur(email) {
    if (email.hasError('pattern')) {
      this.emailPatternError = true;
    } else {
      this.emailPatternError = false;
    }
  }
}
