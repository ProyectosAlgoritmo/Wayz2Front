
/* import { Component, OnInit } from '@angular/core';
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
    const idEmpresa = '3'; // Cambia esto para probar diferentes valores

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
                  table: "administracion.TbEmpresa",
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
 */

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
    const idEmpresa = '3'; // Cambia esto para probar diferentes valores

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
                  table: "administracion.TbEmpresa",
                  column: "id_empresa",
                },
                operator: "In",
                values: [idEmpresa],
              } as pbi.models.IBasicFilter;

              this.report.updateFilters(pbi.models.FiltersOperations.Replace, [filter])
                .then(() => {
                  console.log(`Filter applied for id_empresa: ${idEmpresa}`);

                  // Obtener y mostrar los filtros actuales
                  this.report?.getFilters()
                    .then(filters => {
                      console.log('Current filters:', filters);
                    })
                    .catch(error => {
                      console.error('Error getting filters:', error);
                    });
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