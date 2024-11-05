//Sirve el filtro de la empresa

/* 
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
  private pageId: string | null = null; // Variable para almacenar el ID de la pestaña


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
    //const reportId = '8575db14-1f71-4349-a6b2-157821a8cb4b'
    //const datasetId = '5d18f554-fe38-4b39-bc80-632c8baa7075';

   
    

   
    const idEmpresa = 3; 
    this.pageId = this.route.snapshot.paramMap.get('pageId'); 
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

      console.log(embedUrl); 

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
        pageName: this.pageId || undefined, // Asigna el ID de la pestaña dinámicamente
        //pageName: '0d9c49b19d0a7dfe1135',
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
} */

//sirve el cambio de las pestañas  

import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import * as pbi from 'powerbi-client';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { powerbiService } from '../../services/powerbi.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-powerbi-report',
  templateUrl: './powerbi-report.component.html',
  styleUrls: ['./powerbi-report.component.css'],
  standalone: true,
  imports: [HttpClientModule, CommonModule],
})
export class PowerBiReportComponent implements OnInit {
  private report: pbi.Report | null = null; // Inicializamos como null

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router, private powerbiService: powerbiService) {}

  ngOnInit(): void {
    const workspaceId = "98a959ef-cba7-420c-9c1b-4033999fc6fd";
    const reportId = "81946e85-f5d3-423e-994b-9ce0f350df39";
    const datasetId = "6e70e1d6-ffed-4066-9bf0-f6dc9950587f";
    const idEmpresa = '1'; // Cambia esto para probar diferentes valores

    // Detectar el primer valor de pageName desde la URL
    let pageName = this.route.snapshot.paramMap.get('pageName') || '';

    this.loadPowerBiReport(workspaceId, reportId, datasetId, pageName, idEmpresa);

    // Detectar cambio de pestaña (ruta) y recargar el informe
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      // Obtener el nuevo pageName desde la URL y recargar el informe
      pageName = this.route.snapshot.paramMap.get('pageName') || '';
      this.loadPowerBiReport(workspaceId, reportId, datasetId, pageName, idEmpresa);
    });
  }

  loadPowerBiReport(workspaceId: string, reportId: string, datasetId: string, pageName: string, idEmpresa: string): void {
    const request = { workspaceId: workspaceId, reportId: reportId, datasetId: datasetId };

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
        const powerbi = new pbi.service.Service(pbi.factories.hpmFactory, pbi.factories.wpmpFactory, pbi.factories.routerFactory);

        if (this.report) {
          // Si ya hay un informe embebido, simplemente navega a la nueva página
          this.report.getPages().then((pages) => {
            const page = pages.find(p => p.name === pageName);
            if (page) {
              page.setActive();
            }
          });
        } else {
          // Si es la primera vez que se carga el informe, embébelo
          this.report = powerbi.embed(embedContainer, config) as pbi.Report;

          this.report.on('loaded', () => {
            console.log('Reporte cargado con éxito');

            // Verificar que this.report no sea null
            if (this.report) {
              // Aplicar el filtro para id_empresa
              const filter = {
                $schema: "http://powerbi.com/product/schema#basic",
                target: {
                  table: "administracion.TbCliente",
                  column: "id_empresa",
                },
                operator: "In",
                values: [idEmpresa],
              } as pbi.models.IBasicFilter;

              this.report.updateFilters(pbi.models.FiltersOperations.Replace, [filter])
                .then(() => {
                  console.log(`Filter applied for id_empresa: ${idEmpresa}`);
                })
                .catch((error) => {
                  console.error('Error applying filter:', error);
                });
            }
          });
        }
      } else {
        console.error('El contenedor de Power BI no se encontró en el DOM.');
      }
    });
  }
}
 

