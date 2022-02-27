import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../shared/category.service';
import { Category } from '../shared/category.model';


@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {

  categories: Category[] = [];

  constructor(private readonly categoryService: CategoryService) { }


  ngOnInit() {
    this.categoryService.getAllCategories().subscribe((categories: Category[]) =>
        this.categories = categories,
        error => alert(error)
    );
  }

  excluir(category: Category): void {
    const mustDelete = confirm('Deseja realmente excluir este item?');

    if(mustDelete) {
      this.categoryService.delete(category.id).subscribe(() => {
        this.categories = this.categories.filter(cat => cat.id !== category.id)
      });
    }

  }

}
