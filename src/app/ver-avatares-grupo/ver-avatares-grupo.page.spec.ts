import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerAvataresGrupoPage } from './ver-avatares-grupo.page';

describe('VerAvataresGrupoPage', () => {
  let component: VerAvataresGrupoPage;
  let fixture: ComponentFixture<VerAvataresGrupoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerAvataresGrupoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerAvataresGrupoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
