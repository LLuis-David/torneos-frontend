import { Component } from '@angular/core';
import { GLOBAL } from '../../services/global';
import{EventoService} from '../../services/evento.service'

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  public url = GLOBAL.url;
  public eventos :Array<any>= [];
  public publicados :any = {};
  public finalizados :any = {};
  public enCurso :any = {};

  activeTab: 'publicados' | 'finalizados' | 'enCurso' = 'publicados';


   // Método para cambiar de pestaña
   cambiarTab(tab: 'publicados' | 'finalizados' | 'enCurso') {
    this.activeTab = tab;
  }

  // Método para obtener la clase activa (opcional, para simplificar el HTML)
  esActivo(tab: string): boolean {
    return this.activeTab === tab;
  }



  // constructor(
  //   private _eventoService:EventoService
  // ) { }

  // ngOnInit(): void {
  //   this.init_data();
  // }


  // init_data(){
  //   this._eventoService.listar_eventos().subscribe(
  //     response=>{
  //       if(response.eventos){
  //         this.eventos = response.eventos;
  //       }
  //     },
  //     error => {
  //       console.log(<any>error);
  //     } 
        
  //   );
    
  // }
}
