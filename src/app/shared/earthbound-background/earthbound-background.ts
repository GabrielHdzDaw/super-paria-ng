import { Component, AfterViewInit, signal, input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Engine from 'src/assets/eb/src/engine';
import Rom from 'src/assets/eb/src/rom/rom';
import BackgroundLayer from 'src/assets/eb/src/rom/background_layer';
import { FormField } from '@angular/forms/signals';


@Component({
  selector: 'earthbound-bg',
  imports: [],
  templateUrl: 'earthbound-background.html',
})
export class EarthboundBgComponent implements AfterViewInit {
  constructor(private http: HttpClient) {}


  layer1 = input<number>(120);
  layer2 = input<number>(120);

  ngAfterViewInit() {
    this.http
      .get('eb/truncated_backgrounds.dat', { responseType: 'arraybuffer' })
      .subscribe((data: ArrayBuffer) => {
        const backgroundData = new Uint8Array(data);
        const ROM = new Rom(backgroundData);

        const layer1 = new BackgroundLayer(this.layer1(), ROM);
        const layer2 = new BackgroundLayer(this.layer2(), ROM);

        const engine = new Engine([layer1, layer2], {
          fps: 30,
          aspectRatio: 0,
          frameSkip: 1,
          alpha: [1, 1],
          canvas: document.getElementById('main'),
        });
        engine.animate(false);
      });
  }
}
