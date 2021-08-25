import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeControlDeTrabajoEnEquipoPage } from './juego-de-control-de-trabajo-en-equipo.page';

describe('JuegoDeControlDeTrabajoEnEquipoPage', () => {
  let component: JuegoDeControlDeTrabajoEnEquipoPage;
  let fixture: ComponentFixture<JuegoDeControlDeTrabajoEnEquipoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeControlDeTrabajoEnEquipoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeControlDeTrabajoEnEquipoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
