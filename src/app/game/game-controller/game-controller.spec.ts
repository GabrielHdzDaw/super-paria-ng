import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameController } from './game-controller';

describe('GameController', () => {
  let component: GameController;
  let fixture: ComponentFixture<GameController>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameController]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameController);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
