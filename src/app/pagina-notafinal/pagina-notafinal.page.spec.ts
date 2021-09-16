import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaNotafinalPage } from './pagina-notafinal.page';

describe('PaginaNotafinalPage', () => {
  let component: PaginaNotafinalPage;
  let fixture: ComponentFixture<PaginaNotafinalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaginaNotafinalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaginaNotafinalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
