import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoAvatarPage } from './juego-avatar.page';

describe('JuegoAvatarPage', () => {
  let component: JuegoAvatarPage;
  let fixture: ComponentFixture<JuegoAvatarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoAvatarPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoAvatarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
