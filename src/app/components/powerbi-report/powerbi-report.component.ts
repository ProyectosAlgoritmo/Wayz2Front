/* import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as pbi from 'powerbi-client';

@Component({
  selector: 'app-powerbi-report',
  templateUrl: './powerbi-report.component.html',
  styleUrls: ['./powerbi-report.component.css'],
  standalone: true,
})
export class PowerBiReportComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPowerBiReport();
    console.log('PowerBiReportComponent initialized');
  }

  loadPowerBiReport(): void {
    this.http.get<{ embedToken: string }>('http://localhost:5215/api/powerbi/embedToken')
      .subscribe(response => {
        const embedUrl = 'https://app.powerbi.com/reportEmbed?reportId=e3757ac3-6350-44d5-a7c3-150c4021b84a&groupId=me';

        const config: pbi.IEmbedConfiguration = {
          type: 'report',
          id: 'e3757ac3-6350-44d5-a7c3-150c4021b84a',
          embedUrl: embedUrl,
          accessToken: response.embedToken,
          tokenType: pbi.models.TokenType.Embed,
          settings: {
            panes: {
              filters: {
                visible: false
              }
            }
          }
        };

        const embedContainer = document.getElementById('embedContainer');
        if (embedContainer) {
          const powerbi = new pbi.service.Service(pbi.factories.hpmFactory, pbi.factories.wpmpFactory, pbi.factories.routerFactory); // Crea una instancia del servicio
          powerbi.embed(embedContainer, config);  // Usa el método embed del servicio
        } else {
          console.error('El contenedor de Power BI no se encontró en el DOM.');
        }
      });
  }
}
 */

/* import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as pbi from 'powerbi-client';

@Component({
  selector: 'app-powerbi-report',
  templateUrl: './powerbi-report.component.html',
  styleUrls: ['./powerbi-report.component.css'],
  standalone: true,
})
export class PowerBiReportComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPowerBiReport();
    console.log('PowerBiReportComponent initialized');
  }

  loadPowerBiReport(): void {
    this.http.get<{ embedToken: string }>('http://localhost:5215/api/powerbi/embedToken')
      .subscribe(response => {
        console.log('Embed Token received:', response.embedToken);

        const embedUrl = 'https://app.powerbi.com/reportEmbed?reportId=445e1cca-f23b-4e80-ac17-77e75d064736&groupId=98a959ef-cba7-420c-9c1b-4033999fc6fd';
        console.log('Embed URL:', embedUrl);

        const config: pbi.IEmbedConfiguration = {
          type: 'report',
          id: '445e1cca-f23b-4e80-ac17-77e75d064736',
          embedUrl: embedUrl,
          accessToken: response.embedToken,
          tokenType: pbi.models.TokenType.Embed,
          settings: {
            panes: {
              filters: {
                visible: false
              }
            }
          }
        };

        const embedContainer = document.getElementById('embedContainer');
        if (embedContainer) {
          const powerbi = new pbi.service.Service(pbi.factories.hpmFactory, pbi.factories.wpmpFactory, pbi.factories.routerFactory); // Crea una instancia del servicio
          powerbi.embed(embedContainer, config);  // Usa el método embed del servicio
          console.log('Report embedded successfully');
        } else {
          console.error('El contenedor de Power BI no se encontró en el DOM.');
        }
      }, error => {
        console.error('Error while fetching the embed token:', error);
      });
  }
} */

 /*  import { Component, OnInit } from '@angular/core';
  import { HttpClient } from '@angular/common/http';
  import * as pbi from 'powerbi-client';
  
  @Component({
    selector: 'app-powerbi-report',
    templateUrl: './powerbi-report.component.html',
    styleUrls: ['./powerbi-report.component.css'],
    standalone: true,
  })
  export class PowerBiReportComponent implements OnInit {
    constructor(private http: HttpClient) {}
  
    ngOnInit(): void {
      this.loadPowerBiReport();
      console.log('PowerBiReportComponent initialized');
    }
  
    loadPowerBiReport(): void {
      this.http.get<{ embedToken: string }>('http://localhost:5215/api/powerbi/embedToken')
        .subscribe(response => {
          const embedUrl = 'https://app.powerbi.com/reportEmbed?reportId=445e1cca-f23b-4e80-ac17-77e75d064736&groupId=98a959ef-cba7-420c-9c1b-4033999fc6fd';
  
          const config: pbi.IEmbedConfiguration = {
            type: 'report',
            id: 'e3757ac3-6350-44d5-a7c3-150c4021b84a',
            embedUrl: embedUrl,
            accessToken: response.embedToken,
            tokenType: pbi.models.TokenType.Embed,
            settings: {
              panes: {
                filters: {
                  visible: false
                }
              }
            }
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
  } */

