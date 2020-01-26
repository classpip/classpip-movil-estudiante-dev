import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoSeleccionadoPage } from './juego-seleccionado.page';

describe('JuegoSeleccionadoPage', () => {
  let component: JuegoSeleccionadoPage;
  let fixture: ComponentFixture<JuegoSeleccionadoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoSeleccionadoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoSeleccionadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
