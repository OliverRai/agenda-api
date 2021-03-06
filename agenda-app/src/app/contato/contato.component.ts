import { MatSnackBar } from '@angular/material/snack-bar';
import { ContatoService } from './../contato.service';
import { Component, OnInit } from '@angular/core';
import { Contato } from './contato'

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog'

import { ContatoDetalheComponent } from '../contato-detalhe/contato-detalhe.component'
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-contato',
  templateUrl: './contato.component.html',
  styleUrls: ['./contato.component.css']
})
export class ContatoComponent implements OnInit {

  formulario: FormGroup;
  contatos: Contato [] = [];
  colunas = ['foto','id','nome','email','favorito'];
  totalElementos = 0;
  pagina = 0;
  tamanho = 10;
  pageSizeOptionals: number[] =[10];

  constructor(
    private service: ContatoService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.montarForm();
    this.listarContatos(this.pagina , this.tamanho);
  }

  listarContatos(pagina = 0, tamanho = 10){
    this.service.list(pagina, tamanho).subscribe(reponse => {
      this.contatos = reponse.content;
      this.totalElementos = reponse.totalElements;
      this.pagina = reponse.number;
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
      this.listarContatos();
      this.snackBar.open('Contato inserido', 'Sucesso!', {
        duration: 2000
      });
      this.formulario.reset();
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

  visualizarContato(contato: Contato){
    this.dialog.open(ContatoDetalheComponent, {
      width: '400px',
      height:' 450px',
      data: contato
    });
  }

  paginar(event: PageEvent){
    this.pagina = event.pageIndex
    this.listarContatos(this.pagina, this.tamanho);
  }
}
