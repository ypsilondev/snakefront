import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorSelectionComponent } from './color-selection.component';

describe('ColorSelectionComponent', () => {
  let component: ColorSelectionComponent;
  let fixture: ComponentFixture<ColorSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColorSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
