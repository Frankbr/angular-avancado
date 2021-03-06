import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../shared/category.service';
import { switchMap } from 'rxjs/operators';
import toastr from "toastr";
import { Category } from '../shared/category.model';


@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked{

  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string [] = null;
  submittingForm: boolean = false;
  category: Category = new Category();

  constructor(private readonly route: ActivatedRoute,
              private readonly router: Router,
              private readonly formBuilder: FormBuilder,
              private readonly categoryService: CategoryService) { }

  ngOnInit() {

    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;
    if(this.currentAction == "new") {
      this.createCategory();
    } else {
      this.updateCategory();
    }

  }

  // PRIVATE METHODS
  private setCurrentAction() {
    if(this.route.snapshot.url[0].path == "new"){
      this.currentAction = "new";
    } else {
      this.currentAction = "edit";
    }
  }

  private buildCategoryForm() {
    this.categoryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
    })
  }

  private loadCategory() {
    if(this.currentAction == "edit") {
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get("id")))
      ).subscribe((category: Category) => {
        this.category = category;
        this.categoryForm.patchValue(category);
      })
    }
  }

  private setPageTitle() {
    if(this.currentAction == "new") {
      this.pageTitle = "Cadastro de Nova Categoria"
    } else {
      const categoryName = this.category.name || ""
      this.pageTitle = "Editando Categoria: " + categoryName;
    }
  }

  private createCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.create(category).subscribe(category =>
      this.actionsForSucess(category),
      (error) => this.actionForError(error),

    );
  }

  private actionsForSucess(category:Category) {
    toastr.success("Solicita????o processada com Sucesso!");
    this.router.navigateByUrl("categories", {skipLocationChange: true}).then(() => {
      this.router.navigate(["categories", category.id, "edit"])
    })
  }

  private actionForError(error){
    toastr.error("Ocorreu um erro ao processar a sua solicita????o!");
    this.submittingForm = false;

    if(error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessages = ["Falha na comunica????o com o servidor. Por favor, Tente novamente mais tarde."]
    }
  }

  private updateCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.update(category).subscribe(category =>
      this.actionsForSucess(category),
      (error) => this.actionForError(error),
    );
  }

}
