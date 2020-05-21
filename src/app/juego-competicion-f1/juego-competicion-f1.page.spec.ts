import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoCompeticionF1Page } from './juego-competicion-f1.page';

describe('JuegoCompeticionF1Page', () => {
  let component: JuegoCompeticionF1Page;
  let fixture: ComponentFixture<JuegoCompeticionF1Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoCompeticionF1Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoCompeticionF1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
