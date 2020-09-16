import { ContatoService } from './../contato.service';
import { Component, OnInit } from '@angular/core';
import { Contato } from './contato'

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent implements OnInit {

  formulario: FormGroup;
  contatos: Contato [] = [];
  colunas = ['foto','id','nome','email','favorito'];

  constructor(
    private service: ContatoService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.montarForm();
    this.listarContatos();
  }

  listarContatos(){
    this.service.list().subscribe(reponse => {
      this.contatos = reponse;
    });
  }

  favoritar(contato: Contato){
    this.service.favorito(contato).subscribe(response => {
      contato.favorito = !contato.favorito;
    })
  }

  montarForm(){
    this.formulario = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]]
    });
  }

  submit() {
    const formValues = this.formulario.value;
    const contato: Contato = new Contato(formValues.nome, formValues.email);
    this.service.save(contato).subscribe(response => {
      let lista: Contato[] = [...this.contatos, response];
      this.contatos = lista;
    })
  }

  uploadFoto(event, contato){
    const files = event.target.files;
    if(files){
      const foto = files[0];
      const formData: FormData = new FormData;
      formData.append("foto", foto);
      this.service.upload(contato, formData).subscribe(reponse => this.listarContatos());
    }
  }
}
