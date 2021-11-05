import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoCompeticionTorneoPage } from './juego-competicion-torneo.page';

describe('JuegoCompeticionTorneoPage', () => {
  let component: JuegoCompeticionTorneoPage;
  let fixture: ComponentFixture<JuegoCompeticionTorneoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoCompeticionTorneoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoCompeticionTorneoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
