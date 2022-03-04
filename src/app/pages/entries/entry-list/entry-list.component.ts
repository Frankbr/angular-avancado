import { Component, OnInit } from '@angular/core';
import { EntryService } from '../shared/entry.service';
import { Entry } from '../shared/entry.model';


@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.scss']
})
export class EntryListComponent implements OnInit {

  entries: Entry[] = [];

  constructor(private readonly entryService: EntryService) { }


  ngOnInit() {
    this.entryService.getAllEntries().subscribe((entries: Entry[]) =>
        this.entries = entries,
        error => alert(error)
    );
  }

  excluir(entry: Entry): void {
    const mustDelete = confirm('Deseja realmente excluir este item?');

    if(mustDelete) {
      this.entryService.delete(entry.id).subscribe(() => {
        this.entries = this.entries.filter(cat => cat.id !== entry.id)
      });
    }

  }

}
