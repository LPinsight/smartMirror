import { AfterViewInit, Component } from '@angular/core';
import { DataService } from '@service/data.service';
import { Location } from '@interface/display';
import * as L from 'leaflet';
import { ToastrService } from 'ngx-toastr';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: './../../assets/marker-icon-2x.png',
  iconUrl: './../../assets/marker-icon.png',
  shadowUrl: './../../assets/marker-shadow.png',
});

@Component({
    selector: 'app-template-location',
    templateUrl: './template-location.component.html',
    styleUrls: ['./template-location.component.scss'],
    standalone: false
})
export class TemplateLocationComponent implements AfterViewInit{
  private map!: L.Map
  private markerLayer!: L.LayerGroup<any>;

  private initMap() {
    this.map = L.map('map', {
      center: [ 51.35149, 10.45412 ],
      zoom: 6
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  constructor(private dataService: DataService,
      private notification: ToastrService) {

  }

  ngAfterViewInit() {
    this.initMap()
    this.markerLayer = L.layerGroup().addTo(this.map)

    this.map.on('click', (event) => {
      this.markerLayer.clearLayers()
      this.map.closePopup()
      let marker = L.marker(event.latlng).addTo(this.markerLayer)
      marker.bindTooltip('Display Standort').openTooltip()
    })
      
  }

  click () {
    if(this.markerLayer.getLayers().length == 0) {
      this.notification.error('Bitte Standort in der Karte setzen', "Standort setzen", { progressBar: true })
      return
    }

    this.markerLayer.eachLayer((layer) => {      
      if (layer instanceof L.Marker) {
        this.dataService.SetLocation({
          lat: layer.getLatLng().lat,
          lon: layer.getLatLng().lng,
        }).subscribe( _ => {
          this.notification.success('Standort erfolgreich gesetzt', "Standort gesetzt", { progressBar: true })
        })
      }
    });
    
    // console.log('Center: ', this.map?.getCenter());
    // console.log('Zoom: ', this.map?.getZoom());
  }



}
