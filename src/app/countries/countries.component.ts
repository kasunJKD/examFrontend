import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

export class Countries {
  constructor(
    public id: number,
    public country: string
  ){   
  }
}

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  countries: Countries[]
  closeResult: string;
  editForm: FormGroup;
  private deleteId: number;
  

  constructor(
    private httpClient: HttpClient,
    private modalService: NgbModal,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.getCountries();

    this.editForm = this.fb.group({
      country: ['']
    });
  }

  getCountries(){
    this.httpClient.get<any>('http://localhost:9001/countries').subscribe(
      response => {
        console.log(response);
        this.countries = response;
      }
    );
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onSubmit(f: NgForm) {
    const url = 'http://localhost:9001/countries/addnew';
    this.httpClient.post(url, f.value)
      .subscribe((result) => {
        this.ngOnInit(); 
      });
    this.modalService.dismissAll(); 
  }

  openEdit(contentEdit, c:Countries){
    this.modalService.open(contentEdit, {
      backdrop: 'static',
      size: 'lg'
    });
    this.editForm.patchValue( { 
      country: c.country,
    });
  }

  onSave() {
    const editURL = 'http://localhost:9001/countries/' + this.editForm.value.country + '/edit';
    this.httpClient.put(editURL, this.editForm.value.country)
      .subscribe((results) => {
        this.ngOnInit();
        this.modalService.dismissAll();
      });
  }

  openDelete(contentDelete, c:Countries) {
    this.deleteId = c.id;
    this.modalService.open(contentDelete, {
      backdrop: 'static',
      size: 'lg'
    });
  }

  onDelete() {
    const deleteURL = 'http://localhost:9001/countries/' + this.deleteId + '/delete';
    this.httpClient.delete(deleteURL)
      .subscribe((results) => {
        this.ngOnInit();
        this.modalService.dismissAll();
      });
  }

}
