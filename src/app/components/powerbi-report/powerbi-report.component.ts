
import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import * as pbi from 'powerbi-client';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { powerbiService } from '../../services/powerbi.service';
import { filter } from 'rxjs/operators';

import { SharedStateService } from '../../services/shared-state.service';

@Component({
  selector: 'app-powerbi-report',
  templateUrl: './powerbi-report.component.html',
  styleUrls: ['./powerbi-report.component.css'],
  standalone: true,
  imports: [HttpClientModule, CommonModule],
})
export class PowerBiReportComponent implements OnInit {
  private report: pbi.Report | null = null; 

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private powerbiService: powerbiService
    ,private sharedStateService: SharedStateService
  ) {

    this.updateQuestions(); 
  }
   
  updateQuestions() {
    const newQuestions = [
      {
        question: '¿Qué productos o servicios han mostrado las mayores caídas de ventas en el último trimestre y por qué?',
        api: 'financialperformance/Get-income'
      },
      {
        question: '¿Qué clientes muestran el mayor crecimiento en ventas?',
        api: 'financialperformance/Get-income'
      },
      {
        question: '¿Cómo ha variado el margen de ganancia entre las diferentes unidades de negocio en los últimos 12 meses?',
        api: 'financialperformance/Get-income'
      },
      {
        question: '¿Qué áreas presentan los mayores incrementos en costos y cómo podemos controlarlos?',
        api: 'financialperformance/Get-expenses'
      }
    ];
    // Actualizar las preguntas sugeridas usando el servicio compartido
    this.sharedStateService.updateSuggestedQuestions(newQuestions);

  }

  


  ngOnInit(): void {
    const workspaceId = '98a959ef-cba7-420c-9c1b-4033999fc6fd';
    const reportId = '81946e85-f5d3-423e-994b-9ce0f350df39';
    const datasetId = '6e70e1d6-ffed-4066-9bf0-f6dc9950587f';

   
    const idEmpresa = 2; 

    this.loadPowerBiReport(workspaceId, reportId, datasetId, idEmpresa);
  }

  loadPowerBiReport(
    workspaceId: string,
    reportId: string,
    datasetId: string,
    idEmpresa: number
  ): void {
    const request = {
      workspaceId: workspaceId,
      reportId: reportId,
      datasetId: datasetId,
    };

    this.powerbiService.getToken(request).subscribe((response) => {
      const embedUrl = `https://app.powerbi.com/reportEmbed?reportId=${reportId}&groupId=${workspaceId}`;

      const config: pbi.IEmbedConfiguration = {
        type: 'report',
        id: reportId,
        embedUrl: embedUrl,
        accessToken: response.embedToken,
        tokenType: pbi.models.TokenType.Embed,
        settings: {
          panes: {
            filters: {
              visible: false,
            },
          },
          navContentPaneEnabled: false,
          layoutType: pbi.models.LayoutType.Custom,
          customLayout: {
            displayOption: pbi.models.DisplayOption.FitToWidth,
          },
        },
      };

      const embedContainer = document.getElementById('embedContainer');
      if (embedContainer) {
        const powerbi = new pbi.service.Service(
          pbi.factories.hpmFactory,
          pbi.factories.wpmpFactory,
          pbi.factories.routerFactory
        );

        this.report = powerbi.embed(embedContainer, config) as pbi.Report;

      
        this.report?.on('loaded', () => {
          console.log('Reporte cargado con éxito');
          console.log(`Aplicando filtro para id_empresa: ${idEmpresa}`);

         
          const filter: pbi.models.IBasicFilter = {
            $schema: 'http://powerbi.com/product/schema#basic',
            target: {
              table: 'administracion TbEmpresas',
              column: 'id_empresa',
            },
            operator: 'In',
            values: [idEmpresa],
            filterType: pbi.models.FilterType.Basic, 
          };

          
          if (this.report) {
            this.report!
              .setFilters([filter]) 
              .then(() => {
                console.log(
                  `Filtro aplicado correctamente para id_empresa: ${idEmpresa}`
                );

                
                this.report!
                  .getFilters()
                  .then((filters) => {
                    console.log('Filtros actuales:', filters);
                  })
                  .catch((error) => {
                    console.error(
                      'Error obteniendo los filtros actuales:',
                      error
                    );
                  });
              })
              .catch((error) => {
                console.error(
                  'Error aplicando el filtro con setFilters:',
                  error
                );
              });
          } else {
            console.error('this.report es null o undefined');
          }
        });
      } else {
        console.error('El contenedor de Power BI no se encontró en el DOM.');
      }
    });
  }
}
