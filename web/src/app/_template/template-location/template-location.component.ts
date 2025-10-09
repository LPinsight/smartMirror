import { AfterViewInit, Component } from '@angular/core';
import { DataService } from '../../_service/data.service';
import * as L from 'leaflet';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'assets/marker-icon-2x.png',
  iconUrl: 'assets/marker-icon.png',
  shadowUrl: 'assets/marker-shadow.png',
});

@Component({
  selector: 'app-template-location',
  templateUrl: './template-location.component.html',
  styleUrls: ['./template-location.component.scss']
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

  constructor(private data: DataService) {

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
    console.log("");
    
    // console.log('Center: ', this.map?.getCenter());
    // console.log('Zoom: ', this.map?.getZoom());
  }



}