/* import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as pbi from 'powerbi-client';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-powerbi-report',
  templateUrl: './powerbi-report.component.html',
  styleUrls: ['./powerbi-report.component.css'],
  standalone: true,
})
export class PowerBiReportComponent implements OnInit {
  pageName: string = '';  // Inicializa con una cadena vacía

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Usa el operador de coalescencia nula para manejar el caso de null
    this.pageName = this.route.snapshot.paramMap.get('pageName') ?? '';  
    this.loadPowerBiReport();
  }

  loadPowerBiReport(): void {
    this.http.get<{ embedToken: string }>('http://localhost:5215/api/powerbi/embedToken')
      .subscribe(response => {
        const embedUrl = 'https://app.powerbi.com/reportEmbed?reportId=41899b84-92d7-4c7b-adbf-fcf7d7c82196&groupId=98a959ef-cba7-420c-9c1b-4033999fc6fd';

        const config: pbi.IEmbedConfiguration = {
          type: 'report',
          id: '41899b84-92d7-4c7b-adbf-fcf7d7c82196',
          embedUrl: embedUrl,
          accessToken: response.embedToken,
          tokenType: pbi.models.TokenType.Embed,
          pageName: this.pageName,  // Usa el pageName dinámico
          settings: {
            panes: {
              filters: {
                visible: false
              }
            }
          }
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

 */

/* import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import * as pbi from 'powerbi-client';

@Component({
  selector: 'app-powerbi-report',
  templateUrl: './powerbi-report.component.html',
  styleUrls: ['./powerbi-report.component.css'],
  standalone: true,
})
export class PowerBiReportComponent implements OnInit {
  pageName: string = '';

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.pageName = this.route.snapshot.paramMap.get('pageName') || 'Desempeño';
    this.loadPowerBiReport();
    console.log('PowerBiReportComponent initialized with page:', this.pageName);
  }

  loadPowerBiReport(): void {
    this.http.get<{ embedToken: string }>('http://localhost:5215/api/powerbi/embedToken')
      .subscribe(response => {
        const embedUrl = 'https://app.powerbi.com/reportEmbed?reportId=41899b84-92d7-4c7b-adbf-fcf7d7c82196&groupId=98a959ef-cba7-420c-9c1b-4033999fc6fd';

        const config: pbi.IEmbedConfiguration = {
          type: 'report',
          id: '41899b84-92d7-4c7b-adbf-fcf7d7c82196',
          embedUrl: embedUrl,
          accessToken: response.embedToken,
          tokenType: pbi.models.TokenType.Embed,
          pageName: this.pageName,
          settings: {
            panes: {
              filters: {
                visible: false
              }
            }
          }
        };

        const embedContainer = document.getElementById('embedContainer');
        if (embedContainer) {
          const powerbi = new pbi.service.Service(pbi.factories.hpmFactory, pbi.factories.wpmpFactory, pbi.factories.routerFactory);
          powerbi.reset(embedContainer);  // Resetea el contenedor antes de incrustar
          powerbi.embed(embedContainer, config);
          console.log('Report loaded for page:', this.pageName);
        } else {
          console.error('El contenedor de Power BI no se encontró en el DOM.');
        }
      });
  }
}
 */
