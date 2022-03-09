import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';
import { Entry } from './entry.model';
import { CategoryService } from '../../categories/shared/category.service';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private apiPath: string = 'api/entries';


  constructor(private http: HttpClient, private readonly categoryService: CategoryService) { }

  getAllEntries(): Observable<Entry[]> {
    return this.http.get<Entry[]>(this.apiPath).pipe(
      catchError(this.handleError), map(this.jsonDataToEntries)
    );
  }

  getById(id: number): Observable<Entry> {
    return this.http.get<Entry>(`${this.apiPath}/${id}`).pipe(
      catchError(this.handleError), map(this.jsonDataToEntry)
    );
  }

  create(entry: Entry): Observable<Entry> {

    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        return this.http.post(this.apiPath, entry).pipe(
          catchError(this.handleError), map(this.jsonDataToEntry)
        );
      })
    )
  }

  update(entry: Entry): Observable<Entry> {
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        return this.http.put(this.apiPath, entry).pipe(
          catchError(this.handleError), map(() => entry)
        );
      })
    )
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiPath}/${id}`).pipe(
      catchError(this.handleError), map(() => null))
  }

  private jsonDataToEntries(jsonData: any[]): Entry[] {
    console.log('entrou')
    const entries: Entry[] = [];
    jsonData.forEach(element => {
      entries.push(Object.assign(new Entry(), element));
    })

    return entries;
  }

  private jsonDataToEntry(jsonData: any): Entry {
    return Object.assign(new Entry(), jsonData);
  }

  private handleError(error: any): Observable<any> {
    console.log('ERRO NA REQUISIÇÃO ->, ' + error.body.error)
    return throwError(error.body.error);
  }
}
