import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreComponent } from './score-component';

describe('ScoreComponent', () => {
  let component: ScoreComponent;
  let fixture: ComponentFixture<ScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoreComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
