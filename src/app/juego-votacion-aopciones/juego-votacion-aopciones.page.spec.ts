import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoVotacionAOpcionesPage } from './juego-votacion-aopciones.page';

describe('JuegoVotacionAOpcionesPage', () => {
  let component: JuegoVotacionAOpcionesPage;
  let fixture: ComponentFixture<JuegoVotacionAOpcionesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoVotacionAOpcionesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoVotacionAOpcionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
