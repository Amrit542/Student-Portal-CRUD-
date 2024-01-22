import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Student, StudentWithId } from '../Model/student';
import { Sort } from '@angular/material/sort';
import { catchError, map, single, tap } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StudentsService {
  allStudents: Student[];
  totalStudents$ = new BehaviorSubject<number>(3);

  private baseUrl: string = 'http://localhost:3000/students';

  constructor(private http: HttpClient) {}

  // fetchStudents() : Observable<Student[]> {

  //  return this.http.get<Student[]>(this.baseUrl+'/all').pipe(map(dataArray => {
  //   dataArray.forEach(singleStudent => {

  //     // Change the date/time object to just date
  //     const dob: Date | string   = singleStudent['dob']!;
  //     if (typeof dob == 'string') {
  //       const newDate = new Date(dob).toISOString().split('T')[0];
  //       singleStudent['dob'] = newDate;
  //     }

  //     return singleStudent
  //   })

  //   return dataArray;

  //  }),catchError(this.handleError));
  // }

  fetchStudents(
    pageSize = 0,
    pageIndex = 5,
    sort: Sort
  ): Observable<StudentWithId[]> {
    return this.http.get<StudentWithId[]>(this.baseUrl + '/all').pipe(
      map((dataArray) => {
        dataArray.forEach((singleStudent) => {
          // Change the date/time object to just date
          const dob: Date | string = singleStudent['dob']!;
          if (typeof dob == 'string') {
            const newDate = new Date(dob).toISOString().split('T')[0];
            singleStudent['dob'] = newDate;
          }

          return singleStudent;
        });

        this.totalStudents$.next(dataArray.length);
        const startIndex = pageIndex * pageSize;
        const splicedArray = dataArray.splice(startIndex, pageSize);
        return this.getSortedData(splicedArray, sort);
      }),
      catchError(this.handleError)
    );
  }

  fetchSingleStudent(id: string): Observable<StudentWithId> {
    return this.http.get<StudentWithId>(this.baseUrl + '/' + id).pipe(
      map((singleStudent) => {
        console.log(typeof singleStudent['dob']);

        const dob: Date | string = singleStudent['dob']!;
        if (typeof dob == 'string') {
          const newDate = new Date(dob).toISOString().split('T')[0];
          singleStudent['dob'] = newDate;
        }

        const capitalise = (name: string) => {
            return  name[0].toUpperCase() + name.slice(1)
        }

        singleStudent.firstName = capitalise(singleStudent.firstName)
        singleStudent.lastName = capitalise(singleStudent.lastName)

        return singleStudent;
      }),
      catchError(this.handleError)
    );
  }

  updateSingleStudent(student: StudentWithId) : Observable<StudentWithId>{
    
    return this.http.patch<StudentWithId>(this.baseUrl + '/update/'+ student._id, student).pipe(
      catchError(this.handleError)
    );
  }

  createStudent(student: Student): Observable<StudentWithId> {
    return this.http.post<StudentWithId>(this.baseUrl + '/create', student).pipe(
      catchError(this.handleError)
    );
  }

  getPagedData(data: Student[], pageSize = 0, pageIndex = 3): Student[] {
    const startIndex = pageIndex * pageSize;
    return data.splice(startIndex, pageSize);
  }

  getSortedData(data: StudentWithId[], sort: Sort): StudentWithId[] {
    const e = data.sort((a, b) => {
      const isAsc = sort?.direction === 'asc';
      switch (sort?.active) {
        case 'fullName':
          return compare(a.firstName, b.firstName, isAsc);
        case 'id':
          return compare(+a._id, +b._id, isAsc);
        default:
          return 0;
      }
    });

    return e;
  }


  deleteStudent(student: StudentWithId) : Observable<StudentWithId> {
    return this.http.delete<StudentWithId>(this.baseUrl+ '/'+ student._id).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.log('message ', error.error.message);
    console.log(error.status);

    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}

function compare(
  a: string | number,
  b: string | number,
  isAsc: boolean
): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
