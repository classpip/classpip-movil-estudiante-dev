import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoColleccionPage } from './juego-colleccion.page';

describe('JuegoColleccionPage', () => {
  let component: JuegoColleccionPage;
  let fixture: ComponentFixture<JuegoColleccionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoColleccionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoColleccionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