/* import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as pbi from 'powerbi-client';

@Component({
  selector: 'app-powerbi-report',
  templateUrl: './powerbi-report.component.html',
  styleUrls: ['./powerbi-report.component.css'],
  standalone: true,
})
export class PowerBiReportComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadPowerBiReport();
    console.log('PowerBiReportComponent initialized');
  }

  loadPowerBiReport(): void {
    this.http.get<{ embedToken: string }>('http://localhost:5215/api/powerbi/embedToken')
      .subscribe(response => {
        const embedUrl = 'https://app.powerbi.com/reportEmbed?reportId=41899b84-92d7-4c7b-adbf-fcf7d7c82196&groupId=98a959ef-cba7-420c-9c1b-4033999fc6fd';

        const config: pbi.IEmbedConfiguration = {
          type: 'report',
          id: '41899b84-92d7-4c7b-adbf-fcf7d7c82196',
          embedUrl: embedUrl,
          accessToken: response.embedToken,
          tokenType: pbi.models.TokenType.Embed,
          settings: {
            panes: {
              filters: {
                visible: false
              }
            }
          }
        };

        const embedContainer = document.getElementById('embedContainer');
        if (embedContainer) {
          const powerbiService = new pbi.service.Service(pbi.factories.hpmFactory, pbi.factories.wpmpFactory, pbi.factories.routerFactory);
          const report = powerbiService.embed(embedContainer, config) as pbi.Report;

          // Cambio a la pestaña específica después de que el informe se cargue
          report.on("loaded", async () => {
            try {
              const pages = await report.getPages();
              const targetPage = pages.find(page => page.displayName === "No se donde van"); // Cambia aquí el nombre de la pestaña

              if (targetPage) {
                await targetPage.setActive();
                console.log(`La pestaña ${targetPage.displayName} se ha activado.`);
              } else {
                console.error('La pestaña especificada no se encontró.');
              }
            } catch (error) {
              console.error('Error al cambiar de pestaña:', error);
            }
          });

        } else {
          console.error('El contenedor de Power BI no se encontró en el DOM.');
        }
      });
  }
}
 */
/* import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import * as pbi from 'powerbi-client';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; // Asegúrate de importar CommonModule

@Component({
  selector: 'app-powerbi-report',
  templateUrl: './powerbi-report.component.html',
  styleUrls: ['./powerbi-report.component.css'],
  standalone: true,
  imports: [HttpClientModule, CommonModule], // Asegúrate de incluir HttpClientModule y CommonModule
})
export class PowerBiReportComponent implements OnInit {
  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const workspaceId = '98a959ef-cba7-420c-9c1b-4033999fc6fd'; // reemplaza con tu valor dinámico si es necesario
    const reportId = '41899b84-92d7-4c7b-adbf-fcf7d7c82196'; // reemplaza con tu valor dinámico si es necesario
    const datasetId = 'a59d26c9-dedb-43d8-b99d-082e31804112'; // reemplaza con tu valor dinámico si es necesario

    this.loadPowerBiReport(workspaceId, reportId, datasetId);
  }

  loadPowerBiReport(workspaceId: string, reportId: string, datasetId: string): void {
    this.http.get<{ embedToken: string }>(`http://localhost:5215/api/powerbi/embedToken?workspaceId=${workspaceId}&reportId=${reportId}&datasetId=${datasetId}`)
      .subscribe(response => {
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
                visible: false
              }
            },
            layoutType: pbi.models.LayoutType.Custom,
            customLayout: {
              displayOption: pbi.models.DisplayOption.FitToWidth,
            }
          }
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
 */

