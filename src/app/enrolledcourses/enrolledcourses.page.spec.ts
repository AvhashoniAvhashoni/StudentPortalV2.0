import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EnrolledcoursesPage } from './enrolledcourses.page';

describe('EnrolledcoursesPage', () => {
  let component: EnrolledcoursesPage;
  let fixture: ComponentFixture<EnrolledcoursesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrolledcoursesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EnrolledcoursesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
