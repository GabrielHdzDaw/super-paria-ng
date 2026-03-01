import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarthboundBackground } from './earthbound-background';

describe('EarthboundBackground', () => {
  let component: EarthboundBackground;
  let fixture: ComponentFixture<EarthboundBackground>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EarthboundBackground]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EarthboundBackground);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