/* import { Component, OnInit } from '@angular/core';
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
  private pageId: string | null = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private powerbiService: powerbiService,
    private sharedStateService: SharedStateService
  ) {
    this.updateQuestions();
  }

  updateQuestions() {
    const newQuestions = [
      { question: '¿Qué productos o servicios han mostrado las mayores caídas de ventas en el último trimestre y por qué?', api: 'financialperformance/Get-income' },
      { question: '¿Qué clientes muestran el mayor crecimiento en ventas?', api: 'financialperformance/Get-income' },
      { question: '¿Cómo ha variado el margen de ganancia entre las diferentes unidades de negocio en los últimos 12 meses?', api: 'financialperformance/Get-income' },
      { question: '¿Qué áreas presentan los mayores incrementos en costos y cómo podemos controlarlos?', api: 'financialperformance/Get-expenses' }
    ];
    this.sharedStateService.updateSuggestedQuestions(newQuestions);
  }

  ngOnInit(): void {
    const workspaceId = '98a959ef-cba7-420c-9c1b-4033999fc6fd';
    const reportId = '81946e85-f5d3-423e-994b-9ce0f350df39';
    const datasetId = '6e70e1d6-ffed-4066-9bf0-f6dc9950587f';
    const idEmpresa = 3;
    this.pageId = this.route.snapshot.paramMap.get('pageId');

    // Cargar el reporte inicialmente
    this.loadPowerBiReport(workspaceId, reportId, datasetId, idEmpresa);

    // Detectar cambio de pestaña en la URL y actualizar la pestaña activa
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const newPageId = this.route.snapshot.paramMap.get('pageId') || '';
        this.setPage(newPageId); // Cambiar solo la pestaña sin recargar el reporte completo
      });
  }

  loadPowerBiReport(
    workspaceId: string,
    reportId: string,
    datasetId: string,
    idEmpresa: number
  ): void {
    const request = { workspaceId: workspaceId, reportId: reportId, datasetId: datasetId };

    this.powerbiService.getToken(request).subscribe((response) => {
      const embedUrl = `https://app.powerbi.com/reportEmbed?reportId=${reportId}&groupId=${workspaceId}`;

      const config: pbi.IEmbedConfiguration = {
        type: 'report',
        id: reportId,
        embedUrl: embedUrl,
        accessToken: response.embedToken,
        tokenType: pbi.models.TokenType.Embed,
        settings: {
          panes: { filters: { visible: false }},
          navContentPaneEnabled: false,
          layoutType: pbi.models.LayoutType.Custom,
          customLayout: { displayOption: pbi.models.DisplayOption.FitToWidth }
        }
      };

      const embedContainer = document.getElementById('embedContainer');
      if (embedContainer) {
        const powerbi = new pbi.service.Service(
          pbi.factories.hpmFactory,
          pbi.factories.wpmpFactory,
          pbi.factories.routerFactory
        );

        this.report = powerbi.embed(embedContainer, config) as pbi.Report;

        // Aplicar filtro después de cargar el reporte
        this.report.on('loaded', () => {
          console.log('Reporte cargado con éxito');
          this.applyFilter(idEmpresa);

          // Cambiar la pestaña activa después de aplicar el filtro
          if (this.pageId) {
            this.setPage(this.pageId);
          }
        });
      } else {
        console.error('El contenedor de Power BI no se encontró en el DOM.');
      }
    });
  }

  applyFilter(idEmpresa: number): void {
    if (this.report) {
      const filter: pbi.models.IBasicFilter = {
        $schema: 'http://powerbi.com/product/schema#basic',
        target: { table: 'administracion TbEmpresas', column: 'id_empresa' },
        operator: 'In',
        values: [idEmpresa],
        filterType: pbi.models.FilterType.Basic
      };

      this.report
        .setFilters([filter])
        .then(() => {
          console.log(`Filtro aplicado correctamente para id_empresa: ${idEmpresa}`);
        })
        .catch((error) => {
          console.error('Error aplicando el filtro con setFilters:', error);
        });
    } else {
      console.error('this.report es null o undefined');
    }
  }

  setPage(pageId: string): void {
    if (!this.report) {
      console.error('El reporte no está disponible para cambiar la pestaña.');
      return;
    }

    // Verificar si el reporte está listo antes de cambiar de pestaña
    this.report.getPages().then((pages) => {
      const page = pages.find((p) => p.name === pageId);
      if (page) {
        page.setActive().catch((error) => {
          console.error('Error al establecer la página activa:', error);
        });
      } else {
        console.error('No se encontró la página especificada.');
      }
    }).catch((error) => {
      console.error('Error al obtener las páginas del reporte:', error);
    });
  }
}
 */