/* import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import * as pbi from 'powerbi-client';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-powerbi-report',
  templateUrl: './powerbi-report.component.html',
  styleUrls: ['./powerbi-report.component.css'],
  standalone: true,
  imports: [HttpClientModule, CommonModule],
})
export class PowerBiReportComponent implements OnInit {
  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const workspaceId = '98a959ef-cba7-420c-9c1b-4033999fc6fd';
    const reportId = '41899b84-92d7-4c7b-adbf-fcf7d7c82196';
    const datasetId = 'a59d26c9-dedb-43d8-b99-082e31804112';

    const pageName = this.route.snapshot.paramMap.get('pageName') || '';  // Obtener el nombre de la pestaña

    this.loadPowerBiReport(workspaceId, reportId, datasetId, pageName);
  }

  loadPowerBiReport(workspaceId: string, reportId: string, datasetId: string, pageName: string): void {
    this.http.get<{ embedToken: string }>(`http://localhost:5215/api/powerbi/embedToken?workspaceId=${workspaceId}&reportId=${reportId}&datasetId=${datasetId}`)
      .subscribe(response => {
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
                visible: false
              }
            },
            layoutType: pbi.models.LayoutType.Custom,
            customLayout: {
              displayOption: pbi.models.DisplayOption.FitToWidth,
            }
          },
          pageName: pageName // Agregar la página específica que deseas mostrar
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
 */
/* import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import * as pbi from 'powerbi-client';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-powerbi-report',
  templateUrl: './powerbi-report.component.html',
  styleUrls: ['./powerbi-report.component.css'],
  standalone: true,
  imports: [HttpClientModule, CommonModule],
})
export class PowerBiReportComponent implements OnInit {
  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const workspaceId = '98a959ef-cba7-420c-9c1b-4033999fc6fd';
    const reportId = '41899b84-92d7-4c7b-adbf-fcf7d7c82196';
    const datasetId = 'a59d26c9-dedb-43d8-b99-082e31804112';

    //const pageName = this.route.snapshot.paramMap.get('pageName') || ''; // Obtener el nombre de la pestaña
    const pageName = 'Rentabilidad';
    this.loadPowerBiReport(workspaceId, reportId, datasetId, pageName);
  }

  loadPowerBiReport(workspaceId: string, reportId: string, datasetId: string, pageName: string): void {
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
          const report = powerbi.embed(embedContainer, config) as pbi.Report;

          report.on('loaded', () => {
            // Forzar la carga de la página
            report.getPages().then((pages) => {
              const page = pages.find((p) => p.name === pageName);
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
          });

          // En caso de que el evento 'loaded' no se dispare correctamente, intentamos forzar la página
          setTimeout(() => {
            report.getPages().then((pages) => {
              const page = pages.find((p) => p.name === pageName);
              if (page) {
                page.setActive().catch((error) => {
                  console.error('Error al establecer la página activa en el intento forzado:', error);
                });
              }
            }).catch((error) => {
              console.error('Error en el intento forzado de obtener las páginas del reporte:', error);
            });
          }, 5000);
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
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-powerbi-report',
  templateUrl: './powerbi-report.component.html',
  styleUrls: ['./powerbi-report.component.css'],
  standalone: true,
  imports: [HttpClientModule, CommonModule],
})
export class PowerBiReportComponent implements OnInit {
  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const workspaceId = '98a959ef-cba7-420c-9c1b-4033999fc6fd';
    const reportId = '41899b84-92d7-4c7b-adbf-fcf7d7c82196';
    const datasetId = 'a59d26c9-dedb-43d8-b99-082e31804112';

    const pageName = '04625af12f4ee87bd5ab'; // Forzar la pestaña "Rentabilidad"
    

    this.loadPowerBiReport(workspaceId, reportId, datasetId, pageName);
  }

  loadPowerBiReport(workspaceId: string, reportId: string, datasetId: string, pageName: string): void {
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
          const report = powerbi.embed(embedContainer, config) as pbi.Report;

          report.on('loaded', () => {
            // Imprimir los nombres de todas las páginas
            report.getPages().then((pages) => {
              console.log('Pages:', pages.map(p => p.name)); // Imprime todos los nombres de las páginas
              
              const page = pages.find((p) => p.name === pageName);
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
          });

          setTimeout(() => {
            report.getPages().then((pages) => {
              const page = pages.find((p) => p.name === pageName);
              if (page) {
                page.setActive().catch((error) => {
                  console.error('Error al establecer la página activa en el intento forzado:', error);
                });
              }
            }).catch((error) => {
              console.error('Error en el intento forzado de obtener las páginas del reporte:', error);
            });
          }, 5000);
        } else {
          console.error('El contenedor de Power BI no se encontró en el DOM.');
        }
      });
  }
}
