import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IniciPage } from './inici.page';

describe('IniciPage', () => {
  let component: IniciPage;
  let fixture: ComponentFixture<IniciPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IniciPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IniciPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
