import {
  AfterViewInit,
  Component,
  OnInit,
  inject,
  ViewChild,
} from '@angular/core';
import { Student } from '../../Model/student';
import { StudentsService } from '../../Services/students.service';
import { MatTable } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-list-students',
  templateUrl: './list-students.component.html',
  styleUrls: ['./list-students.component.scss'],
})
export class ListStudentsComponent implements OnInit, AfterViewInit {
  studentService: StudentsService = inject(StudentsService);
  router: Router = inject(Router);
  displayedColumns = ['id', 'fullName', 'dob', 'email', 'enrolled', 'favSport'];
  dataSource: Student[];
  resultsLength = 0;
  color: string[] = ['navy', 'green', 'orange', 'lime'];
  isLoading: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table!: MatTable<Student>;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.studentService.totalStudents$.subscribe((e) => {
      this.resultsLength = e;
      this.isLoading = false;
    });
  }

  ngAfterViewInit(): void {
    this.fetchAndAssign();
  }

  handlePageEvent(e: PageEvent) {
    this.fetchAndAssign();
  }

  sortChange(e: Sort) {
    this.fetchAndAssign();
  }

  rowClicked(e: any) {
    const studentId = e._id;
    console.log(studentId);

    this.router.navigate([studentId], { relativeTo: this.activatedRoute });
  }

  fetchAndAssign(): void {
    this.studentService
      .fetchStudents(
        this.paginator.pageSize,
        this.paginator.pageIndex,
        this.sort
      )
      .subscribe((res) => {
        this.dataSource = res;
      });
  }

  getColor(e: any): string {
    let color_temp = '';

    switch (e) {
      case 'Football':
        color_temp = this.color[1];
        break;

      case 'Cricket':
        color_temp = this.color[0];
        break;

      case 'Badminton':
        color_temp = this.color[2];
        break;

      case 'Footy':
        color_temp = this.color[3];
        break;
    }
    return color_temp;
  }
}
