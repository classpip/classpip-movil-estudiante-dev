import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoCompeticionLigaPage } from './juego-competicion-liga.page';

describe('JuegoCompeticionLigaPage', () => {
  let component: JuegoCompeticionLigaPage;
  let fixture: ComponentFixture<JuegoCompeticionLigaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoCompeticionLigaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoCompeticionLigaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
