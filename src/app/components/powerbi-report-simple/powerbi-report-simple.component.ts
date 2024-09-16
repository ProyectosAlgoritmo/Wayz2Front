import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import * as pbi from 'powerbi-client';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-powerbi-report-simple',
  templateUrl: './powerbi-report-simple.component.html',
  styleUrls: ['./powerbi-report-simple.component.css'],
  standalone: true,
  imports: [HttpClientModule, CommonModule],
})
export class PowerBiReportSimpleComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const workspaceId = '98a959ef-cba7-420c-9c1b-4033999fc6fd';
    const reportId = 'nuevo-report-id'; // Reemplaza con un nuevo report ID válido
    const datasetId = 'nuevo-dataset-id'; // Reemplaza con un nuevo dataset ID válido

    this.loadPowerBiReport(workspaceId, reportId, datasetId);
  }

  loadPowerBiReport(workspaceId: string, reportId: string, datasetId: string): void {
    this.http
      .get<{ embedToken: string }>(`http://localhost:5215/api/powerbi/embedToken?workspaceId=${workspaceId}&reportId=${reportId}&datasetId=${datasetId}`)
      .subscribe((response) => {
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
            layoutType: pbi.models.LayoutType.Custom,
            customLayout: {
              displayOption: pbi.models.DisplayOption.FitToWidth,
            },
          },
        };

        const embedContainer = document.getElementById('embedContainer');
        if (embedContainer) {
          const powerbi = new pbi.service.Service(pbi.factories.hpmFactory, pbi.factories.wpmpFactory, pbi.factories.routerFactory);
          powerbi.embed(embedContainer, config);
        } else {
          console.error('El contenedor de Power BI no se encontró en el DOM.');
        }
      });
  }
}


import { Component, OnInit } from '@angular/core';
import * as pbi from 'powerbi-client';

//cual es la estructura de este componente
// 1. los imports
// 2. el decorador @Component
// 3. la clase del componente
// 4. el constructor
// 5. el metodo ngOnInit
// 6. el metodo loadPowerBiReport


