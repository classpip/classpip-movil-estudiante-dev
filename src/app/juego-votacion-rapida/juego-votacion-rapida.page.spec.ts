import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoVotacionRapidaPage } from './juego-votacion-rapida.page';

describe('JuegoVotacionRapidaPage', () => {
  let component: JuegoVotacionRapidaPage;
  let fixture: ComponentFixture<JuegoVotacionRapidaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoVotacionRapidaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoVotacionRapidaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
