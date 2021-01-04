import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoCuestionarioSatisfaccionPage } from './juego-cuestionario-satisfaccion.page';

describe('JuegoCuestionarioSatisfaccionPage', () => {
  let component: JuegoCuestionarioSatisfaccionPage;
  let fixture: ComponentFixture<JuegoCuestionarioSatisfaccionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoCuestionarioSatisfaccionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoCuestionarioSatisfaccionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
